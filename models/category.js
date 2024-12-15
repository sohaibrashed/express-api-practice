const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the category name"],
    unique: [true, "Category must be unique"],
    trim: true,
    lowercase: true,
  },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
