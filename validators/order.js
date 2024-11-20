const { body } = require("express-validator");

exports.orderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("At least one item is required."),

  body("items.*.product")
    .notEmpty()
    .withMessage("Product reference is required.")
    .isMongoId()
    .withMessage("Invalid product ID format."),
  body("items.*.quantity")
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1."),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required.")
    .isIn(["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"])
    .withMessage("{VALUE} is not a valid payment method."),

  body("paymentStatus")
    .optional()
    .isIn(["Pending", "Completed", "Failed", "Refunded"])
    .withMessage("{VALUE} is not a valid payment status."),

  body("orderStatus")
    .optional()
    .isIn([
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "Returned",
    ])
    .withMessage("{VALUE} is not a valid order status."),

  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required."),
  body("shippingAddress.fullName")
    .notEmpty()
    .withMessage("Full name is required."),
  body("shippingAddress.address")
    .notEmpty()
    .withMessage("Address is required."),
  body("shippingAddress.city").notEmpty().withMessage("City is required."),
  body("shippingAddress.country")
    .notEmpty()
    .withMessage("Country is required."),
  body("shippingAddress.postalCode")
    .notEmpty()
    .withMessage("Postal code is required.")
    .isPostalCode("any")
    .withMessage("Invalid postal code format."),
  body("shippingAddress.phone")
    .notEmpty()
    .withMessage("Phone number is required.")
    .isMobilePhone()
    .withMessage("Invalid phone number format."),
];
