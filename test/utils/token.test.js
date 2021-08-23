const { TEST_USER_CREDENTIALS } = require("../../src/data/__mocks__/admin");
const env = require("../../src/utils/env");
const logger = require("../../src/utils/logger");
const { getSecret, generateAccessToken } = require("../../src/utils/token");

describe("utils/token", () => {
  const errorLogMock = jest.spyOn(logger, "error");
  const envMock = jest.spyOn(env, "getEnv");

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("get secret", () => {
    test("can't find secret", () => {
      envMock.mockImplementation(() => undefined);

      const secret = getSecret();

      expect(secret).toBe(false);
      expect(errorLogMock).toHaveBeenCalledWith(
        "No access token secret could be found",
        "utils/token"
      );
    });

    test("can find secret", () => {
      envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");
      const secret = getSecret();
      expect(secret).toBe("ACCESS_TOKEN_SECRET");
    });
  });

  describe("generate access token", () => {
    test("can't find secret", () => {
      envMock.mockImplementation(() => undefined);

      const accessToken = generateAccessToken(TEST_USER_CREDENTIALS);

      expect(accessToken).toBe(null);
      expect(errorLogMock).toHaveBeenCalledWith(
        "No access token secret could be found",
        "utils/token"
      );
    });

    test("returns access token", () => {
      envMock.mockImplementation(() => "ACCESS_TOKEN_SECRET");
      const accessToken = generateAccessToken(TEST_USER_CREDENTIALS);
      expect(accessToken.split(".")[0]).toBe(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
      );
    });
  });
});
