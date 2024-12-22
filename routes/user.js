const express = require("express");

const {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  create,
} = require("../controllers/user");
const {
  signup,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  verifyEmail,
} = require("../controllers/auth");

const { userValidator } = require("../validators/user");

const checkValidation = require("../middlewares/checkValidation");
const { checkAccess, protect, checkSignin } = require("../middlewares/auth");
const checkObjectId = require("../middlewares/checkObjectId");

const router = express.Router();

if (process.env.NODE_ENV === "test") {
  router.route("/signup").post(signup);
  router.route("/signin").post(signin);
} else {
  router.route("/signup").post(checkSignin, signup);
  router.route("/signin").post(checkSignin, signin);
  router.route("/signout").post(signout);

  router.post("/verify-email/:token", verifyEmail);
  router.post("/forgot-password", forgotPassword);
  router.post("/reset-password/:token", resetPassword);

  router
    .route("/")
    .get(protect, checkAccess, getAll)
    .post(protect, checkAccess, create);

  router
    .route("/:id")
    .get(protect, checkAccess, checkObjectId, getOne)
    .delete(protect, checkAccess, checkObjectId, deleteOne)
    .patch(protect, checkAccess, checkObjectId, updateOne);
}

module.exports = router;
