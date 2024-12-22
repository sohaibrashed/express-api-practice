// utils.js
const { faker } = require("@faker-js/faker");
const validate = require("validator");
const mongoose = require("mongoose");

const generateObjectId = () => new mongoose.Types.ObjectId();

const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
const COLORS = [
  "Black",
  "White",
  "Navy",
  "Red",
  "Green",
  "Blue",
  "Grey",
  "Brown",
  "Purple",
  "Pink",
];
const MATERIALS = [
  "Cotton",
  "Polyester",
  "Wool",
  "Silk",
  "Linen",
  "Leather",
  "Denim",
  "Cashmere",
];
const SEASONS = ["Spring", "Summer", "Autumn", "Winter", "All-Season"];
const GENDERS = ["Men", "Women", "Kids"];
const PAYMENT_METHODS = [
  "Credit Card",
  "Debit Card",
  "PayPal",
  "Cash on Delivery",
];
const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
];
const PAYMENT_STATUSES = ["Pending", "Completed", "Failed", "Refunded"];

const createEmailFromName = (name) => {
  return (
    name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .trim()
      .split(/\s+/)
      .join(".")
      .toLowerCase() + "@gmail.com"
  );
};

const generatePhone = () => {
  return faker.phone.number("+1##########");
};

const generatePostalCode = () => {
  return faker.location.zipCode();
};

const generateAddress = () => ({
  fullName: faker.person.fullName(),
  address: faker.location.streetAddress(),
  city: faker.location.city(),
  country: faker.location.country(),
  postalCode: generatePostalCode(),
});

module.exports = {
  generateObjectId,
  SIZES,
  COLORS,
  MATERIALS,
  SEASONS,
  GENDERS,
  PAYMENT_METHODS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  createEmailFromName,
  generatePhone,
  generatePostalCode,
  generateAddress,
};
