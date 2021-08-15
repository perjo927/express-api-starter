const createError = require("http-errors");
const { ENVS } = require("../../src/config/constants");
const errorHandler = require("../../src/middleware/errorHandler");
const env = require("../../src/utils/env");

describe("errorHandler", () => {
  const send = jest.fn();
  const status = jest.fn().mockReturnValue({
    send,
  });
  const res = {
    status,
  };

  const envMock = jest.spyOn(env, "getEnv");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("if error has true expose property and NODE_ENV is development it should respond with the error", () => {
    envMock.mockImplementation(() => ENVS.DEVELOPMENT);

    const err = { expose: true, status: 400 };
    errorHandler(err, null, res, null);
  });

  test("if error has true expose property and NODE_ENV is not development it should respond with the error and the status code", () => {
    envMock.mockImplementation(() => ENVS.TEST);

    const err = { expose: true, status: 400 };
    errorHandler(err, null, res, null);
    expect(send).toHaveBeenCalledWith(err);
    expect(status).toHaveBeenCalledWith(400);
  });

  test("if error has true expose property but no status it should respond with the error and code 500", () => {
    const err = { expose: true };
    errorHandler(err, null, res, null);
    expect(send).toHaveBeenCalledWith(err);
    expect(status).toHaveBeenCalledWith(500);
  });

  test("if error object has status > 500 it should not exposed by default and set status to 500", () => {
    const err = createError(528, "BAD");
    errorHandler(err, null, res, null);
    expect(send).toHaveBeenCalledWith(createError.InternalServerError());
    expect(status).toHaveBeenCalledWith(500);
  });

  test("if error has false expose property but NODE_ENV is development it should respond with the error and the status code", () => {
    envMock.mockImplementation(() => ENVS.DEVELOPMENT);

    const err = { expose: false, status: 400 };
    errorHandler(err, null, res, null);

    process.env.NODE_ENV = "test";

    expect(send).toHaveBeenCalledWith(err);
    expect(status).toHaveBeenCalledWith(400);
  });

  test("if error has false expose property and NODE_ENV is not development it should respond with internal server error and 500", () => {
    envMock.mockImplementation(() => ENVS.TEST);

    const err = { expose: false, status: 400 };
    errorHandler(err, null, res, null);

    expect(send).toHaveBeenCalledWith(createError.InternalServerError());
    expect(status).toHaveBeenCalledWith(500);
  });
});
