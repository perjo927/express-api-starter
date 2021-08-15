const request = require("supertest");
const settings = require("../../index");
const app = require("../../../src/app");
const { ROUTES } = require("../../../src/config/constants");
const { encodeBody } = require("../../../src/utils/encode");
const { BODY_KEY } = require("../../../src/api/v1/controllers/authorize");
const env = require("../../../src/utils/env");
const { generateAccessToken } = require("../../../src/utils/token");
const {
  TEST_USER_CREDENTIALS,
  TEST_ID_TOKEN,
} = require("../../../src/data/__mocks__/admin");

jest.mock("../../../src/data/admin");
jest.mock("../../../src/data/index");
jest.mock("../../../src/config/index");

const { BASE_URL } = settings;
const authorizeUrl = `${BASE_URL}${ROUTES.AUTHORIZE}`;
describe("/api/v1/authorize", () => {
  const envMock = jest.spyOn(env, "getEnv");
  envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");

  test("GET responds with Method Not Allowed", (done) => {
    request(app)
      .get(authorizeUrl)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(405, '{"message":"Method Not Allowed"}', done);
  });

  test("POST with correct id token responds with accessToken", (done) => {
    const [expectedAccessToken] = generateAccessToken(
      TEST_USER_CREDENTIALS
    ).split(".");

    request(app)
      .post(authorizeUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .send(
        encodeBody({
          [BODY_KEY]: TEST_ID_TOKEN,
        })
      )
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.accessToken.split(".")[0]).toEqual(expectedAccessToken);
        done();
      });
  });

  test("POST with incorrect id token responds with 500", (done) => {
    request(app)
      .post(authorizeUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .send(
        encodeBody({
          [BODY_KEY]: "0",
        })
      )
      .expect("Content-Type", /json/)
      .expect(500)
      .then((res) => {
        expect(res.text).toEqual('{"message":"Internal Server Error"}');
        done();
      });
  });

  test("POST with no id token responds with 400", (done) => {
    request(app)
      .post(authorizeUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .send("")
      .expect("Content-Type", /json/)
      .expect(400)
      .then((res) => {
        expect(res.text).toEqual('{"message":"Bad Request"}');
        done();
      });
  });
});
