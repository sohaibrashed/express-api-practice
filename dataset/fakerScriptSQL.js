const { faker } = require("@faker-js/faker");
const fs = require("fs");

const nProducts = 1000;

const categories = {
  Clothing: ["Shirts", "Pants", "Jackets", "Sweaters"],
  Footwear: ["Shoes", "Boots", "Sandals", "Sneakers"],
  Accessories: ["Hats", "Belts", "Gloves", "Scarves"],
  Bags: ["Handbags", "Backpacks", "Wallets", "Duffel Bags"],
};

let sqlStatements = [];

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
    ratings: parseFloat(faker.number.float({ min: 1, max: 5, precision: 0.1 })),
    tags: faker.word.words(3).split(" "),
    dateAdded: faker.date.recent(),
    brand: faker.company.name(),
    images: [
      faker.image.urlPicsumPhotos(300, 300, "fashion"),
      faker.image.urlPicsumPhotos(300, 300, "fashion"),
      faker.image.urlPicsumPhotos(300, 300, "fashion"),
    ],
  };

  const tags = product.tags
    .map((tag) => `${tag.replace(/'/g, " ")}`)
    .join(", ");
  const images = product.images
    .map((img) => `${img.replace(/'/g, " ")}`)
    .join(", ");

  const sql = `
    INSERT INTO Products (name, description, price, category, subCategory, size, color, material, stock, ratings, tags, dateAdded, brand, images)
    VALUES (
      '${product.name.replace(/'/g, "''")}',
      '${product.description.replace(/'/g, "''")}', 
      ${product.price},
      '${product.category}',
      '${product.subCategory}',
      '${product.size}',
      '${product.color}',
      '${product.material}',
      ${product.stock},
      ${product.ratings},
      '${tags}',
      '${product.dateAdded.toISOString()}',
      '${product.brand.replace(/'/g, "''")}',
      '${images}'
    );
  `;
  sqlStatements.push(sql);
}

fs.writeFileSync(
  "ecommerce_clothes_data.sql",
  sqlStatements.join("\n"),
  "utf-8"
);
console.log(
  `Generated ${nProducts} products and saved to ecommerce_clothes_data.sql`
);
