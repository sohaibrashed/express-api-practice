const AppError = require("../util/appError");

const validateShippingAddress = (req, res, next) => {
  const { shippingAddress } = req.body;
  const requiredFields = [
    "fullName",
    "address",
    "city",
    "country",
    "postalCode",
    "phone",
  ];

  for (const field of requiredFields) {
    if (!shippingAddress || !shippingAddress[field]) {
      return next(new AppError(`Shipping address ${field} is required`, 400));
    }
  }

  next();
};

module.exports = validateShippingAddress;
