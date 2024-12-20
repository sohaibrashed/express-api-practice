const AppError = require("../util/appError");

const validateOrderItems = (req, res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items)) {
    return next(new AppError("Items must be an array", 400));
  }

  for (const item of items) {
    if (!item._id || !item.quantity || !item.size || !item.color) {
      return next(
        new AppError("Each item must have _id, quantity, size, and color", 400)
      );
    }

    if (item.quantity <= 0) {
      return next(new AppError("Quantity must be greater than 0", 400));
    }
  }

  next();
};

module.exports = validateOrderItems;
