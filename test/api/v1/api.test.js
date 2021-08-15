const request = require("supertest");
const settings = require("../../index");
const app = require("../../../src/app");

jest.mock("../../../src/data/index");
jest.mock("../../../src/config/index");

const { BASE_URL } = settings;

describe("GET /api/v1", () => {
  test("responds with a 404", (done) => {
    request(app)
      .get(BASE_URL)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(404, '{"message":"Not Found"}', done);
  });
});
