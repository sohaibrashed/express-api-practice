const express = require("express");
const {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  create,
} = require("../controllers/user");
const { signup, signin, signout } = require("../controllers/auth");
const { checkAdmin, protect, checkSignin } = require("../middlewares/auth");
const router = express.Router();

router
  .route("/")
  .get(protect, checkAdmin, getAll)
  .post(protect, checkAdmin, create);

router.route("/signup").post(checkSignin, signup);
router.route("/signin").post(checkSignin, signin);
router.route("/signout").get(signout);

router
  .route("/:id")
  .get(protect, checkAdmin, getOne)
  .delete(protect, checkAdmin, deleteOne)
  .patch(updateOne);

module.exports = router;
