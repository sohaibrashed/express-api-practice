const express = require("express");
const {
  uploadUserProfileImage,
  uploadProductImages,
  deleteUserProfileImage,
  deleteProductImages,
  deleteProductImage,
} = require("../controllers/upload");
const { upload } = require("../middlewares/upload");
const { protect, checkAccess } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/profile/image")
  .post(protect, upload.single("image"), uploadUserProfileImage)
  .delete(protect, deleteUserProfileImage);

router
  .route("/product/image/:id/:variant")
  .post(protect, checkAccess, upload.array("images", 5), uploadProductImages)
  .delete(protect, checkAccess, deleteProductImages);

router
  .route("/product/image/:id/:variant/:imgIndex")
  .delete(protect, checkAccess, deleteProductImage);

module.exports = router;
