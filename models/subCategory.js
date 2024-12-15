const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide the sub-category name"],
    trim: true,
    lowercase: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Please associate the sub-category with a category"],
  },
});

subCategorySchema.pre("save", async function (next) {
  const Category = mongoose.model("Category");
  const SubCategory = mongoose.model("SubCategory");

  const category = await Category.findById(this.category);
  if (!category) {
    return next(new Error("Invalid category ID"));
  }

  const duplicate = await SubCategory.findOne({
    name: this.name,
    category: this.category,
  });

  if (duplicate) {
    return next(
      new Error(
        "A sub-category with the same name already exists in this category"
      )
    );
  }

  this.categoryName = category.name;
  next();
});

const SubCategory = mongoose.model("SubCategory", subCategorySchema);

module.exports = SubCategory;
