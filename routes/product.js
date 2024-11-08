const express = require("express");
const {
  getAll,
  create,
  getOne,
  deleteOne,
  updateOne,
} = require("../controllers/product");
const { protect, checkAdmin } = require("../middlewares/auth");
const checkObjectId = require("../middlewares/checkObjectId");

const router = express.Router();

router.route("/").get(getAll).post(protect, checkAdmin, create);

router
  .route("/:id")
  .get(checkObjectId, getOne)
  .delete(protect, checkAdmin, checkObjectId, deleteOne)
  .patch(protect, checkAdmin, checkObjectId, updateOne);

module.exports = router;
