jest.mock("axios");
const axios = require("axios");
const { HttpException } = require("../../src/utils/exceptions");
const handleRequest = require("../../src/utils/handleRequest");

describe("handle request", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should return response from axios successfully", async () => {
    axios.mockReturnValue({
      foo: "bar",
    });

    try {
      const response = await handleRequest("url", {
        method: "post",
        data: "body",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
      expect(response).toStrictEqual({ foo: "bar" });
    } catch (error) {
      expect(error).toBe("");
    }
  });

  test("should throw HttpException if axios throws with >2xx", async () => {
    const errorObject = {
      data: "data",
      status: 400,
      headers: "headers",
    };
    function MockException() {
      this.toJSON = () => "errorAsJson";
      this.response = errorObject;
    }

    axios.mockImplementation(() => {
      throw new MockException();
    });

    try {
      await handleRequest("url", {
        method: "post",
        data: "body",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error).toHaveProperty("data", "data");
      expect(error).toHaveProperty("status", 400);
      expect(error).toHaveProperty("headers", "headers");
    }
  });

  test("should throw HttpException if axios throws without getting response", async () => {
    function MockException() {
      this.toJSON = () => "errorAsJson";
      this.request = "request";
    }

    axios.mockImplementation(() => {
      throw new MockException();
    });

    try {
      await handleRequest("url", {
        method: "post",
        data: "body",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error).toHaveProperty("data", "request");
      expect(error).toHaveProperty("status", 503);
      expect(error).toHaveProperty("message", "No response received");
    }
  });

  test("should throw HttpException if axios if unknown request error trigged", async () => {
    function MockException() {
      this.toJSON = () => "errorAsJson";
      this.message = "message";
    }

    axios.mockImplementation(() => {
      throw new MockException();
    });

    try {
      await handleRequest("url", {
        method: "post",
        data: "body",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error).toHaveProperty("status", 500);
      expect(error).toHaveProperty("message", "message");
    }
  });
});
