const request = require("supertest");
const settings = require("../../index");
const app = require("../../../src/app");
const { ROUTES } = require("../../../src/config/constants");

jest.mock("../../../src/data/index");
jest.mock("../../../src/config/index");

const { BASE_URL } = settings;

const testUrl = `${BASE_URL}${ROUTES.PING}`;

describe("/api/v1/ping", () => {
  test("POST responds with Method Not Allowed", (done) => {
    request(app)
      .post(testUrl)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(405, '{"message":"Method Not Allowed"}', done);
  });

  test("responds with a pong", (done) => {
    request(app)
      .get(testUrl)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, '"pong"', done);
  });
});
