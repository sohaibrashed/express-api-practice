const User = require("../models/user");
const { generateToken } = require("../util/generateToken");

exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(201).json({
        status: "success",
        data: user,
      });
    } else {
      const error = new Error("Invalid email or password");
      error.statusCode = 400;
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const newUser = await User.create({
      email,
      password,
      role,
    });

    if (!newUser) {
      const error = new Error("Something went wrong with signup");
      error.statusCode = 400;
      throw error;
    }

    generateToken(res, newUser._id);
    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.signout = async (req, res, next) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      status: "success",
      message: "user signout successfull",
    });
  } catch (error) {
    next(error);
  }
};
