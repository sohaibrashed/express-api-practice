const Brand = require("../models/brand");
const Category = require("../models/category");
const AppError = require("../util/appError");
const exceptionHandler = require("../middlewares/exceptionHandler");
const validateObjectId = require("../util/validateObjectId");

//@desc Get All Brands
//@route GET /api/v1/brand/
//@access Private/Admin
exports.getAll = exceptionHandler(async (req, res, next) => {
  const storedBrands = await Brand.find().populate("categories");

  res.status(200).json({
    status: "success",
    results: storedBrands.length,
    data: storedBrands.length > 0 ? storedBrands : [],
  });
});

//@desc Get Single Brand
//@route GET /api/v1/brand/:id
//@access Private/Admin
exports.getById = exceptionHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id).populate("categories");

  if (!brand) {
    return next(new AppError("Brand not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: brand,
  });
});

//@desc Create a Brand
//@route POST /api/v1/brand/
//@access Private/Admin
exports.create = exceptionHandler(async (req, res, next) => {
  const {
    name,
    logo,
    contactInfo: { website, email, socialMedia: { instagram, facebook } } = {},
    categories,
    status,
  } = req.body;

  const validCategories = await Promise.all(
    categories.map(async (name) => await validateObjectId(Category, name))
  );

  const brandData = {
    name,
    logo,
    contactInfo: {
      website,
      email,
      socialMedia: {
        instagram,
        facebook,
      },
    },
    categories: validCategories,
    status,
  };

  const createdBrand = await Brand.create(brandData);

  if (!createdBrand) {
    return next(new AppError("Unable to create the brand", 400));
  }

  res.status(201).json({
    status: "success",
    data: createdBrand,
  });
});

//@desc Update a Brand
//@route PATCH /api/v1/brand/:id
//@access Private/Admin
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const {
    name,
    logo,
    contactInfo: {
      website,
      email,
      socialMedia: { instagram, facebook } = {},
    } = {},
    categories,
    status,
  } = req.body;

  const brandData = {};

  if (name !== undefined) brandData.name = name;
  if (logo !== undefined) brandData.logo = logo;
  if (status !== undefined) brandData.status = status;

  if (categories !== undefined) {
    const validCategories = await Promise.all(
      categories.map(async (name) => await validateObjectId(Category, name))
    );
    brandData.categories = validCategories;
  }

  if (website || email || instagram || facebook) {
    brandData.contactInfo = {};

    if (website !== undefined) brandData.contactInfo.website = website;
    if (email !== undefined) brandData.contactInfo.email = email;

    if (instagram || facebook) {
      brandData.contactInfo.socialMedia = {};

      if (instagram !== undefined)
        brandData.contactInfo.socialMedia.instagram = instagram;
      if (facebook !== undefined)
        brandData.contactInfo.socialMedia.facebook = facebook;
    }
  }

  const updatedBrand = await Brand.findByIdAndUpdate(id, brandData, {
    new: true,
    runValidators: true,
  }).populate("categories");

  if (!updatedBrand) {
    return next(new AppError("Brand not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedBrand,
  });
});

//@desc Delete a Brand
//@route DELETE /api/v1/brand/:id
//@access Private/Admin
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const deletedBrand = await Brand.findByIdAndDelete(req.params.id);

  if (!deletedBrand) {
    return next(new AppError("Brand not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Brand deleted successfully",
  });
});

//@desc Search Brands
//@route GET /api/v1/brand/search
//@access Private/Admin
exports.search = exceptionHandler(async (req, res, next) => {
  const { query, status, category } = req.query;

  const searchQuery = {};

  if (query) {
    searchQuery.name = { $regex: query, $options: "i" };
  }

  if (status) {
    searchQuery.status = status;
  }

  if (category) {
    searchQuery.categories = category;
  }

  const brands = await Brand.find(searchQuery).populate("categories");

  if (brands.length === 0) {
    return next(new AppError("No brands found matching your criteria", 404));
  }

  res.status(200).json({
    status: "success",
    results: brands.length,
    data: brands.length > 0 ? brands : [],
  });
});
