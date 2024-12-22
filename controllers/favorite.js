const Favorite = require("../models/favorite");
const Product = require("../models/product");
const AppError = require("../util/appError");
const exceptionHandler = require("../middlewares/exceptionHandler");

//@desc Add a product to favorites
//@route POST /api/v1/favorites/
//@access Private
exports.create = exceptionHandler(async (req, res, next) => {
  const { productId } = req.body;
  const userId = req.user.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const favorite = await Favorite.create({ userId, productId });

  res.status(201).json({
    status: "success",
    favorite,
  });
});

//@desc Get all favorite products of a user
//@route GET /api/v1/favorites/
//@access Private
exports.getAll = exceptionHandler(async (req, res, next) => {
  const userId = req.user.id;

  const favorites = await Favorite.find({ userId }).populate("productId");

  res.status(200).json({
    status: "success",
    data: favorites.length > 0 ? favorites : [],
  });
});

//@desc Get a single favorite
//@route GET /api/v1/favorites/:id
//@access Private
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const favorite = await Favorite.findById(id).populate("productId");

  if (!favorite) {
    return next(
      new AppError(`Favorite with this ID: ${id} doesn't exist`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    favorite,
  });
});

//@desc Remove a product from favorites
//@route DELETE /api/v1/favorites/:id
//@access Private
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const deletedFavorite = await Favorite.findByIdAndDelete(id);

  if (!deletedFavorite) {
    return next(
      new AppError(`Favorite with this ID: ${id} doesn't exist`, 404)
    );
  }

  res.status(200).json({
    status: "success",
    favorite: deletedFavorite,
  });
});

//@desc Clear all favorites of a user
//@route DELETE /api/v1/favorites/
//@access Private
exports.clearAll = exceptionHandler(async (req, res, next) => {
  const userId = req.user.id;

  const deletedFavorites = await Favorite.deleteMany({ userId });

  if (deletedFavorites.deletedCount === 0) {
    return next(new AppError("No favorites to clear", 404));
  }

  res.status(200).json({
    status: "success",
    message: "All favorites cleared",
  });
});
