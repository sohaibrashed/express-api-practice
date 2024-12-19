const { faker } = require("@faker-js/faker");
const fs = require("fs");
const validate = require("validator");

const nUsers = 500;
const users = [];

const createEmailFromName = (name) =>
  name
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .split(/\s+/)
    .join(".")
    .toLowerCase() + "@gmail.com";

for (let i = 0; i < nUsers; i++) {
  const name = faker.person.fullName();
  const user = {
    name,
    email: createEmailFromName(name),
    password: "123456",
  };

  if (validate.isEmail(user.email)) {
    users.push(user);
  } else {
    console.error("invalid email: ", user.email);
    break;
  }
}

fs.writeFileSync(
  "ecommerce_users_data.json",
  JSON.stringify(users, null, 2),
  "utf-8"
);

console.log(`Generated ${nUsers} users and save to ecommerce_users_data.json`);
