const { ENVS } = require("../../src/config/constants");
const { init, postInit } = require("../../src/middleware");
const env = require("../../src/utils/env");

describe("middleware", () => {
  const envMock = jest.spyOn(env, "getEnv");

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("init in production", () => {
    envMock.mockImplementation(() => ENVS.PRODUCTION);

    const use = jest.fn();
    const app = {
      use,
    };

    init(app);

    expect(use).toHaveBeenCalledTimes(7);
    expect(envMock).toHaveBeenCalledWith("NODE_ENV");
  });

  test("init in development", () => {
    envMock.mockImplementation(() => ENVS.DEVELOPMENT);

    const use = jest.fn();
    const app = {
      use,
    };

    init(app);

    expect(use).toHaveBeenCalledTimes(7);
    expect(envMock).toHaveBeenCalledWith("NODE_ENV");
  });

  test("postinit", () => {
    const use = jest.fn();
    use.mockImplementation((fn) => {
      try {
        fn(null, null, () => {});
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log("error caught in test");
      }
    });

    const app = {
      use,
    };

    const returnedApp = postInit(app);

    expect(use).toHaveBeenCalledTimes(2);
    expect(returnedApp).toHaveProperty("use");
  });
});
