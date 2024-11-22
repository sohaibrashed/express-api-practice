const request = require("supertest");
const app = require("../app");

jest.mock("../models/user", () => {
  return {
    findOne: jest.fn().mockResolvedValue({ email: "jane.doe@example.com" }),
    create: jest.fn().mockImplementation((value) => {
      return value;
    }),
  };
});

describe("Unit Test: User Routes", () => {
  it("POST /signup - Should create a new user", async () => {
    const response = await request(app)
      .post("/api/v1/users/signup")
      .send({
        name: "Jane Doe",
        email: "jane.doe@example.com",
        password: "password123",
      })
      .expect(201);

    expect(response.body.data).toEqual({
      name: "Jane Doe",
      email: "jane.doe@example.com",
      password: "password123",
    });
  });
});
