const { handle } = require("../../../src/api/v1/controllers/test-auth");

describe("test auth", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("handle request", (done) => {
    const send = jest.fn();
    send.mockImplementation((x) => {
      expect(x).toBe("Authorized");
      done();
    });

    const res = {
      status: () => {
        return { send };
      },
    };

    handle(null, res, null);
  });
});
