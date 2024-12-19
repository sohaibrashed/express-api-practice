const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const { verifyOTP, sendOTP } = require("../util/OTP");

//@desc Send an otp
//@route POST /api/otp/send-otp
//@access Public
exports.sendingOTP = exceptionHandler(async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return next(new AppError("Phone number is required."));
  }

  const result = await sendOTP(phoneNumber);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  throw new Error(result.message);
});

//@desc verify an otp
//@route POST /api/otp/verify-otp
//@access Public
exports.verifyingOTP = exceptionHandler(async (req, res, next) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return next(new AppError("Phone number and OTP are required."));
  }

  const result = await verifyOTP(phoneNumber, otp);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  throw new Error(result.message);
});
