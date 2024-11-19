const { faker } = require("@faker-js/faker");
const fs = require("fs");

const nProducts = 20000;
const products = [];

const categories = {
  Clothing: ["Shirts", "Pants", "Jackets", "Sweaters"],
  Footwear: ["Shoes", "Boots", "Sandals", "Sneakers"],
  Accessories: ["Hats", "Belts", "Gloves", "Scarves"],
  Bags: ["Handbags", "Backpacks", "Wallets", "Duffel Bags"],
};

for (let i = 0; i < nProducts; i++) {
  const category = faker.helpers.arrayElement(Object.keys(categories));
  const subCategory = faker.helpers.arrayElement(categories[category]);

  const product = {
    name: `${faker.commerce.productAdjective()} ${subCategory}`,
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price(5, 500, 2)),
    category,
    subCategory,
    size: faker.helpers.arrayElement(["XS", "S", "M", "L", "XL"]),
    color: faker.color.human(),
    material: faker.helpers.arrayElement([
      "Cotton",
      "Leather",
      "Polyester",
      "Wool",
      "Silk",
    ]),
    stock: faker.number.int({ min: 0, max: 100 }),
    ratings: parseFloat(
      faker.number.float({ min: 1, max: 5, fractionDigits: 2 })
    ),
    tags: faker.word.words(3).split(" "),
    dateAdded: faker.date.recent(),
    brand: faker.company.name(),
    images: [
      faker.image.urlPicsumPhotos(300, 300, "fashion"),
      faker.image.urlPicsumPhotos(300, 300, "fashion"),
      faker.image.urlPicsumPhotos(300, 300, "fashion"),
    ],
  };
  products.push(product);
}

fs.writeFileSync(
  "ecommerce_clothes_data.json",
  JSON.stringify(products, null, 2),
  "utf-8"
);
console.log(
  `Generated ${nProducts} products and saved to ecommerce_clothes_data.json`
);
