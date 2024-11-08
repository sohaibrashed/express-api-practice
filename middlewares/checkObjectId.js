const mongoose = require("mongoose");

function checkObjectId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(404);
    throw new Error(`Invlaid ObjectId of: ${req.params.id}`);
  }
  next();
}

module.exports = checkObjectId;
