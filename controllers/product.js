const Product = require("../models/product");
const Category = require("../models/category");
const SubCategory = require("../models/subCategory");
const Brand = require("../models/brand");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const validateObjectId = require("../util/validateObjectId");

async function validateSubCategory(categoryName, subCategoryName) {
  if (!categoryName || !subCategoryName) {
    throw new AppError("Category and Subcategory names are required");
  }

  const category = await Category.findOne({ name: categoryName });

  if (!category) {
    throw new AppError(`Invalid Category: ${categoryName}`);
  }

  const subCategory = await SubCategory.findOne({
    name: subCategoryName,
    category: category._id,
  });

  if (!subCategory) {
    throw new AppError(
      `Invalid Subcategory: ${subCategoryName} for category ${categoryName}`
    );
  }

  return subCategory._id;
}

//@desc Get all products
//@route GET /api/v1/products/
//@access Public
exports.getAll = exceptionHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 10,
    category,
    subCategory,
    brand,
    priceMin,
    priceMax,
    search,
    sort,
    size,
    color,
    gender,
    seasonality,
    minRating,
    inStock,
  } = req.query;

  const filter = {};

  if (category) filter.category = await validateObjectId(Category, category);
  if (subCategory)
    filter.subCategory = await validateObjectId(SubCategory, subCategory);
  if (brand) filter.brand = await validateObjectId(Brand, brand);

  if (priceMin || priceMax) {
    filter["price.base"] = {};
    if (priceMin) filter["price.base"].$gte = parseFloat(priceMin);
    if (priceMax) filter["price.base"].$lte = parseFloat(priceMax);
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  if (size || color) {
    filter.variants = {
      $elemMatch: {
        ...(size && { size }),
        ...(color && { color }),
      },
    };
  }

  if (gender) filter.gender = gender;
  if (seasonality) filter.seasonality = seasonality;
  if (minRating) filter["ratings.average"] = { $gte: parseFloat(minRating) };

  if (inStock === "true") {
    filter.variants = {
      $elemMatch: { stock: { $gt: 0 } },
    };
  }

  const sortOptions = {
    "price-low-high": { "price.base": 1 },
    "price-high-low": { "price.base": -1 },
    "rating-high-low": { "ratings.average": -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "a-z": { name: 1 },
    "z-a": { name: -1 },
  };

  const sortOrder = sortOptions[sort] || { createdAt: -1 };

  const { data, pagination } = await paginate(
    Product,
    filter,
    sortOrder,
    [
      { path: "category", select: "name" },
      { path: "subCategory", select: "name" },
      { path: "brand", select: "name" },
    ],
    page,
    limit
  );

  if (!data || data.length === 0) {
    return next(new AppError("No products found.", 404));
  }

  res.status(200).json({
    status: "success",
    pagination,
    products: data,
  });
});

//@desc Get a product
//@route GET /api/v1/products/:id
//@access Public
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("subCategory", "name")
    .populate("brand", "name logo");

  if (!product) {
    return next(new AppError(`Product with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    product,
  });
});

//@desc Create a product
//@route POST /api/v1/products/
//@access Private/Admin
exports.create = exceptionHandler(async (req, res, next) => {
  const {
    name,
    description,
    price,
    category,
    subCategory,
    brand,
    variants,
    materials,
    tags,
    seasonality,
    gender,
  } = req.body;

  const [validCategory, validSubCategory, validBrand] = await Promise.all([
    validateObjectId(Category, category),
    validateSubCategory(category, subCategory),
    validateObjectId(Brand, brand),
  ]);

  const product = await Product.create({
    name,
    description,
    price,
    category: validCategory,
    subCategory: validSubCategory,
    brand: validBrand,
    variants,
    materials,
    tags,
    seasonality,
    gender,
  });

  if (!product) {
    return next(
      new AppError("Something went wrong while creating the product", 400)
    );
  }

  res.status(201).json({
    status: "success",
    product,
  });
});

//@desc Delete a product
//@route DELETE /api/v1/products/:id
//@access Private/Admin
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedProduct = await Product.findByIdAndDelete(id);

  if (!deletedProduct) {
    return next(new AppError(`Product with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    message: "Product successfully deleted",
    product: deletedProduct,
  });
});

//@desc Update a product
//@route PATCH /api/v1/products/:id
//@access Private/Admin
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const [validCategory, validSubCategory, validBrand] = await Promise.all([
    validateObjectId(Category, updateData.category),
    validateSubCategory(updateData.category, updateData.subCategory),
    validateObjectId(Brand, updateData.brand),
  ]);

  updateData.category = validCategory;
  updateData.subCategory = validSubCategory;
  updateData.brand = validBrand;

  const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    new: true,
    context: "query",
  });

  if (!updatedProduct) {
    return next(new AppError(`Product with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    product: updatedProduct,
  });
});

//@desc Get trending products
//@route GET /api/v1/products/trending
//@access Public
exports.getTrending = exceptionHandler(async (req, res, next) => {
  const limit = 10;

  const trendingProducts = await Product.find({
    "ratings.average": { $gte: 4 },
  })
    .sort({ "ratings.average": -1 })
    .limit(Number(limit))
    .populate("category", "name")
    .populate("brand", "name");

  if (trendingProducts.length === 0) {
    return next(new AppError("No trending products found", 404));
  }

  res.status(200).json({
    status: "success",
    count: trendingProducts.length,
    products: trendingProducts,
  });
});
