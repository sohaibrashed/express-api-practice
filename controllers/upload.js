const exceptionHandler = require("../middlewares/exceptionHandler");
const {
  uploadProfileImage,
  uploadProductImages,
  deleteProductImages,
  deleteProfileImage,
  deleteProductImage,
} = require("../util/cloudinary");
const Product = require("../models/product");
const User = require("../models/user");
const AppError = require("../util/appError");

exports.uploadUserProfileImage = exceptionHandler(async (req, res, next) => {
  const { id } = req.user;
  const imagePath = req.file.path;
  const profileImageUrl = await uploadProfileImage(id, imagePath);

  if (!profileImageUrl) {
    return next(new AppError("Error uploading profile image", 500));
  }

  const user = await User.findById(id);

  user.image = profileImageUrl;

  const updatedUser = await user.save();

  if (!updatedUser) {
    return next(new AppError("Unable to save the user profile image", 500));
  }

  res.status(200).json({
    status: "success",
    imageUrl: profileImageUrl,
    user: updatedUser,
  });
});

exports.uploadProductImages = exceptionHandler(async (req, res, next) => {
  const { id, variant } = req.params;
  const imagePaths = req.files.map((file) => file.path);

  const product = await Product.findById(id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.variants[variant]) {
    return next(new AppError("Variant not found", 404));
  }

  const imageUrls = await uploadProductImages(
    id,
    imagePaths,
    product.variants[variant]
  );

  if (!imageUrls) {
    return next(new AppError("Error uploading product images", 500));
  }
  product.variants[variant].images.push(...imageUrls);

  const updatedProduct = await product.save();

  if (!updatedProduct) {
    return next(new AppError("Unable to save the product images", 500));
  }

  res.status(200).json({
    status: "success",
    images: imageUrls,
    product: updatedProduct,
  });
});

exports.deleteUserProfileImage = exceptionHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);
  if (!user.image) {
    return next(new AppError("No profile image exists", 404));
  }

  const deleteResult = await deleteProfileImage(id);
  if (!deleteResult) {
    return next(new AppError("Error deleting profile image", 500));
  }

  user.image = undefined;
  const updatedUser = await user.save();

  if (!updatedUser) {
    return next(
      new AppError("Unable to update user after image deletion", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Profile image deleted successfully",
    user: updatedUser,
  });
});

exports.deleteProductImages = exceptionHandler(async (req, res, next) => {
  const { id, variant } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.variants[variant]) {
    return next(new AppError("Variant not found", 404));
  }

  if (!product.variants[variant].images.length) {
    return next(new AppError("No images exist for this variant", 404));
  }

  const deleteResult = await deleteProductImages(id);
  if (!deleteResult) {
    return next(new AppError("Error deleting product images", 500));
  }

  product.variants[variant].images = [];
  const updatedProduct = await product.save();

  if (!updatedProduct) {
    return next(
      new AppError("Unable to update product after image deletion", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Product images deleted successfully",
    product: updatedProduct,
  });
});

exports.deleteProductImage = exceptionHandler(async (req, res, next) => {
  const { id, variant, imgIndex } = req.params;

  const product = await Product.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  if (!product.variants[variant]) {
    return next(new AppError("Variant not found", 404));
  }

  if (!product.variants[variant].images[imgIndex - 1]) {
    return next(new AppError("No images exist for this variant", 404));
  }

  const deleteResult = await deleteProductImage(
    id,
    imgIndex,
    product.variants[variant]
  );

  if (!deleteResult) {
    return next(new AppError("Error deleting product image", 500));
  }

  product.variants[variant].images = product.variants[variant].images.filter(
    (_, index) => index !== imgIndex - 1
  );

  const updatedProduct = await product.save();

  if (!updatedProduct) {
    return next(
      new AppError("Unable to update product after image deletion", 500)
    );
  }

  res.status(200).json({
    status: "success",
    message: "Product image deleted successfully",
    product: updatedProduct,
  });
});
