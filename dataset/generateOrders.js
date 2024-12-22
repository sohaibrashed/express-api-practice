// generateOrders.js
const fs = require("fs");
const { faker } = require("@faker-js/faker");
const {
  PAYMENT_METHODS,
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  generateAddress,
  generateObjectId,
} = require("./utils");

const generateOrderItems = (products, itemCount) => {
  const items = [];
  const selectedProducts = faker.helpers.arrayElements(products, itemCount);

  selectedProducts.forEach((product) => {
    const variant = faker.helpers.arrayElement(product.variants);
    const quantity = faker.number.int({ min: 1, max: 5 });
    const price = product.price.sale || product.price.base;

    items.push({
      product: product._id,
      variant: {
        size: variant.size,
        color: variant.color,
        image: variant.images[0],
      },
      quantity,
      price,
      total: price * quantity,
    });
  });

  return items;
};

const generateOrders = (users, products, count = 2000) => {
  const orders = [];

  for (let i = 0; i < count; i++) {
    const user = faker.helpers.arrayElement(users);
    const itemCount = faker.number.int({ min: 1, max: 5 });
    const items = generateOrderItems(products, itemCount);

    const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
    const uniqueItems = new Set(items.map((item) => item.product)).size;

    const order = {
      _id: generateObjectId(),
      user: user._id,
      items,
      totalAmount,
      summary: {
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        uniqueItems,
        averageItemPrice: totalAmount / items.length,
      },
      paymentMethod: faker.helpers.arrayElement(PAYMENT_METHODS),
      paymentStatus: faker.helpers.arrayElement(PAYMENT_STATUSES),
      orderStatus: faker.helpers.arrayElement(ORDER_STATUSES),
      shippingAddress: generateAddress(),
      notes: faker.datatype.boolean() ? faker.lorem.sentence() : undefined,
      createdBy: user._id,
      lastModifiedBy: user._id,
      createdAt: faker.date.recent({ days: 90 }),
      updatedAt: faker.date.recent({ days: 30 }),
    };

    orders.push(order);
  }

  fs.writeFileSync(
    "orders_data.json",
    JSON.stringify(orders, null, 2),
    "utf-8"
  );

  console.log(
    `Generated ${orders.length} orders and saved to orders_data.json`
  );
  return orders;
};

module.exports = { generateOrders };
