const express = require("express");
const {
  getCategories,
  createCategory,
  getSubCategories,
  createSubCategory,
} = require("../controllers/category");
const { protect, checkAccess } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/subcategory")
  .get(getSubCategories)
  .post(protect, checkAccess, createSubCategory);

router.route("/").get(getCategories).post(protect, checkAccess, createCategory);

module.exports = router;
