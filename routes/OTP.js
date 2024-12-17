const express = require("express");
const { sendOTP, verifyOTP } = require("../util/OTP");

const router = express.Router();

// Route to send OTP via WhatsApp
router.post("/send-otp", async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required." });
  }

  const result = await sendOTP(phoneNumber);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  return res.status(500).json({ message: result.message });
});

// Route to verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res
      .status(400)
      .json({ message: "Phone number and OTP are required." });
  }

  const result = await verifyOTP(phoneNumber, otp);

  if (result.success) {
    return res.status(200).json({ message: result.message });
  }

  return res.status(400).json({ message: result.message });
});

module.exports = router;
