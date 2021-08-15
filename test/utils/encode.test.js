const { encodeBody, encodeParams } = require("../../src/utils/encode");

describe("encode utils", () => {
  describe("encode body", () => {
    test("should url encode a js object", () => {
      const body = {
        a: "?",
        b: "%",
      };
      const actual = encodeBody(body);
      const expected = "a=%3F&b=%25";
      expect(actual).toEqual(expected);
    });
  });

  describe("encode params", () => {
    test("should encode url params that have truthy values", () => {
      const params = { a: "a", b: "b", c: undefined };
      const expectedParams = "a=a&b=b";
      const encodedParams = encodeParams(params);

      expect(encodedParams).toStrictEqual(expectedParams);
    });
  });
});
