const User = require("../models/user");
const paginate = require("../util/paginate");
const AppError = require("../util/appError");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.create = exceptionHandler(async (req, res, next) => {
  const { name, email, password, role, phone } = req.body;

  const newUser = await User.create({ name, email, password, role, phone });

  if (!newUser) {
    return next(
      new AppError("Something went wrong while creating the user", 400)
    );
  }

  res.status(201).json({
    status: "success",
    user: newUser,
  });
});

exports.getAll = exceptionHandler(async (req, res, next) => {
  const { data, pagination } = await paginate(User, req.query);

  if (!data) {
    return next(new AppError("No users found", 404));
  }

  res.status(200).json({
    status: "success",
    pagination,
    users: data,
  });
});

exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new AppError(`user with this ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedUser = await User.findByIdAndDelete({ _id: id });

  if (!deletedUser) {
    return next(new AppError(`user with this ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    user: deletedUser,
  });
});

exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });

  if (!updatedUser) {
    return next(new AppError(`user with this ID: ${id} doesn't exist`, 404));
  }

  res.status(200).json({
    status: "success",
    user: updatedUser,
  });
});
