const User = require("../models/user");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.create = exceptionHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const newUser = await User.create({ name, email, password, role, phone });

  if (!newUser) {
    const error = new Error("user NOT created!");
    error.statusCode = 400;
    throw error;
  }

  res.status(201).json({
    status: "success",
    data: newUser,
  });
});

exports.getAll = exceptionHandler(async (req, res) => {
  const { data, pagination } = await paginate(User, req.query);

  if (!data) {
    const error = new Error("users data not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    pagination,
    data,
  });
});

exports.getOne = exceptionHandler(async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    const error = new Error(`user with this ID: ${id} doesn't exist`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.deleteOne = exceptionHandler(async (req, res) => {
  const id = req.params.id;

  const deletedUser = await User.findByIdAndDelete({ _id: id });

  if (!deletedUser) {
    const error = new Error(`user with this ID: ${id} doesn't exist`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    deletedUser,
  });
});

exports.updateOne = exceptionHandler(async (req, res) => {
  const id = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    runValidators: true,
  });

  if (!updatedUser) {
    const error = new Error(`user with this ID: ${id} doesn't exist`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    updatedUser,
  });
});
