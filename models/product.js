const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide the title"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Please provide the description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide the price"],
      min: [0, "Price must be a positive number"],
    },
    rating: {
      type: Number,
      min: [0, "Rating must be at least 0"],
      max: [5, "Rating cannot exceed 5"],
      default: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide the category"],
    },
    stock: {
      type: Number,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    brand: {
      type: String,
      trim: true,
      required: [true, "Please provide the brand"],
    },
    image: {
      type: String,
      trim: true,
    },
    reviews: [
      {
        author: {
          type: String,
          trim: true,
          required: [true, "Review must have an author"],
        },
        comment: {
          type: String,
          trim: true,
        },
        rating: {
          type: Number,
          min: [0, "Rating must be at least 0"],
          max: [5, "Rating cannot exceed 5"],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
