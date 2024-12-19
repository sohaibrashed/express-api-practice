const User = require("../models/user");
const { generateToken } = require("../util/generateToken");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");

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

  const token = generateToken(res, newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.signin = exceptionHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    await User.findByIdAndUpdate(user._id, { isActive: true });

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } else {
    return next(new AppError("Invalid email or password", 400));
  }
});

exports.signout = exceptionHandler(async (req, res, next) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });

  res.status(200).json({
    status: "success",
    message: "user signed out successfully",
  });
});
