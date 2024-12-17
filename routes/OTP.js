const express = require("express");
const { sendingOTP, verifyingOTP } = require("../controllers/OTP");

const router = express.Router();

router.route("/send-otp").post(sendingOTP);

router.route("/verify-otp").post(verifyingOTP);

module.exports = router;
