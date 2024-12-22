const mongoose = require("mongoose");
const connectDb = require("./config/db");

// Import models
const User = require("./models/user");
const Product = require("./models/product");
const Category = require("./models/category");
const SubCategory = require("./models/subCategory");
const Brand = require("./models/brand");
const Order = require("./models/order");
const Review = require("./models/review");
const Favorite = require("./models/favorite");

// Import data
const baseData = require("./dataset/base_data.json");
const userData = require("./dataset/users_data.json");
const productData = require("./dataset/products_data.json");
const orderData = require("./dataset/orders_data.json");
const reviewData = require("./dataset/reviews_data.json");
const favoriteData = require("./dataset/favorites_data.json");

async function clearDatabase() {
  console.log("Clearing existing data...");
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    SubCategory.deleteMany({}),
    Brand.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    Favorite.deleteMany({}),
  ]);
  console.log("Database cleared!");
}

async function seedBaseData() {
  console.log("Seeding categories, subcategories, and brands...");
  try {
    await Category.insertMany(baseData.categories);
    await SubCategory.insertMany(baseData.subCategories);
    await Brand.insertMany(baseData.brands);
    console.log(`Seeded:
      - ${baseData.categories.length} categories
      - ${baseData.subCategories.length} subcategories
      - ${baseData.brands.length} brands`);
  } catch (error) {
    console.error("Base data seeding failed:", error);
    throw error;
  }
}

async function seedUsers() {
  console.log("Seeding users...");
  try {
    await User.insertMany(userData);
    console.log(`Seeded ${userData.length} users`);
  } catch (error) {
    console.error("User seeding failed:", error);
    throw error;
  }
}

async function seedProducts() {
  console.log("Seeding products...");
  try {
    await Product.insertMany(productData);
    console.log(`Seeded ${productData.length} products`);
  } catch (error) {
    console.error("Product seeding failed:", error);
    throw error;
  }
}

async function seedOrders() {
  console.log("Seeding orders...");
  try {
    await Order.insertMany(orderData);
    console.log(`Seeded ${orderData.length} orders`);
  } catch (error) {
    console.error("Order seeding failed:", error);
    throw error;
  }
}

async function seedReviews() {
  console.log("Seeding reviews...");
  try {
    await Review.insertMany(reviewData);
    console.log(`Seeded ${reviewData.length} reviews`);
  } catch (error) {
    console.error("Review seeding failed:", error);
    throw error;
  }
}

async function seedFavorites() {
  console.log("Seeding favorites...");
  try {
    await Favorite.insertMany(favoriteData);
    console.log(`Seeded ${favoriteData.length} favorites`);
  } catch (error) {
    console.error("Favorites seeding failed:", error);
    throw error;
  }
}

async function updateProductRatings() {
  console.log("Updating product ratings...");
  const products = await Product.find({});

  for (const product of products) {
    const reviews = await Review.find({ product: product._id });
    if (reviews.length > 0) {
      const averageRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      product.ratings = {
        average: parseFloat(averageRating.toFixed(1)),
        count: reviews.length,
      };
      await product.save();
    }
  }
  console.log("Product ratings updated!");
}

async function runSeeders() {
  try {
    console.log("Starting database seeding...");
    await connectDb();

    // Clear existing data
    await clearDatabase();

    // Seed all data in proper order
    await seedBaseData();
    await seedUsers();
    await seedProducts();
    await seedOrders();
    await seedReviews();
    await seedFavorites();

    // Update product ratings based on reviews
    await updateProductRatings();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

// Add command line arguments to control seeding
const args = process.argv.slice(2);
if (args.includes("--clear-only")) {
  connectDb()
    .then(() => clearDatabase())
    .then(() => mongoose.disconnect())
    .then(() => console.log("Database cleared successfully!"))
    .catch(console.error);
} else {
  runSeeders();
}

module.exports = {
  clearDatabase,
  seedBaseData,
  seedUsers,
  seedProducts,
  seedOrders,
  seedReviews,
  seedFavorites,
  updateProductRatings,
  runSeeders,
};
