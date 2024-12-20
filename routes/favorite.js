const express = require("express");
const {
  create,
  clearAll,
  deleteOne,
  getAll,
  getOne,
} = require("../controllers/favorite");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .post(protect, create)
  .get(protect, getAll)
  .delete(protect, clearAll);

router.route("/:id").delete(protect, deleteOne).get(protect, getOne);

module.exports = router;
