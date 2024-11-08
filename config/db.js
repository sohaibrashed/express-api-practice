require("dotenv").config();
const mongoose = require("mongoose");

const DB = process.env.MONGODB_URI.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB connected sucessfully on: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed, error message: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
