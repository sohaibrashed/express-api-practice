const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for the review."],
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required for the review."],
    },
    rating: {
      type: Number,
      min: [1, "Rating must be at least 1."],
      max: [5, "Rating cannot exceed 5."],
      required: [true, "Rating is required."],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [500, "Review comment cannot exceed 500 characters."],
    },
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.pre("save", function (next) {
  if (this.isNew && !this.comment) {
    this.comment = "";
  }
  next();
});

async function updateProductRatings(productId) {
  const result = await this.constructor.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await mongoose.model("Product").findByIdAndUpdate(productId, {
    "ratings.average": result[0]?.averageRating || 0,
    "ratings.count": result[0]?.reviewCount || 0,
  });
}

reviewSchema.post("save", async function () {
  await updateProductRatings.call(this, this.product);
});

reviewSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await updateProductRatings.call(this, this.product);
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
