const exceptionHandler = require("../middlewares/exceptionHandler");
const { verifyOTP, sendOTP } = require("../util/OTP");

exports.sendingOTP = exceptionHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    throw new Error("Phone number is required.");
  }

  const result = await sendOTP(phoneNumber);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  throw new Error(result.message);
});

exports.verifyingOTP = exceptionHandler(async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    throw new Error("Phone number and OTP are required.");
  }

  const result = await verifyOTP(phoneNumber, otp);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  throw new Error(result.message);
});
