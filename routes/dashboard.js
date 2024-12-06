const express = require("express");
const { protect, checkAccess } = require("../middlewares/auth");
const { getDashboardData } = require("../controllers/dashboard");
const router = express.Router();

router.route("/").get(protect, checkAccess, getDashboardData);

module.exports = router;
