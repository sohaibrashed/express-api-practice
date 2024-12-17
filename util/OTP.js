const twilio = require("twilio");
const OTP = require("../models/OTP");
const crypto = require("crypto");

// Twilio client initialization
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate a random 6-digit OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP via WhatsApp
async function sendOTP(phoneNumber) {
  const otp = generateOTP();

  try {
    // Save OTP to MongoDB
    await OTP.create({ phoneNumber, otp });

    // Send OTP via Twilio WhatsApp API
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:${phoneNumber}`,
      body: `Your verification code is: ${otp}. It is valid for 5 minutes.`,
    });

    console.log(`OTP sent to WhatsApp: ${phoneNumber}`);
    return { success: true, message: "OTP sent successfully." };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, message: "Failed to send OTP." };
  }
}

// Verify OTP
async function verifyOTP(phoneNumber, enteredOTP) {
  const otpRecord = await OTP.findOne({ phoneNumber, otp: enteredOTP });

  if (!otpRecord) {
    return { success: false, message: "Invalid OTP or expired." };
  }

  // OTP is valid - delete it to prevent reuse
  await OTP.deleteOne({ _id: otpRecord._id });

  return { success: true, message: "OTP verified successfully." };
}

module.exports = { sendOTP, verifyOTP };
