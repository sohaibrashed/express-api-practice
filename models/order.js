const mongoose = require("mongoose");
const validate = require("validator");

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required for the order."],
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
      validate: {
        validator: function (value) {
          let total = this.items.reduce((sum, item) => sum + item.total, 0);
          return value === parseFloat(total.toFixed(2));
        },
        message: "Total amount does not match the sum of item totals.",
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
      fullName: { type: String, required: [true, "Full name is required."] },
      address: {
        type: String,
        required: [true, "Address is required."],
      },
      city: {
        type: String,
        required: [true, "City is required."],
      },
      country: {
        type: String,
        required: [true, "Country is required."],
      },
      postalCode: {
        type: String,
        required: [true, "Postal code is required."],
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
        validate: {
          validator: function (value) {
            return validate.isMobilePhone(value);
          },
          message: "Invalid phone number format.",
        },
      },
    },
  },
  { timestamps: true }
);

OrderSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
