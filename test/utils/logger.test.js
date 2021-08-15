/* eslint-disable global-require */
const { ENVS } = require("../../src/config/constants");

describe("logger", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("should log info", () => {
    const logger = require("../../src/utils/logger");
    const log = logger.info("message", "thisLocation");

    expect(log).toStrictEqual({
      level: "info",
      location: "thisLocation",
      message: "message",
    });
  });

  test("should log warn", () => {
    const logger = require("../../src/utils/logger");
    const log = logger.warn("message", "thisLocation");

    expect(log).toStrictEqual({
      level: "warn",
      location: "thisLocation",
      message: "message",
    });
  });

  test("should log error", () => {
    const logger = require("../../src/utils/logger");
    const log = logger.error("message", "thisLocation");

    expect(log).toStrictEqual({
      level: "error",
      location: "thisLocation",
      message: "message",
    });
  });

  test("should not log to console in production and not exit on error", () => {
    process.env.NODE_ENV = ENVS.PRODUCTION;

    const logger = require("../../src/utils/logger");
    const log = logger.error("message", "thisLocation");

    expect(log).toStrictEqual({
      level: "error",
      location: "thisLocation",
      message: "message",
    });

    expect(logger.logger.exitOnError).toBe(false);
    // eslint-disable-next-line no-underscore-dangle
    expect(logger.logger._readableState.pipesCount).toBe(3);

    process.env.NODE_ENV = ENVS.TEST;
  });
});
