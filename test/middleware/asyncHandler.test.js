const asyncMiddleware = require("../../src/middleware/asyncHandler");

describe("async middleware", () => {
  test("should wrap async route in promise", () => {
    const callback = jest.fn(
      (req, res, next) =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve({ req, res, next });
          }, 300);
        })
    );
    const asyncMiddleWareFn = asyncMiddleware(callback);
    const asynMiddleWareFnPromise = asyncMiddleWareFn("req", "res", "next");

    asynMiddleWareFnPromise.then((result) => {
      expect(result).toStrictEqual({ next: "next", req: "req", res: "res" });
    });
  });

  test("should wrap async route in promise", () => {
    const next = jest.fn();
    const callback = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error("fail"));
          }, 300);
        })
    );
    const asyncMiddleWareFn = asyncMiddleware(callback);
    const asynMiddleWareFnPromise = asyncMiddleWareFn("req", "res", next);

    asynMiddleWareFnPromise.then(() => {
      expect(next).toHaveBeenCalledWith(new Error("fail"));
    });
  });
});
