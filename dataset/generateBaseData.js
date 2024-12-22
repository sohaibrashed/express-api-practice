// generateBaseData.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { generateObjectId } = require("./utils");

const generateCategories = (count = 10) => {
  const categories = [];
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    let name;
    do {
      name = faker.commerce.department().toLowerCase();
    } while (usedNames.has(name));

    usedNames.add(name);
    categories.push({
      _id: generateObjectId(),
      name,
    });
  }
  return categories;
};

const generateSubCategories = (categories, countPerCategory = 5) => {
  const subCategories = [];

  categories.forEach((category) => {
    const usedNames = new Set();

    for (let i = 0; i < countPerCategory; i++) {
      let name;
      do {
        name = faker.commerce.product().toLowerCase();
      } while (usedNames.has(name));

      usedNames.add(name);
      subCategories.push({
        _id: generateObjectId(),
        name,
        category: category._id,
      });
    }
  });

  return subCategories;
};

const generateBrands = (categories, count = 20) => {
  const brands = [];
  const usedNames = new Set();

  for (let i = 0; i < count; i++) {
    let name;
    do {
      name = faker.company.name();
    } while (usedNames.has(name));

    usedNames.add(name);
    brands.push({
      _id: generateObjectId(),
      name,
      logo: faker.image.url(),
      contactInfo: {
        website: faker.internet.url(),
        email: faker.internet.email(),
        socialMedia: {
          instagram: `https://instagram.com/${faker.internet.username()}`,
          facebook: `https://facebook.com/${faker.internet.username()}`,
        },
      },
      categories: faker.helpers.arrayElements(
        categories.map((cat) => cat._id),
        faker.number.int({ min: 1, max: 3 })
      ),
      status: faker.helpers.arrayElement([
        "active",
        "inactive",
        "discontinued",
      ]),
    });
  }

  return brands;
};

const generateBaseData = () => {
  const categories = generateCategories();
  const subCategories = generateSubCategories(categories);
  const brands = generateBrands(categories);

  const data = {
    categories,
    subCategories,
    brands,
  };

  fs.writeFileSync("base_data.json", JSON.stringify(data, null, 2), "utf-8");

  console.log("Generated base data and saved to base_data.json");
  return data;
};

module.exports = { generateBaseData };
