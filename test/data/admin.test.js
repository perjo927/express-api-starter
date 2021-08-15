const { initialize, verifyIdToken } = require("../../src/data/admin");

describe("data/admin", () => {
  describe("initialize", () => {
    test("initializes admin with service account", () => {
      const init = initialize({
        serviceAccount: "account",
        serviceAccountUrl: "",
      });
      expect(init).toBe(true);
    });
    test("initializes admin without service account", () => {
      const init = initialize({ serviceAccountUrl: "" });
      expect(init).toBe(true);
    });
  });

  describe("verifyIdToken", () => {
    test("returns a resolved promise", (done) => {
      verifyIdToken(true).then((result) => {
        expect(result).toStrictEqual({ uid: 42, name: "Foo" });
        done();
      });
    });

    test("returns a rejected promise", (done) => {
      verifyIdToken(false)
        .then(() => {})
        .catch((error) => {
          expect(error).toStrictEqual(new Error("Error!"));
          done();
        });
    });
  });
});
