const passport = require("passport");
const { handle } = require("../../src/middleware/passportHandler");

describe("passport middleware", () => {
  const passportSpy = jest.spyOn(passport, "authenticate");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should call authenticate function", () => {
    const middlewareFn = handle();
    expect(middlewareFn.name).toBe("authenticate");
    expect(passportSpy).toHaveBeenCalledWith("jwt", { session: false });
  });
});
