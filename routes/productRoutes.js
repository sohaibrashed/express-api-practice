const express = require("express");
const {
  getAllProducts,
  createProduct,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");
const { protect, checkAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(getAllProducts).post(protect, checkAdmin, createProduct);

router
  .route("/:id")
  .get(getProduct)
  .delete(protect, checkAdmin, deleteProduct)
  .patch(protect, checkAdmin, updateProduct);

module.exports = router;
