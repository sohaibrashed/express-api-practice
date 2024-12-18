const mongoose = require("mongoose");
const validate = require("validator");

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the brand name"],
      trim: true,
      unique: true,
      maxlength: [100, "Brand name cannot exceed 100 characters"],
    },
    logo: {
      type: String,
      validate: {
        validator: function (value) {
          return validate.isURL(value);
        },
        message: "Logo URL {VALUE} is not valid",
      },
    },
    contactInfo: {
      website: {
        type: String,
        validate: {
          validator: function (value) {
            return validate.isURL(value);
          },
          message: "Website URL {VALUE} is not valid",
        },
      },
      email: {
        type: String,
        lowercase: true,
        validate: {
          validator: function (value) {
            return validate.isEmail(value);
          },
          message: "Email {VALUE} is not valid",
        },
      },
      socialMedia: {
        instagram: {
          type: String,
          validate: {
            validator: function (value) {
              return !value || validate.isURL(value);
            },
            message: "Instagram URL {VALUE} is not valid",
          },
        },
        facebook: {
          type: String,
          validate: {
            validator: function (value) {
              return !value || validate.isURL(value);
            },
            message: "Facebook URL {VALUE} is not valid",
          },
        },
      },
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive", "discontinued"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
