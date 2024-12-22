// generateReviewsAndFavorites.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const { generateObjectId } = require("./utils");

const generateReviews = (users, products, orders, count = 5000) => {
  const reviews = [];
  const reviewKeys = new Set();

  // Create map of user's purchased products
  const userPurchases = new Map();
  orders.forEach((order) => {
    if (!userPurchases.has(order.user.toString())) {
      userPurchases.set(order.user.toString(), new Set());
    }
    order.items.forEach((item) => {
      userPurchases.get(order.user.toString()).add(item.product.toString());
    });
  });

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const reviewKey = `${user._id}-${product._id}`;

    if (!reviewKeys.has(reviewKey)) {
      reviewKeys.add(reviewKey);

      const isVerifiedPurchase =
        userPurchases.has(user._id.toString()) &&
        userPurchases.get(user._id.toString()).has(product._id.toString());

      const review = {
        _id: generateObjectId(),
        user: user._id,
        product: product._id,
        rating: faker.number.int({ min: 1, max: 5 }),
        comment: faker.datatype.boolean() ? faker.lorem.paragraph() : "",
        helpfulCount: faker.number.int({ min: 0, max: 100 }),
        isVerifiedPurchase,
        createdAt: faker.date.recent({ days: 180 }),
        updatedAt: faker.date.recent({ days: 30 }),
      };

      reviews.push(review);
    }
  }

  fs.writeFileSync(
    "reviews_data.json",
    JSON.stringify(reviews, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${reviews.length} reviews and saved to reviews_data.json`
  );
  return reviews;
};

const generateFavorites = (users, products, count = 3000) => {
  const favorites = [];
  const favoriteKeys = new Set();

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const product = faker.helpers.arrayElement(products);
    const favoriteKey = `${user._id}-${product._id}`;

    if (!favoriteKeys.has(favoriteKey)) {
      favoriteKeys.add(favoriteKey);

      const favorite = {
        _id: generateObjectId(),
        userId: user._id,
        productId: product._id,
        createdAt: faker.date.recent({ days: 90 }),
        updatedAt: faker.date.recent({ days: 30 }),
      };

      favorites.push(favorite);
    }
  }

  fs.writeFileSync(
    "favorites_data.json",
    JSON.stringify(favorites, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${favorites.length} favorites and saved to favorites_data.json`
  );
  return favorites;
};

module.exports = { generateReviews, generateFavorites };
