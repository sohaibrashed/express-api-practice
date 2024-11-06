const User = require("../models/userModel");
const { generateToken } = require("../util/generateToken");
const paginate = require("../util/paginate");

exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(201).json({
        status: "success",
        message: user,
      });
    } else {
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newUser = await User.create({
      email,
      password,
      role,
    });

    if (newUser) {
      generateToken(res, newUser._id);
      res.status(201).json({
        status: "success",
        message: newUser,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.signout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(200).json({
      status: "success",
      message: "user signout successfull",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { data: users, pagination } = await paginate(User, req.query);

    res.status(200).json({
      status: "success",
      pagination,
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) throw new Error("User not found");

    res.status(200).json({
      status: "success",
      message: user,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedUser = await User.deleteOne({ _id: id });

    res.status(200).json({
      status: "success",
      message: deletedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
