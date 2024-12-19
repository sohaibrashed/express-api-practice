require("dotenv").config();
const mongoose = require("mongoose");

let DB = "";

if (
  process.env.NODE_ENV === "development" ||
  process.env.NODE_ENV === "production"
) {
  DB = process.env.MONGODB_URI.replace(
    "<db_password>",
    process.env.DB_PASSWORD
  );
} else if (process.env.NODE_ENV === "test") {
  DB = process.env.MONGODB_URI_TEST;
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(DB);
    console.log(`MongoDB connected successfully on: ${conn.connection.host}`);
  } catch (error) {
    console.error("DB connection failed, error message: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
