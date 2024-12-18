const Brand = require("../models/brand");
const AppError = require("../util/appError");
const exceptionHandler = require("../middlewares/exceptionHandler");

//@desc Get All Brands
//@route GET /api/brand/
//@access Private/Admin
exports.getAll = exceptionHandler(async (req, res, next) => {
  const storedBrands = await Brand.find();

  if (storedBrands.length === 0) {
    next(new AppError("No brands found", 404));
  }

  res.status(200).json({
    status: "success",
    data: storedBrands,
  });
});

//@desc Create a Brand
//@route POST /api/brand/
//@access Private/Admin
exports.create = exceptionHandler(async (req, res, next) => {
  const {
    name,
    logo,
    website,
    email,
    instagram,
    facebook,
    categories,
    status,
  } = req.body;

  const createdBrand = await Brand.create();

  if (createdBrand) {
    next(new AppError("Unable to create the brand", 400));
  }

  res.status(201).json({
    status: "success",
    data: createdBrand,
  });
});
