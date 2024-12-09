const connectDb = require("./config/db");
const mongoose = require("mongoose");

const Product = require("./models/product");
const productItems = require("./dataset/ecommerce_clothes_data.json");

const Category = require("./models/category");
const SubCategory = require("./models/subCategory");
const predefinedCategories = require("./util/predefinedCategories");

const User = require("./models/user");
const userData = require("./dataset/ecommerce_users_data.json");

const productsLength = productItems.length - 18000;
const usersLength = userData.length;

async function seedProducts() {
  try {
    await connectDb();
    let counter = 0;
    for (let i = 0; i < productsLength; i++) {
      await Product.create(productItems[i]);
      counter++;
    }
    console.log(`Created ${counter} Products successfully`);
  } catch (error) {
    console.error("Products Seeder failed");
    console.error(error);
  }
}

async function seedUsers() {
  try {
    await connectDb();
    let counter = 0;
    for (let i = 0; i < usersLength; i++) {
      await User.create(userData[i]);
      counter++;
    }
    console.log(`Created ${counter} Users successfully`);
  } catch (error) {
    console.error("User Seeder failed");
    console.error(error);
  }
}

async function seedCategories() {
  try {
    await connectDb();

    const existingCategories = await Category.find({});
    if (existingCategories.length > 0) {
      console.log("Categories already exist. Skipping seeding.");
      return;
    }

    const categoriesToSeed = Object.keys(predefinedCategories).map((name) => ({
      name,
    }));

    const seededCategories = await Category.insertMany(categoriesToSeed);
    console.log("Seeded Categories:", seededCategories);
  } catch (error) {
    console.error("Category seeding failed:", error.message);
  }
}

async function seedSubCategories() {
  try {
    await connectDb();

    const existingSubCategories = await SubCategory.find({});
    if (existingSubCategories.length > 0) {
      console.log("Subcategories already exist. Skipping seeding.");
      return;
    }

    const categories = await Category.find({});
    if (!categories || categories.length === 0) {
      console.error("No categories found. Please seed categories first.");
      return;
    }

    const subCategoriesToSeed = [];
    for (const [categoryName, subCategoryNames] of Object.entries(
      predefinedCategories
    )) {
      const category = categories.find((cat) => cat.name === categoryName);
      if (!category) {
        console.error(`Category '${categoryName}' not found.`);
        continue;
      }

      subCategoryNames.forEach((subCategoryName) => {
        subCategoriesToSeed.push({
          name: subCategoryName,
          category: category._id,
        });
      });
    }

    const seededSubCategories = await SubCategory.insertMany(
      subCategoriesToSeed
    );
    console.log("Seeded SubCategories:", seededSubCategories);
  } catch (error) {
    console.error("SubCategory seeding failed:", error.message);
  }
}

async function runSeeders() {
  console.log("Seeders are stopped. Kindly check Seeder.js file");
  // await seedProducts();
  // await seedUsers();
  // await seedCategories();
  // await seedSubCategories();
  // await mongoose.disconnect();
}

runSeeders();
