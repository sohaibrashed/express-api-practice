const Category = require("../models/category");
const SubCategory = require("../models/subCategory");

const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");

//@desc Create a category
//@route POST /api/v1/category/
//@access Private/Admin
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

//@desc Get all categories
//@route GET /api/v1/category/
//@access Private/Admin
exports.getCategories = exceptionHandler(async (req, res, next) => {
  const allCategories = await Category.find({});

  res.status(200).json({
    status: "success",
    data: allCategories > 0 ? allCategories : [],
  });
});

//@desc Create a sub-category
//@route POST /api/v1/category/subcategory
//@access Private/Admin
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

//@desc Get all sub-category
//@route POST /api/v1/category/subcategory
//@access Private/Admin
exports.getSubCategories = exceptionHandler(async (req, res, next) => {
  const allSubCategories = await SubCategory.find({}).populate(
    "category",
    "_id name"
  );

  res.status(200).json({
    status: "success",
    data: allSubCategories.length > 0 ? allSubCategories : [],
  });
});
