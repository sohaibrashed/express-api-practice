const request = require("supertest");
const mongoose = require("mongoose");

const app = require("../app");

beforeAll(async () => {
  const MONGO_URI = "mongodb://localhost:27017/jest-tests";
  await mongoose.connect(MONGO_URI);
  console.log("Connected to the test database");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  console.log("Disconnected from the test database");
});

describe("Integration Test: Product Routes", () => {
  it("POST / - Should create a new product", async () => {
    const response = await request(app)
      .post("/api/v1/products/")
      .send({
        name: "Sleek Jackets",
        description:
          "Our koala-friendly Soap ensures every comfort for your pets",
        price: 947.89,
        category: "Clothing",
        subCategory: "Jackets",
        size: "S",
        color: "orchid",
        material: "Wool",
        stock: 52,
        ratings: 4.85,
        tags: ["handover", "mousse", "mmm"],
        dateAdded: "2024-11-18T10:08:18.655Z",
        brand: "Bernhard and Sons",
        images: [
          "https://picsum.photos/seed/QfJjq/2960/1384?grayscale&blur=5",
          "https://picsum.photos/seed/na7bM5/1688/596?grayscale&blur=6",
          "https://picsum.photos/seed/1d6smXf0z6/3271/2135?grayscale&blur=5",
        ],
      })
      .expect(201);

    expect(response.body).toHaveProperty("status", "success");
  });

  it("GET / - get all existing products", async () => {
    const response = await request(app).get("/api/v1/products/").expect(200);

    expect(response.body).toHaveProperty("status", "success");

    const product = response.body.data[0];
    expect(product).toHaveProperty("_id");
  });
});
