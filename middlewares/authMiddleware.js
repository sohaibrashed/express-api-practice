const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt;

    if (!token) {
      throw new Error("No token found");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user._id) {
      throw new Error("User not found");
    }

    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.checkAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      throw new Error("Not authorized as admin");
    }
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};
