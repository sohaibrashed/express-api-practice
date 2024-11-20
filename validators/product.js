const { body } = require("express-validator");

const categories = {
  Clothing: ["Shirts", "Pants", "Jackets", "Sweaters"],
  Footwear: ["Shoes", "Boots", "Sandals", "Sneakers"],
  Accessories: ["Hats", "Belts", "Gloves", "Scarves"],
  Bags: ["Handbags", "Backpacks", "Wallets", "Duffel Bags"],
};

const validSizes = ["XS", "S", "M", "L", "XL"];

exports.productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Please provide the product name")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Please provide the product description"),

  body("price")
    .notEmpty()
    .withMessage("Please provide the product price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .notEmpty()
    .withMessage("Please select a category")
    .isIn(Object.keys(categories))
    .withMessage("{VALUE} is not a valid category"),

  body("subCategory")
    .notEmpty()
    .withMessage("Please select a sub-category")
    .custom((value, { req }) => {
      const validSubcategories = categories[req.body.category];
      if (!validSubcategories || !validSubcategories.includes(value)) {
        throw new Error(
          `Sub-category ${value} is not valid for the selected category`
        );
      }
      return true;
    }),

  body("size")
    .optional()
    .isIn(validSizes)
    .withMessage("Size {VALUE} is not valid"),

  body("color")
    .optional()
    .trim()
    .isString()
    .withMessage("Color must be a string"),

  body("material")
    .optional()
    .trim()
    .isString()
    .withMessage("Material must be a string"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock cannot be negative"),

  body("ratings")
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rating must be between 0 and 5"),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings")
    .custom((tags) => {
      if (tags.some((tag) => typeof tag !== "string")) {
        throw new Error("Tags must only contain strings");
      }
      return true;
    }),

  body("brand").trim().notEmpty().withMessage("Please provide the brand name"),

  body("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of URLs")
    .custom((images) => {
      const validator = require("validator");
      if (images.some((image) => !validator.isURL(image))) {
        throw new Error("Each image must be a valid URL");
      }
      return true;
    }),
];
