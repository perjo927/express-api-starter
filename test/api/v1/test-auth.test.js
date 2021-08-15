const request = require("supertest");
const settings = require("../../index");
const app = require("../../../src/app");
const { ROUTES } = require("../../../src/config/constants");

jest.mock("../../../src/middleware/passportHandler");
jest.mock("../../../src/data/index");
jest.mock("../../../src/config/index");

const { BASE_URL } = settings;
const testAuthUrl = `${BASE_URL}${ROUTES.TEST_AUTH}`;

describe("/api/v1/test-auth", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("POST responds with Method Not Allowed", (done) => {
    request(app)
      .post(testAuthUrl)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(405, '{"message":"Method Not Allowed"}', done);
  });

  test("GET responds with 200", () => {
    request(app)
      .get(testAuthUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});
