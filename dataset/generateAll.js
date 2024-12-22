// generateAll.js
const { generateBaseData } = require("./generateBaseData");
const { generateUsers } = require("./generateUsers");
const { generateProducts } = require("./generateProducts");
const { generateOrders } = require("./generateOrders");
const {
  generateReviews,
  generateFavorites,
} = require("./generateReviewsAndFavorites");

async function generateAllData() {
  console.log("Starting data generation...");

  // Generate base data first (categories, subcategories, brands)
  console.log("Generating base data...");
  const baseData = generateBaseData();

  // Generate users
  console.log("Generating users...");
  const users = generateUsers(500);

  // Generate products
  console.log("Generating products...");
  const products = generateProducts(baseData, 1000);

  // Generate orders
  console.log("Generating orders...");
  const orders = generateOrders(users, products, 2000);

  // Generate reviews
  console.log("Generating reviews...");
  const reviews = generateReviews(users, products, orders, 5000);

  // Generate favorites
  console.log("Generating favorites...");
  const favorites = generateFavorites(users, products, 3000);

  console.log("Data generation completed!");
  console.log("Generated:");
  console.log(`- ${baseData.categories.length} categories`);
  console.log(`- ${baseData.subCategories.length} subcategories`);
  console.log(`- ${baseData.brands.length} brands`);
  console.log(`- ${users.length} users`);
  console.log(`- ${products.length} products`);
  console.log(`- ${orders.length} orders`);
  console.log(`- ${reviews.length} reviews`);
  console.log(`- ${favorites.length} favorites`);
}

generateAllData().catch(console.error);
