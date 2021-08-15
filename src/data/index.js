/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const logger = require("../utils/logger");
const env = require("../utils/env");
const { initialize } = require("./admin");
const { getServiceAccount } = require("./service-account");
const { ENVS } = require("../config/constants");

const thisLocation = "data/index";

const init = () => {
  const nodeEnv = env.getEnv("NODE_ENV");
  const serviceAccountUrl = env.getEnv("GOOGLE_SERVICE_ACCOUNT_URL");
  const serviceAccount =
    nodeEnv === ENVS.DEVELOPMENT ? getServiceAccount() : false;
  const firebaseAdminApp = initialize({ serviceAccount, serviceAccountUrl });

  if (!firebaseAdminApp) {
    logger.error("Firebase Admin could not be initialized", thisLocation);
  }
};

module.exports = { init };
