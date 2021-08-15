const admin = {
  credential: {
    cert: () => {},
    applicationDefault: () => {},
  },
  initializeApp: () => true,
  auth() {
    return this;
  },
  verifyIdToken: (idToken) => {
    if (idToken) {
      return Promise.resolve({ uid: 42, name: "Foo" });
    }
    return Promise.reject(new Error("Error!"));
  },
};

module.exports = admin;
