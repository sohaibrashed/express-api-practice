const cloudinary = require("../config/cloudinary");
const AppError = require("./appError");

const uploadProfileImage = async (userId, imagePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: "clothify/profiles",
      public_id: userId,
      overwrite: true,
      quality: "auto:low",
      fetch_format: "auto",
      format: "webp",
    });
    return uploadResult.secure_url;
  } catch (error) {
    throw new AppError("Error uploading profile image: " + error.message);
  }
};

const uploadProductImages = async (productId, imagePaths, variant) => {
  const uploadedImages = [];

  for (const [index, imagePath] of imagePaths.entries()) {
    try {
      const uploadResult = await cloudinary.uploader.upload(imagePath, {
        folder: `clothify/products/${productId}`,
        public_id: `image_${index + 1}_${variant.color}`,
        quality: "auto",
        fetch_format: "auto",
        format: "webp",
      });
      uploadedImages.push(uploadResult.secure_url);
    } catch (error) {
      console.error(`Error uploading product image ${index + 1}:`, error);
    }
  }

  return uploadedImages;
};

const deleteProfileImage = async (userId) => {
  try {
    await cloudinary.uploader.destroy(`clothify/profiles/${userId}`);
    return "Profile image deleted successfully.";
  } catch (error) {
    throw new AppError("Error deleting profile image: " + error.message);
  }
};

const deleteProductImages = async (productId) => {
  try {
    await cloudinary.api.delete_resources_by_prefix(
      `clothify/products/${productId}`
    );
    return "Product images deleted successfully.";
  } catch (error) {
    throw new AppError("Error deleting product images: " + error.message);
  }
};

const deleteProductImage = async (productId, imgIndex, variant) => {
  try {
    await cloudinary.api.delete_resources_by_prefix(
      `clothify/products/${productId}/image_${imgIndex}_${variant.color}`
    );
    return "Product image deleted successfully.";
  } catch (error) {
    throw new AppError("Error deleting product image: " + error.message);
  }
};

module.exports = {
  uploadProfileImage,
  uploadProductImages,
  deleteProfileImage,
  deleteProductImages,
  deleteProductImage,
};
