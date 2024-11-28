const Product = require("../models/product");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.getAll = exceptionHandler(async (req, res, next) => {
  const { data, pagination } = await paginate(Product, req.query);

  if (!data) {
    const error = new Error("products doesn't exist");
    error.statusCode = 400;
    throw error;
  }

  res.status(200).json({
    status: "success",
    pagination,
    products: data,
  });
});

exports.getOne = exceptionHandler(async (req, res, next) => {
  const id = req.params.id;

  const product = await Product.findById(id);

  if (!product) {
    const error = new Error(`product with this ID: ${id} doesn't exist`);
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    status: "success",
    product,
  });
});

exports.create = exceptionHandler(async (req, res, next) => {
  const product = await Product.create({ ...req.body });

  if (!product) {
    const error = new Error("product NOT created");
    error.statusCode = 400;
    throw error;
  }

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.deleteOne = exceptionHandler(async (req, res, next) => {
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
});

exports.updateOne = exceptionHandler(async (req, res, next) => {
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
});
