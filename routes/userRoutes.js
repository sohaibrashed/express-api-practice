const express = require("express");
const {
  getAllUsers,
  signup,
  getUser,
  deleteUser,
  updateUser,
  signin,
  signout,
} = require("../controllers/userController");
const { checkAdmin, protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(protect, checkAdmin, getAllUsers).post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);

router
  .route("/:id")
  .get(protect, checkAdmin, getUser)
  .delete(protect, checkAdmin, deleteUser)
  .patch(updateUser);

module.exports = router;
