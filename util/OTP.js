const crypto = require("crypto");
const client = require("../config/twilio");
const OTP = require("../models/OTP");

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

async function sendOTP(phoneNumber) {
  const otp = generateOTP();

  try {
    await OTP.create({ phoneNumber, otp });

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

async function verifyOTP(phoneNumber, enteredOTP) {
  try {
    const otpRecord = await OTP.findOne({ phoneNumber, otp: enteredOTP });

    if (!otpRecord) {
      return { success: false, message: "Invalid OTP or expired." };
    }

    await OTP.deleteOne({ _id: otpRecord._id });

    return { success: true, message: "OTP verified successfully." };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Failed to verify OTP." };
  }
}

module.exports = { sendOTP, verifyOTP };
