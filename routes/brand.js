const express = require("express");
const router = express.Router();

const { protect, checkAccess } = require("../middlewares/auth");
const {
  getAll,
  getById,
  create,
  updateOne,
  deleteOne,
} = require("../controllers/brand");

router
  .route("/:id")
  .get(protect, checkAccess, getById)
  .patch(protect, checkAccess, updateOne)
  .delete(protect, checkAccess, deleteOne);

router
  .route("/")
  .get(protect, checkAccess, getAll)
  .post(protect, checkAccess, create);

module.exports = router;
