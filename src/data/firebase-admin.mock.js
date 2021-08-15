const { verifyIdToken } = require("./__mocks__/admin");

const admin = {
  initializeApp: () => {},
  credential: {
    applicationDefault: () => {},
    cert: () => {},
  },
  auth: () => ({
    verifyIdToken,
  }),
};

module.exports = admin;
