const dotenv = require("dotenv");
const { init } = require("../../src/config");
const logger = require("../../src/utils/logger");

describe("config", () => {
  const configMock = jest.spyOn(dotenv, "config");
  const errorLogMock = jest.spyOn(logger, "error");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("doesn't log if client secret and id exist and there is no config error", () => {
    configMock.mockImplementation(() => ({ error: false }));

    init();

    expect(errorLogMock).not.toHaveBeenCalled();
  });

  test("logs error if error in config", () => {
    configMock.mockImplementation(() => ({ error: "error" }));

    init();

    expect(errorLogMock).toHaveBeenCalledWith("error", "config/index");
  });
});
