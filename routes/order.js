//routes
const express = require("express");
const {
  getAll,
  create,
  getOne,
  getAllMine,
  updateOne,
  deleteOne,
  updatePaymentStatus,
  updateOrderStatus,
} = require("../controllers/order");

const { orderValidator } = require("../validators/order");

const checkValidation = require("../middlewares/checkValidation");
const { protect, checkAccess } = require("../middlewares/auth");
const checkObjectId = require("../middlewares/checkObjectId");
const router = express.Router();

router
  .route("/")
  .get(protect, checkAccess, getAll)
  .post(protect, checkAccess, create);

router.route("/mine").get(protect, getAllMine);

router
  .route("/:id")
  .get(protect, checkAccess, checkObjectId, getOne)
  .patch(protect, checkAccess, checkObjectId, updateOne)
  .delete(protect, checkAccess, checkObjectId, deleteOne);

router.route("/:id/payment").patch(protect, checkObjectId, updatePaymentStatus);

router
  .route("/:id/order/status")
  .patch(protect, checkAccess, checkObjectId, updateOrderStatus);

module.exports = router;
