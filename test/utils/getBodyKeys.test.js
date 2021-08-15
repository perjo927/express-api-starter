const { getBodyKeys } = require("../../src/utils/getBodyKeys");
const { logger } = require("../../src/utils/logger");

describe("get keys from request body", () => {
  const errorLogMock = jest.spyOn(logger, "error");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return keys with proper input", () => {
    const req = { body: { foo: "bar" } };
    const keys = getBodyKeys(req, "foo");

    expect(keys).toStrictEqual({ foo: "bar" });
  });

  test("should not return keys if not body is passed in", () => {
    const req = { body: null };
    const keys = getBodyKeys(req, "bar");

    expect(keys).toBe(null);
    expect(errorLogMock).toHaveBeenCalled();
  });

  test("should not return keys if no keys are passed in", () => {
    const req = { body: {} };
    const keys = getBodyKeys(req);

    expect(keys).toBe(null);
    expect(errorLogMock).toHaveBeenCalledWith(
      "No keys present",
      "utils/getBodyKeys"
    );
  });

  test("should not return keys if improper key is passed in", () => {
    const req = { body: { foo: "bar" } };
    const keys = getBodyKeys(req, "bar");

    expect(keys).toBe(null);
    expect(errorLogMock).toHaveBeenCalledWith(
      "Could not find keys in request body",
      "utils/getBodyKeys"
    );
  });
});
