const request = require("supertest");
const app = require("../../src/app");

jest.mock("../../src/data/index");

describe("app", () => {
  test("should export the express app correctly", () => {
    expect(app).toBeTruthy();
  });

  test("responds with a not found message", (done) => {
    request(app)
      .get("/what-is-this-even")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, done);
  });
});
