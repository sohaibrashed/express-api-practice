const mongoose = require("mongoose");
const validate = require("validator");

const productVariantSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: {
      values: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
      message: "Size {VALUE} is not valid",
    },
    required: true,
  },
  color: {
    type: String,
    trim: true,
    required: true,
  },
  stock: {
    type: Number,
    min: [0, "Stock cannot be negative"],
    default: 0,
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
});

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
      base: {
        type: Number,
        required: [true, "Please provide the base price"],
        min: [0, "Price must be a positive number"],
      },
      sale: {
        type: Number,
        min: [0, "Sale price must be a positive number"],
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR"],
      },
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
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Please provide the brand"],
    },
    variants: [productVariantSchema],
    materials: [
      {
        type: String,
        trim: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    seasonality: {
      type: String,
      enum: ["Spring", "Summer", "Autumn", "Winter", "All-Season"],
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Kids"],
      required: true,
    },
    ratings: {
      average: {
        type: Number,
        min: [0, "Rating must be at least 0"],
        max: [5, "Rating cannot exceed 5"],
        default: 0,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.index({
  category: 1,
  subCategory: 1,
  brand: 1,
});

productSchema.virtual("isOnSale").get(function () {
  return this.price.sale && this.price.sale < this.price.base;
});

productSchema.virtual("discountPercentage").get(function () {
  if (this.price.sale && this.price.sale < this.price.base) {
    return Math.round(
      ((this.price.base - this.price.sale) / this.price.base) * 100
    );
  }
  return 0;
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
