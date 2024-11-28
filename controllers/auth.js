const User = require("../models/user");
const { generateToken } = require("../util/generateToken");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.signup = exceptionHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    role,
  });

  if (!newUser) {
    const error = new Error("Something went wrong with signup");
    error.statusCode = 400;
    throw error;
  }

  const token = generateToken(res, newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: newUser,
  });
});

exports.signin = exceptionHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(res, user._id);

    res.status(200).json({
      status: "success",
      token,
      data: user,
    });
  } else {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }
});

exports.signout = exceptionHandler(async (req, res, next) => {
  res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });

  res.status(200).json({
    status: "success",
    message: "user signout successfull",
  });
});
