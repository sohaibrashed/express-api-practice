const connectDb = require("./config/db");
const Product = require("./models/product");
const productItems = require("./dataset/ecommerce_clothes_data.json");

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

// seedProducts();
// seedUsers();
