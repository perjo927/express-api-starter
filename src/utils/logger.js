/* eslint-disable no-console */
const winston = require("winston");
const { ENVS } = require("../config/constants");
const env = require("./env");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "exceptions.log" }),
  ],
  exitOnError: env.getEnv("NODE_ENV") !== ENVS.PRODUCTION,
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (env.getEnv("NODE_ENV") !== ENVS.PRODUCTION) {
  logger.add(
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

const getLog = (level, message, location) => {
  const thisLog = {
    level,
    message,
    location,
  };
  logger.log({ ...thisLog });
  return thisLog;
};

const log = {
  logger,
  info: (message, location) => getLog("info", message, location),
  warn: (message, location) => getLog("warn", message, location),
  error: (message, location) => getLog("error", message, location),
};

module.exports = log;
