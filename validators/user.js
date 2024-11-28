const { body } = require("express-validator");

exports.userValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").notEmpty().isEmail().withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("role")
    .default("user")
    .isIn(["user", "admin", "owner"])
    .withMessage('Role must be either "user" or "admin"'),
];
