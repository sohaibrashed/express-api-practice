const mongoose = require("mongoose");
const AppError = require("../util/appError");

function checkObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    next(new AppError(`Invalid ObjectId of: ${req.params.id}`, 404));
  }
  next();
}

module.exports = checkObjectId;
