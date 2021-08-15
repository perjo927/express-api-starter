const { logger } = require("./logger");

const thisLocation = "utils/getBodyKeys";

const getBodyKeys = (req, ...keys) => {
  if (keys.length === 0) {
    logger.error("No keys present", thisLocation);
    return null;
  }

  try {
    const { body } = req;
    const keyCollection = keys.reduce(
      (accumulatedKeys, key) =>
        body[key] ? { ...accumulatedKeys, [key]: body[key] } : accumulatedKeys,
      {}
    );

    if (keys.every((key) => Object.keys(keyCollection).includes(key))) {
      return keyCollection;
    }

    logger.error("Could not find keys in request body", thisLocation);
    return null;
  } catch (error) {
    logger.error(error, thisLocation);
    return null;
  }
};

module.exports = { getBodyKeys };
