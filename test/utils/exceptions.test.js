const { HttpException } = require("../../src/utils/exceptions");

describe("HttpException", () => {
  test("should set properties and toString()", () => {
    try {
      throw new HttpException({
        status: 500,
        message: "Error",
        data: "Data",
        headers: { foo: "bar" },
      });
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toBe("Error");
      expect(error.data).toBe("Data");
      expect(error.headers).toStrictEqual({ foo: "bar" });
      expect(`${error}`).toBe(`
    Status Code: 500
    Message: Error
    Data: "Data"`);
    }
  });

  test("all properties but status default to null", () => {
    try {
      throw new HttpException({
        status: 500,
      });
    } catch (error) {
      expect(error.status).toBe(500);
      expect(error.message).toBe(null);
      expect(error.data).toBe(null);
      expect(error.headers).toBe(null);
      expect(`${error}`).toBe(`
    Status Code: 500
    Message: null
    Data: null`);
    }
  });
});
