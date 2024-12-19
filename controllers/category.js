const Category = require("../models/category");
const SubCategory = require("../models/subCategory");

const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");

exports.createCategory = exceptionHandler(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({ name });

  if (!newCategory) {
    return next(new AppError("Failed to Created a new Category", 400));
  }

  res.status(201).json({
    status: "success",
    data: newCategory,
  });
});

exports.getCategories = exceptionHandler(async (req, res, next) => {
  const allCategories = await Category.find({});

  if (allCategories.length === 0) {
    return next(new AppError("Categories not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: allCategories,
  });
});

exports.createSubCategory = exceptionHandler(async (req, res, next) => {
  const { name, category } = req.body;

  const existingCategory = await Category.findOne({ name: category });

  if (!existingCategory) {
    return next(new AppError("Failed to find Category", 404));
  }

  const newSubCategory = await SubCategory.create({
    name,
    category: existingCategory._id,
  });

  if (!newSubCategory) {
    return next(new AppError("Failed to create Sub-Category", 400));
  }

  res.status(201).json({
    status: "success",
    data: newSubCategory,
  });
});

exports.getSubCategories = exceptionHandler(async (req, res, next) => {
  const allSubCategories = await SubCategory.find({}).populate(
    "category",
    "_id name"
  );

  if (allSubCategories.length === 0) {
    return next(new AppError("Sub-Categories not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: allSubCategories,
  });
});
