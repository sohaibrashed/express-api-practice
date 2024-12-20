const mongoose = require("mongoose");
const validate = require("validator");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for the order."],
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product reference is required."],
          validate: {
            validator: async function (value) {
              const productExists = await mongoose
                .model("Product")
                .exists({ _id: value });
              return productExists;
            },
            message: "Referenced product does not exist.",
          },
        },
        variant: {
          size: {
            type: String,
            required: [true, "Size is required."],
            enum: {
              values: ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"],
              message: "Size {VALUE} is not valid",
            },
          },
          color: {
            type: String,
            required: [true, "Color is required."],
          },
          image: {
            type: String,
            validate: {
              validator: function (value) {
                return !value || validate.isURL(value);
              },
              message: "Invalid image URL format",
            },
          },
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required."],
          min: [1, "Quantity must be at least 1."],
        },
        price: {
          type: Number,
          required: [true, "Price is required."],
          min: [0, "Price must be a positive value."],
        },
        total: {
          type: Number,
          required: [true, "Total is required."],
          min: [0, "Total must be a positive value."],
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required."],
      min: [0, "Total amount must be a positive value."],
    },
    summary: {
      totalItems: {
        type: Number,
        required: true,
        min: [1, "Total items must be at least 1"],
      },
      uniqueItems: {
        type: Number,
        required: true,
        min: [1, "Unique items must be at least 1"],
      },
      averageItemPrice: {
        type: Number,
        required: true,
        min: [0, "Average item price must be positive"],
      },
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ["Credit Card", "Debit Card", "PayPal", "Cash on Delivery"],
        message: "{VALUE} is not a valid payment method.",
      },
      required: [true, "Payment method is required."],
    },
    paymentStatus: {
      type: String,
      enum: {
        values: ["Pending", "Completed", "Failed", "Refunded"],
        message: "{VALUE} is not a valid payment status.",
      },
      default: "Pending",
    },
    orderStatus: {
      type: String,
      enum: {
        values: [
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled",
          "Returned",
        ],
        message: "{VALUE} is not a valid order status.",
      },
      default: "Pending",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: [true, "Full name is required."],
        trim: true,
        minlength: [2, "Full name must be at least 2 characters long"],
        maxlength: [100, "Full name cannot exceed 100 characters"],
      },
      address: {
        type: String,
        required: [true, "Address is required."],
        trim: true,
        minlength: [5, "Address must be at least 5 characters long"],
        maxlength: [200, "Address cannot exceed 200 characters"],
      },
      city: {
        type: String,
        required: [true, "City is required."],
        trim: true,
        minlength: [2, "City must be at least 2 characters long"],
        maxlength: [100, "City cannot exceed 100 characters"],
      },
      country: {
        type: String,
        required: [true, "Country is required."],
        trim: true,
        minlength: [2, "Country must be at least 2 characters long"],
        maxlength: [100, "Country cannot exceed 100 characters"],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required."],
        trim: true,
        validate: {
          validator: function (value) {
            return validate.isPostalCode(value, "any");
          },
          message: "Invalid postal code format.",
        },
      },
      phone: {
        type: String,
        required: [true, "Phone number is required."],
        trim: true,
        validate: {
          validator: function (value) {
            return validate.isMobilePhone(value);
          },
          message: "Invalid phone number format.",
        },
      },
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1, paymentStatus: 1 });

OrderSchema.methods.canBeCancelled = function () {
  return ["Pending", "Processing"].includes(this.orderStatus);
};

OrderSchema.methods.canBeModified = function () {
  return !["Delivered", "Cancelled", "Returned"].includes(this.orderStatus);
};

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
