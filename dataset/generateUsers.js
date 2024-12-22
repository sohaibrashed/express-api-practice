// generateUsers.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const {
  createEmailFromName,
  generatePhone,
  generateAddress,
  generateObjectId,
} = require("./utils");

const generateUsers = (count = 500) => {
  const users = [];
  const usedEmails = new Set();

  for (let i = 0; i < count; i++) {
    const name = faker.person.fullName();
    let email = createEmailFromName(name);

    // Ensure unique email
    while (usedEmails.has(email)) {
      email = faker.internet.email();
    }
    usedEmails.add(email);

    const user = {
      _id: generateObjectId(),
      name,
      email,
      password: "$2b$10$YourHashedPasswordHere", // Pre-hashed password for '123456'
      role: faker.helpers.arrayElement(["user", "admin", "owner"]),
      image: faker.image.avatar(),
      phone: generatePhone(),
      emailVerified: faker.datatype.boolean(),
      phoneVerified: faker.datatype.boolean(),
      addresses: Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => generateAddress()
      ),
      lastLoginAt: faker.date.recent(),
      isActive: faker.datatype.boolean(),
    };

    users.push(user);
  }

  fs.writeFileSync("users_data.json", JSON.stringify(users, null, 2), "utf-8");

  console.log(`Generated ${users.length} users and saved to users_data.json`);
  return users;
};

module.exports = { generateUsers };
