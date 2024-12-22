const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.OTP_RESET_TOKEN_EXP || 300,
  },
});

const OTP = mongoose.model("OTP", otpSchema);

module.exports = OTP;
