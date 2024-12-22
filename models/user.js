const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide your name"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Please provide your email"],
      validate: [validate.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password (min 6 length)"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      lowercase: true,
      trim: true,
      enum: ["user", "admin", "owner"],
      default: "user",
    },
    image: {
      type: String,
      validate: {
        validator: function (value) {
          return validate.isURL(value);
        },
        message: "Image URL {VALUE} is not valid",
      },
    },
    verificationToken: String,
    resetToken: String,
    resetTokenExpiration: Date,
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      // validate: {
      //   validator: function (value) {
      //     return validate.isMobilePhone(value);
      //   },
      //   message: "Invalid phone number format.",
      // },
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: {
          type: String,
          required: true,
          validate: {
            validator: function (value) {
              return validate.isPostalCode(value, "any");
            },
            message: "Invalid postal code format.",
          },
        },
      },
    ],
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

userSchema.index({ resetTokenExpiration: 1 }, { expireAfterSeconds: 300 });

const User = mongoose.model("User", userSchema);

module.exports = User;
