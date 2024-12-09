const mongoose = require("mongoose");
const validate = require("validator");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide the product name"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide the product description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the product price"],
      min: [0, "Price must be a positive number"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category"],
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: [true, "Please select a sub-category"],
    },
    size: {
      type: String,
      enum: {
        values: ["XS", "S", "M", "L", "XL"],
        message: "Size {VALUE} is not valid",
      },
    },
    color: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    ratings: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    dateAdded: {
      type: Date,
      default: Date.now,
    },
    brand: {
      type: String,
      trim: true,
      required: [true, "Please provide the brand name"],
    },
    images: [
      {
        type: String,
        trim: true,
        validate: {
          validator: function (value) {
            return validate.isURL(value);
          },
          message: "Image URL {VALUE} is not valid",
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
