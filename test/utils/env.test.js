const { getEnv } = require("../../src/utils/env");

describe("env", () => {
  test("should return value of property in process.env", () => {
    process.env.TESTINGTESTING = "TESTING";
    expect(getEnv("TESTINGTESTING")).toBe("TESTING");
  });
});
