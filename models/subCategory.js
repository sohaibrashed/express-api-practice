const mongoose = require("mongoose");
const predefinedCategories = require("../util/predefinedCategories");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the sub-category name"],
    trim: true,
    validate: {
      validator: function (value) {
        const categoryName = this.categoryName;
        const validSubcategories = predefinedCategories[categoryName];
        return validSubcategories?.includes(value);
      },
      message: "{VALUE} is not a valid sub-category for the selected category",
    },
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please associate the sub-category with a category"],
  },
});

subCategorySchema.pre("validate", async function (next) {
  const Category = mongoose.model("Category");
  const category = await Category.findById(this.category);

  if (category) {
    this.categoryName = category.name;
    next();
  } else {
    next(new Error("Invalid category ID"));
  }
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
