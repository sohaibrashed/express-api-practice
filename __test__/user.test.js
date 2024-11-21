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

describe("Integration Test: User Routes", () => {
  it("POST /signup - Should create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users/signup")
      .send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password123",
      })
      .expect(201);

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.name).toBe("Jane Doe");
  });

  it("POST /signin - Should log in an existing user", async () => {
    const response = await request(app)
      .post("/api/v1/users/signin")
      .send({
        email: "jane.doe@example.com",
        password: "password123",
      })
      .expect(200);

    expect(response.body.data).toHaveProperty("_id");
    expect(response.body.data.email).toBe("jane.doe@example.com");
  });
});
