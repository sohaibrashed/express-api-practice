const express = require("express");
const {
  getAll,
  create,
  getOne,
  deleteOne,
  updateOne,
  getTrending,
} = require("../controllers/product");

const { productValidator } = require("../validators/product");

const checkValidation = require("../middlewares/checkValidation");
const { protect, checkAccess } = require("../middlewares/auth");
const checkObjectId = require("../middlewares/checkObjectId");

const router = express.Router();

if (process.env.NODE_ENV === "test") {
  router.route("/").get(getAll).post(create);
} else {
  router.route("/trending").get(getTrending);

  router.route("/").get(getAll).post(protect, checkAccess, create);

  router
    .route("/:id")
    .get(checkObjectId, getOne)
    .delete(protect, checkAccess, checkObjectId, deleteOne)
    .patch(protect, checkAccess, checkObjectId, updateOne);
}

module.exports = router;
