// Uncomment line 2 and comment line 3 to enable the real firebase admin
// const admin = require("firebase-admin");
const admin = require("../../__mocks__/firebase-admin");

const initialize = ({ serviceAccount, serviceAccountUrl }) => {
  if (!serviceAccount) {
    return admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      databaseURL: serviceAccountUrl,
    });
  }
  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: serviceAccountUrl,
  });
};

const verifyIdToken = (idToken) => {
  return new Promise((resolve, reject) => {
    admin
      .auth()
      .verifyIdToken(idToken)
      .then((decodedToken) => {
        resolve(decodedToken);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { initialize, verifyIdToken };
