const User = require("../models/user");
const paginate = require("../util/paginate");

exports.create = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    const newUser = await User.create({ email, password, role });

    if (!newUser) {
      const error = new Error("user NOT created!");
      error.statusCode = 400;
      throw error;
    }

    res.status(201).json({
      status: "success",
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      const error = new Error(`user with this ID: ${id} doesn't exist`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};
