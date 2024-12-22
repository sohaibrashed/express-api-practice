// generateProducts.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const {
  SIZES,
  COLORS,
  MATERIALS,
  SEASONS,
  GENDERS,
  generateObjectId,
} = require("./utils");

const generateProductVariants = () => {
  const variants = [];
  const variantCount = faker.number.int({ min: 2, max: 5 });

  for (let i = 0; i < variantCount; i++) {
    variants.push({
      size: faker.helpers.arrayElement(SIZES),
      color: faker.helpers.arrayElement(COLORS),
      stock: faker.number.int({ min: 0, max: 100 }),
      images: Array.from({ length: faker.number.int({ min: 1, max: 4 }) }, () =>
        faker.image.url()
      ),
    });
  }

  return variants;
};

const generateProducts = (baseData, count = 1000) => {
  const products = [];
  const { categories, subCategories, brands } = baseData;

  for (let i = 0; i < count; i++) {
    const category = faker.helpers.arrayElement(categories);
    const validSubCategories = subCategories.filter(
      (sub) => sub.category.toString() === category._id.toString()
    );
    const validBrands = brands.filter((brand) =>
      brand.categories.includes(category._id)
    );

    const basePrice = faker.number.float({ min: 20, max: 500, precision: 2 });
    const salePrice = faker.datatype.boolean()
      ? basePrice * faker.number.float({ min: 0.5, max: 0.9, precision: 2 })
      : null;

    const product = {
      _id: generateObjectId(),
      name: `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
      description: faker.commerce.productDescription(),
      price: {
        base: basePrice,
        sale: salePrice,
        currency: faker.helpers.arrayElement(["USD", "EUR"]),
      },
      category: category._id,
      subCategory: faker.helpers.arrayElement(validSubCategories)._id,
      brand: faker.helpers.arrayElement(validBrands)._id,
      variants: generateProductVariants(),
      materials: faker.helpers.arrayElements(MATERIALS, { min: 1, max: 3 }),
      tags: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, () =>
        faker.commerce.productAdjective().toLowerCase()
      ),
      seasonality: faker.helpers.arrayElement(SEASONS),
      gender: faker.helpers.arrayElement(GENDERS),
      ratings: {
        average: faker.number.float({ min: 0, max: 5, precision: 1 }),
        count: faker.number.int({ min: 0, max: 1000 }),
      },
    };

    products.push(product);
  }

  fs.writeFileSync(
    "products_data.json",
    JSON.stringify(products, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${products.length} products and saved to products_data.json`
  );
  return products;
};

module.exports = { generateProducts };
