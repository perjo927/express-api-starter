const dotenv = require("dotenv");
const logger = require("../utils/logger");

const thisLocation = "config/index";

const init = () => {
  // process.env will have the keys and values you defined in your
  // .env file:
  // process.env.NODE_ENV,
  // process.env.API_KEY, ...
  const config = dotenv.config({
    path: ".env",
    // debug: process.env.DEBUG // help debug why certain keys or values are not being set as you expect
  });

  if (config.error) {
    logger.error(config.error, thisLocation);
  }
};

module.exports = { init };
