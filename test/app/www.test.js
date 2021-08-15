/* eslint-disable no-global-assign */
/* eslint-disable global-require */
/* eslint-disable import/newline-after-import */
const http = require("http");
jest.mock("../../src/app");
const app = require("../../src/app");
const logger = require("../../src/utils/logger");

jest.mock("../../src/data/index");

describe("www", () => {
  const originalProcess = process;

  const errorLogMock = jest.spyOn(logger, "error");
  const infoLogMock = jest.spyOn(logger, "info");

  const exit = jest.fn();

  beforeAll(() => {
    process = { ...process, exit };
  });

  afterAll(() => {
    process = originalProcess;
  });

  const httpMock = jest.spyOn(http, "createServer");
  httpMock.mockImplementation(() => ({
    listen: () => {},
    on: () => {},
  }));

  app.mockImplementation({
    set: () => {},
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("normalize port", () => {
    test("should normalize port integer", () => {
      const { normalizePort } = require("../../bin/www");

      const port = normalizePort(1);
      expect(port).toBe(1);
    });

    test("should normalize port string", () => {
      const { normalizePort } = require("../../bin/www");

      const port = normalizePort("pipe");
      expect(port).toBe("pipe");
    });

    test("should normalize port <=0", () => {
      const { normalizePort } = require("../../bin/www");

      const port = normalizePort(-1);
      expect(port).toBe(false);
    });
  });

  describe("on listening", () => {
    test("should log port object", () => {
      const { onListening } = require("../../bin/www");

      onListening({ address: () => ({ port: 1 }) });
      expect(infoLogMock).toHaveBeenCalledWith("Listening on port 1", "www");
    });

    test("should log port string", () => {
      const { onListening } = require("../../bin/www");

      onListening({ address: () => "PIPE" });
      expect(infoLogMock).toHaveBeenCalledWith("Listening on pipe PIPE", "www");
    });
  });

  describe("on error", () => {
    test("should log EACCES and port as integer", () => {
      const { onError } = require("../../bin/www");

      onError({ code: "EACCES", syscall: "listen" }, 1);
      expect(errorLogMock).toHaveBeenCalledWith(
        "Port 1 requires elevated privileges",
        "www"
      );
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should log EACCES and port as string", () => {
      const { onError } = require("../../bin/www");

      onError({ code: "EACCES", syscall: "listen" }, "PIPE");
      expect(errorLogMock).toHaveBeenCalledWith(
        "Pipe PIPE requires elevated privileges",
        "www"
      );
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should log EADDRINUSE and port as integer", () => {
      const { onError } = require("../../bin/www");

      onError({ code: "EADDRINUSE", syscall: "listen" }, 1);
      expect(errorLogMock).toHaveBeenCalledWith(
        "Port 1 is already in use",
        "www"
      );
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should log EADDRINUSE and port as string", () => {
      const { onError } = require("../../bin/www");

      onError({ code: "EADDRINUSE", syscall: "listen" }, "PIPE");
      expect(errorLogMock).toHaveBeenCalledWith(
        "Pipe PIPE is already in use",
        "www"
      );
      expect(exit).toHaveBeenCalledWith(1);
    });

    test("should throw error by default", () => {
      const { onError } = require("../../bin/www");

      try {
        onError({
          code: "random error",
          syscall: "listen",
          toString: () => "error",
        });
      } catch (error) {
        expect(errorLogMock).toHaveBeenCalledWith(
          "Unknown error: error",
          "www"
        );
      }
    });

    test("should throw if syscall !== listen ", () => {
      const { onError } = require("../../bin/www");

      try {
        onError({ foo: "bar", toString: () => "error" });
      } catch (error) {
        expect(errorLogMock).toHaveBeenCalledWith(
          'error.syscall !== "listen", error: error',
          "www"
        );
        expect(error).toHaveProperty("foo", "bar");
      }
    });
  });
});
