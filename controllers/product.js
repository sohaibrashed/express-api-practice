const Product = require("../models/product");
const paginate = require("../util/paginate");

exports.getAll = async (req, res, next) => {
  try {
    const { data, pagination } = await paginate(Product, req.query);

    if (!data) {
      const error = new Error("products doesn't exist");
      error.statusCode = 400;
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

    const product = await Product.findById(id);

    if (!product) {
      const error = new Error(`product with this ID: ${id} doesn't exist`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create({ ...req.body });

    if (!product) {
      const error = new Error("product NOT created");
      error.statusCode = 400;
      throw error;
    }

    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteOne = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete({ _id: id });

    if (!deletedProduct) {
      const error = new Error(`product with this ID: ${id} doesn't exist`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateOne = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });

    if (!updatedProduct) {
      const error = new Error(`product with this ID: ${id} doesn't exist`);
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      status: "success",
      updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
