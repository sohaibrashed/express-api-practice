const crypto = require("crypto");
const { generateToken } = require("../util/generateToken");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const User = require("../models/user");
const {
  sendEmail,
  sendVerificationEmail,
  verifyEmail,
} = require("../config/nodemailer");
const {
  generateVerificationToken,
  createPasswordResetTemplate,
} = require("../util/helper");

//@desc Create a account
//@route POST /api/v1/users/signup/
//@access Public
exports.signup = exceptionHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    role,
    phone,
    isActive: true,
  });

  if (!newUser) {
    return next(new AppError("Something went wrong with signup", 400));
  }

  await sendVerificationEmail(newUser);

  const token = generateToken(res, newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
    message: "Verification email sent. Please check your inbox.",
  });
});

//@desc Sign in to account
//@route POST /api/v1/users/signin/
//@access Public
exports.signin = exceptionHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    await User.findByIdAndUpdate(user._id, {
      isActive: true,
      lastLoginAt: Date.now(),
    });

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } else {
    return next(new AppError("Invalid email or password", 400));
  }
});

//@desc Sign out of account
//@route POST /api/v1/users/signout/
//@access Public
exports.signout = exceptionHandler(async (req, res, next) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });

  res.status(200).json({
    status: "success",
    message: "user signed out successfully",
  });
});

//@desc Reset password
//@route POST /api/v1/users/forgot-password/
//@access Public
exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("No user found with that email address", 404);
  }

  const { token, hash } = generateVerificationToken();

  // Save password reset token
  user.resetToken = hash;
  user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const template = createPasswordResetTemplate(resetUrl);

  try {
    await sendEmail(user.email, template.subject, template.text, template.html);

    res.status(200).json({
      status: "success",
      message: "Password reset link sent to email",
    });
  } catch (error) {
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save({ validateBeforeSave: false });

    throw new AppError(
      "There was an error sending the password reset email. Please try again later.",
      500
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash token from URL
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with valid token
  const user = await User.findOne({
    resetToken: hashedToken,
    resetTokenExpiration: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Invalid or expired password reset token", 400);
  }

  // Update password
  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpiration = undefined;
  await user.save();

  // Generate new JWT
  const jwtToken = generateToken(res, user._id);

  res.status(200).json({
    status: "success",
    token: jwtToken,
    message: "Password successfully reset",
  });
};

exports.verifyEmail = exceptionHandler(async (req, res, next) => {
  const { token } = req.params;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    verificationToken: hashedToken,
    emailVerified: false,
  });

  if (!user) {
    return next(new AppError("Invalid or expired verification link", 400));
  }

  user.emailVerified = true;
  user.verificationToken = undefined;
  await user.save();

  // You can either redirect to frontend or send JSON response
  // Option 1: Redirect to frontend
  // res.redirect(`${process.env.FRONTEND_URL}/email-verified`);

  res.status(200).json({
    status: "success",
    message: "Email verified successfully",
  });
});
