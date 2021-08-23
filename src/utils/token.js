const jwt = require("jsonwebtoken");
const env = require("./env");
const logger = require("./logger");

const thisLocation = "utils/token";

const getSecret = () => {
  const accessTokenSecret = env.getEnv("ACCESS_TOKEN_SECRET");

  if (!accessTokenSecret) {
    logger.error("No access token secret could be found", thisLocation);
    return false;
  }

  return accessTokenSecret;
};

const generateAccessToken = ({ sub, name }) => {
  const accessTokenSecret = getSecret();

  if (!accessTokenSecret) {
    return null;
  }

  const accessToken = jwt.sign({ sub, name }, accessTokenSecret, {
    expiresIn: "3600s",
  });
  return accessToken;
};

module.exports = { generateAccessToken, getSecret };
