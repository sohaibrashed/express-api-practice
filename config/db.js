require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.DB_CONNECTION.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB connection sucessfull");
  } catch (error) {
    console.error("DB connection failed, error message: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
