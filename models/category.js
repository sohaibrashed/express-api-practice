const mongoose = require("mongoose");
const predefinedCategories = require("../util/predefinedCategories");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the category name"],
    unique: true,
    trim: true,
    enum: {
      values: Object.keys(predefinedCategories),
      message: "{VALUE} is not a valid category",
    },
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
