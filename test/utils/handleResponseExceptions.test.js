const createError = require("http-errors");
const { HttpException } = require("../../src/utils/exceptions");
const { logger } = require("../../src/utils/logger");
const {
  handleResponseExceptions,
} = require("../../src/utils/handleResponseExceptions");

describe("utils/handleResponseExceptions", () => {
  const errorLogMock = jest.spyOn(logger, "error");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handle request that throws with HttpException", () => {
    const status = 400;

    const next = jest.fn();

    handleResponseExceptions(
      new HttpException({
        status,
      }),
      "here",
      next
    );

    expect(next).toHaveBeenCalledWith(createError(status));
    expect(errorLogMock).toHaveBeenCalledWith(
      `
    Status Code: 400
    Message: null
    Data: null`,
      "here"
    );
  });

  test("handle request that just throws", () => {
    const next = jest.fn();

    handleResponseExceptions(new Error("error"), "here", next);

    expect(next).toHaveBeenCalledWith(createError.InternalServerError());
    expect(errorLogMock).toHaveBeenCalledWith("Error: error", "here");
  });
});
