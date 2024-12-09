const Product = require("../models/product");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.getAll = exceptionHandler(async (req, res, next) => {
  const { data, pagination } = await paginate(Product, req.query, [
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
  ]);

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

  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("subCategory", "name");

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
  const {
    name,
    description,
    price,
    category,
    subCategory,
    size,
    color,
    material,
    stock,
    ratings,
    tags,
    brand,
    images,
  } = req.body;

  const validCategory = await Category.findOne({ name: category });
  const validSubCategory = await SubCategory.findOne({ name: subCategory });

  if (!validCategory) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  if (
    !validSubCategory ||
    validSubCategory.category.toString() !== validCategory._id.toString()
  ) {
    const error = new Error(
      "Invalid sub-category ID or it does not match the category"
    );
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.create({
    name,
    description,
    price,
    category: validCategory._id,
    subCategory: validSubCategory._id,
    size,
    color,
    material,
    stock,
    ratings,
    tags,
    brand,
    images,
  });

  if (!product) {
    throw new Error("Product could not be created");
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

exports.getTrending = exceptionHandler(async (req, res) => {
  const trendingProducts = await Product.find({ ratings: { $gte: 4 } })
    .sort({ ratings: -1, stock: -1 })
    .limit(process.env.TREND_LIMIT || 10);

  if (trendingProducts.length === 0) {
    throw new Error("No trending products found");
  }

  res.status(200).json({
    status: "success",
    count: trendingProducts.length,
    products: trendingProducts,
  });
});

exports.createCategory = exceptionHandler(async (req, res) => {
  const { name } = req.body;

  const newCategory = await Category.create({ name });

  if (!newCategory) {
    throw new Error("Failed to Created a new Category");
  }

  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

exports.createSubCategory = exceptionHandler(async (req, res) => {
  const { name, category } = req.body;

  const existingCategory = await Category.findOne({ name: category });

  if (!existingCategory) {
    throw new Error("Failed to find Category");
  }

  const newSubCategory = await SubCategory.create({
    name,
    category: existingCategory._id,
  });

  if (!newSubCategory) {
    throw new Error("Failed to create Sub-Category");
  }

  res.status(201).json({
    status: "success",
    data: newSubCategory,
  });
});
