const { init } = require("../../src/data");
const env = require("../../src/utils/env");
const logger = require("../../src/utils/logger");

jest.mock("../../src/data/admin");
jest.mock("../../src/data/service-account");

describe("data", () => {
  const errorLogMock = jest.spyOn(logger, "error");
  const envMock = jest.spyOn(env, "getEnv");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("init successfully", () => {
    envMock.mockImplementation((key) =>
      key === "NODE_ENV" ? "development" : "url"
    );

    init();

    expect(errorLogMock).not.toHaveBeenCalled();
  });

  test("init with errors", () => {
    envMock.mockImplementation(() => false);

    init();

    expect(errorLogMock).toHaveBeenCalledWith(
      "Firebase Admin could not be initialized",
      "data/index"
    );
  });
});
