const mongoose = require("mongoose");
const validate = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      required: [true, "Please provide your email"],
      validate: [validate.isEmail, "Plese provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please provide password (min 8 length)"],
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
