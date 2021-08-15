const TEST_USER_CREDENTIALS = { uid: 1, name: "Test" };
const TEST_ID_TOKEN = "123456";
const TEST_ID_TOKEN_2 = "654321";
const TEST_ERROR_MESSAGE = "Bad Test User ID Token";

const initialize = ({ serviceAccount, serviceAccountUrl }) =>
  serviceAccount && serviceAccountUrl;

const verifyIdToken = (idToken) =>
  new Promise((resolve, reject) => {
    if (idToken === TEST_ID_TOKEN) {
      resolve(TEST_USER_CREDENTIALS);
    } else if (idToken === TEST_ID_TOKEN_2) {
      resolve({ name: "Insufficient Credentials" });
    }

    reject(new Error(TEST_ERROR_MESSAGE));
  });

module.exports = {
  initialize,
  verifyIdToken,
  TEST_USER_CREDENTIALS,
  TEST_ID_TOKEN,
  TEST_ID_TOKEN_2,
  TEST_ERROR_MESSAGE,
};
