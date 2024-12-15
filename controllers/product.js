const Product = require("../models/product");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");

exports.getAll = exceptionHandler(async (req, res, next) => {
  const {
    page,
    category,
    subCategory,
    priceMin,
    priceMax,
    search,
    sort,
    size,
    ratings,
    stock,
  } = req.query;

  const filter = {};

  if (page) filter.page = page;

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  if (priceMin) filter.price = { ...filter.price, $gte: parseFloat(priceMin) };
  if (priceMax) filter.price = { ...filter.price, $lte: parseFloat(priceMax) };

  if (size) filter.size = size;

  if (ratings) filter.ratings = { $gte: parseInt(ratings) };

  if (stock === "in") filter.stock = { $gt: 0 };
  if (stock === "out") filter.stock = 0;

  if (search) filter.name = { $regex: search, $options: "i" };

  let sortOrder = {};
  switch (sort) {
    case "a-z":
      sortOrder = { name: 1 };
      break;
    case "z-a":
      sortOrder = { name: -1 };
      break;
    case "low-high":
      sortOrder = { price: 1 };
      break;
    case "high-low":
      sortOrder = { price: -1 };
      break;
    case "old-new":
      sortOrder = { createdAt: 1 };
      break;
    case "new-old":
      sortOrder = { createdAt: -1 };
      break;
    default:
      sortOrder = { createdAt: -1 };
  }

  const { data, pagination } = await paginate(Product, filter, sortOrder, [
    { path: "category", select: "name" },
    { path: "subCategory", select: "name" },
  ]);

  if (!data) {
    const error = new Error("No products found");
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
  const { id } = req.params;
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

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    {
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
    },
    { runValidators: true, new: true }
  );

  if (!updatedProduct) {
    throw new Error("Product could not be created");
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

exports.getCategories = exceptionHandler(async (req, res) => {
  const allCategories = await Category.find({});

  if (allCategories.length === 0) {
    throw new Error("Unable to fetch all categories");
  }

  res.status(200).json({
    status: "success",
    data: allCategories,
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

exports.getSubCategories = exceptionHandler(async (req, res) => {
  const allSubCategories = await SubCategory.find({}).populate(
    "category",
    "_id name"
  );

  if (allSubCategories.length === 0) {
    throw new Error("Unable to fetch all sub-categories");
  }

  res.status(200).json({
    status: "success",
    data: allSubCategories,
  });
});
