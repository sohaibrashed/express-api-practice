const Product = require("../models/productModel");
const paginate = require("../util/paginate");

exports.getAllProducts = async (req, res) => {
  try {
    const { data: products, pagination } = await paginate(Product, req.query);

    res.status(200).json({
      status: "success",
      pagination,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById(id);

    res.status(200).json({
      status: "success",
      message: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create({ ...req.body });

    res.status(201).json({
      status: "success",
      message: product,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Product.deleteOne({ _id: id });
    res.status(200).json({
      status: "success",
      message: deletedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      message: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      status: "success",
      message: error.message,
    });
  }
};
