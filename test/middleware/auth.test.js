jest.requireActual("../../src/middleware/passportHandler");

const passport = require("passport");
const request = require("supertest");
const logger = require("../../src/utils/logger");
const env = require("../../src/utils/env");
const { getUser, init } = require("../../src/middleware/auth");

const settings = require("../index");
const app = require("../../src/app");
const { ROUTES } = require("../../src/config/constants");
const { encodeBody } = require("../../src/utils/encode");
const {
  BODY_KEY: authorizeBodyKey,
} = require("../../src/api/v1/controllers/authorize");
const { generateAccessToken } = require("../../src/utils/token");

jest.mock("../../src/data/index");

const { BASE_URL } = settings;
const authorizeUrl = `${BASE_URL}${ROUTES.AUTHORIZE}`;
const testAuthUrl = `${BASE_URL}${ROUTES.TEST_AUTH}`;

jest.mock("../../src/data/admin");

const {
  TEST_USER_CREDENTIALS,
  TEST_ERROR_MESSAGE,
  TEST_ID_TOKEN,
  TEST_ID_TOKEN_2,
} = require("../../src/data/__mocks__/admin");

describe("auth middleware", () => {
  const errorLogMock = jest.spyOn(logger, "error");
  const envMock = jest.spyOn(env, "getEnv");

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get user", () => {
    test("resolves promise with token", (done) => {
      envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");

      getUser(TEST_ID_TOKEN).then((accessToken) => {
        expect(accessToken.split(".")[0]).toBe(
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
        );
        done();
      });
    });

    test("rejects promise when env variable can't be found", (done) => {
      envMock.mockImplementation(() => undefined);

      getUser(TEST_ID_TOKEN)
        .then(() => {})
        .catch((error) => {
          expect(error).toBe("No access token could be generated");
          expect(errorLogMock).toHaveBeenCalledWith(
            "No access token secret could be found",
            "utils/token"
          );
          done();
        });
    });

    test("rejects promise when token can't be verified", (done) => {
      envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");

      getUser(0)
        .then(() => {})
        .catch((error) => {
          expect(error).toStrictEqual(new Error(TEST_ERROR_MESSAGE));
          done();
        });
    });
  });

  describe("init", () => {
    const passportSpy = jest.spyOn(passport, "use");

    test("early return if no secret", () => {
      envMock.mockImplementation(() => undefined);

      init();

      expect(errorLogMock).toHaveBeenCalledWith(
        "No access token secret could be found",
        "utils/token"
      );
    });

    test("calls passport if there is a secret", () => {
      envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");

      init();

      expect(passportSpy).toHaveBeenCalled();
    });
  });
});

describe("test API with JWT authentication", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("Can not GET protected route withouth authorization", (done) => {
    request(app)
      .get(testAuthUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .expect(401)
      .then((res) => {
        expect(res.text).toEqual("Unauthorized");
        done();
      });
  });

  test("GET responds with 200 after authorizing", (done) => {
    const [expectedAccessToken] = generateAccessToken(
      TEST_USER_CREDENTIALS
    ).split(".");

    request(app)
      .post(authorizeUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .send(
        encodeBody({
          [authorizeBodyKey]: TEST_ID_TOKEN,
        })
      )
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        expect(res.body.accessToken.split(".")[0]).toEqual(expectedAccessToken);

        const authHeader = `Bearer ${res.body.accessToken}`;

        request(app)
          .get(testAuthUrl)
          .set(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=UTF-8"
          )
          .set("Accept", "application/json")
          .set("Authorization", authHeader)
          .expect("Content-Type", "text/html; charset=utf-8")
          .expect(200)
          .then((r) => {
            expect(r.text).toEqual("Authorized");
            done();
          })
          .catch((err) => done(err));
      });
  });

  test("GET with invalid auth credentials should fail", (done) => {
    request(app)
      .post(authorizeUrl)
      .set("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
      .set("Accept", "application/json")
      .send(
        encodeBody({
          [authorizeBodyKey]: TEST_ID_TOKEN_2,
        })
      )
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => {
        const authHeader = `Bearer ${res.body.accessToken}`;
        request(app)
          .get(testAuthUrl)
          .set(
            "Content-Type",
            "application/x-www-form-urlencoded;charset=UTF-8"
          )
          .set("Accept", "application/json")
          .set("Authorization", authHeader)
          .expect("Content-Type", /json/)
          .expect(500)
          .then((r) => {
            expect(r.text).toEqual('{"message":"Internal Server Error"}');
            done();
          })
          .catch((err) => done(err));
      });
  });
});
