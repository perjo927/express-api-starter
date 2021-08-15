const createError = require("http-errors");
const { handle } = require("../../../src/api/v1/controllers/authorize");
const {
  TEST_USER_CREDENTIALS,
  TEST_ID_TOKEN,
} = require("../../../src/data/__mocks__/admin");
const env = require("../../../src/utils/env");
const { logger } = require("../../../src/utils/logger");
const { generateAccessToken } = require("../../../src/utils/token");

jest.mock("../../../src/data/admin");

describe("authorize controller", () => {
  const errorLogMock = jest.spyOn(logger, "error");
  const envMock = jest.spyOn(env, "getEnv");
  envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handle improper body keys", async () => {
    const next = jest.fn();

    await handle({ body: null }, null, next);

    expect(errorLogMock).toHaveBeenCalledTimes(2);
    expect(next).toHaveBeenCalledWith(createError.BadRequest());
  });

  test("handle body with incorrect id token", (done) => {
    const request = {
      body: { id_token: "0" },
    };

    const next = jest.fn();
    next.mockImplementation(() => {
      expect(next).toHaveBeenCalledWith(createError.InternalServerError());
      done();
    });

    handle(request, null, next);
  });

  test("handle body with correct id token", (done) => {
    const request = {
      body: { id_token: TEST_ID_TOKEN },
    };
    const [expectedAccessToken] = generateAccessToken(
      TEST_USER_CREDENTIALS
    ).split(".");

    const json = jest.fn();
    json.mockImplementation((data) => {
      expect(data.accessToken.split(".")[0]).toEqual(expectedAccessToken);
      done();
    });

    const res = {
      json,
    };

    handle(request, res, jest.fn());
  });
});
