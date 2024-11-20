const { validationResult } = require("express-validator");

const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Error");
    error.statusCode = 400;
    error.details = errors.array();
    throw error;
  }
  next();
};

module.exports = checkValidation;
