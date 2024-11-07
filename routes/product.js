const express = require("express");
const {
  getAll,
  create,
  getOne,
  deleteOne,
  updateOne,
} = require("../controllers/product");
const { protect, checkAdmin } = require("../middlewares/auth");
const router = express.Router();

router.route("/").get(getAll).post(protect, checkAdmin, create);

router
  .route("/:id")
  .get(getOne)
  .delete(protect, checkAdmin, deleteOne)
  .patch(protect, checkAdmin, updateOne);

module.exports = router;
