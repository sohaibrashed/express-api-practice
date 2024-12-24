const Review = require("../models/review");
const Product = require("../models/product");
const User = require("../models/user");
const paginate = require("../util/paginate");
const exceptionHandler = require("../middlewares/exceptionHandler");
const AppError = require("../util/appError");
const validateObjectId = require("../util/validateObjectId");

//@desc Get all reviews with filtering options
//@route GET /api/v1/reviews/
//@access Public
exports.getAll = exceptionHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = process.env.LIMIT || 10,
    product,
    user,
    minRating,
    maxRating,
    verifiedOnly,
    sort,
  } = req.query;

  const filter = {};

  if (product) filter.product = product;
  if (user) filter.user = user;

  if (minRating || maxRating) {
    filter.rating = {};
    if (minRating) filter.rating.$gte = parseInt(minRating);
    if (maxRating) filter.rating.$lte = parseInt(maxRating);
  }

  if (verifiedOnly === "true") {
    filter.isVerifiedPurchase = true;
  }

  const sortOptions = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "rating-high-low": { rating: -1 },
    "rating-low-high": { rating: 1 },
    helpful: { helpfulCount: -1 },
  };

  const sortOrder = sortOptions[sort] || { createdAt: -1 };

  const { data: reviews, pagination } = await paginate(
    Review,
    filter,
    sortOrder,
    [
      { path: "user", select: "name image" },
      { path: "product", select: "name" },
    ],
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    pagination,
    data: reviews.length > 0 ? reviews : [],
  });
});

//@desc Get a single review
//@route GET /api/v1/reviews/:id
//@access Public
exports.getOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findById(id)
    .populate("user", "name avatar")
    .populate("product", "name images");

  if (!review) {
    return next(new AppError(`Review with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    review,
  });
});

//@desc Create a review
//@route POST /api/v1/reviews/
//@access Private
exports.create = exceptionHandler(async (req, res, next) => {
  const { product, rating, comment } = req.body;
  const user = req.user._id;

  const existingReview = await Review.findOne({ user, product });
  if (existingReview) {
    return next(new AppError("You have already reviewed this product", 400));
  }

  const productExists = await Product.findById(product);
  if (!productExists) {
    return next(new AppError("Product not found", 404));
  }

  // TODO: Check if user has purchased the product and set isVerifiedPurchase accordingly
  // This would typically involve checking order history

  const review = await Review.create({
    user,
    product,
    rating,
    comment,
    isVerifiedPurchase: false,
  });

  res.status(201).json({
    status: "success",
    review,
  });
});

//@desc Update a review
//@route PATCH /api/v1/reviews/:id
//@access Private
exports.updateOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user._id;

  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError(`Review with ID: ${id} not found`, 404));
  }

  if (review.user.toString() !== userId.toString()) {
    return next(new AppError("You can only update your own reviews", 403));
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;
  await review.save();

  res.status(200).json({
    status: "success",
    review,
  });
});

//@desc Delete a review
//@route DELETE /api/v1/reviews/:id
//@access Private
exports.deleteOne = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const review = await Review.findById(id);

  if (!review) {
    return next(new AppError(`Review with ID: ${id} not found`, 404));
  }

  if (
    review.user.toString() !== userId.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new AppError("You can only delete your own reviews", 403));
  }

  await review.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Review successfully deleted",
  });
});

//@desc Mark a review as helpful
//@route PATCH /api/v1/reviews/:id/helpful
//@access Private
exports.markHelpful = exceptionHandler(async (req, res, next) => {
  const { id } = req.params;

  const review = await Review.findByIdAndUpdate(
    id,
    { $inc: { helpfulCount: 1 } },
    { new: true }
  );

  if (!review) {
    return next(new AppError(`Review with ID: ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    review,
  });
});
