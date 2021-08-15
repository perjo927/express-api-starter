const createError = require("http-errors");
const { HttpException } = require("./exceptions");
const { logger } = require("./logger");

const handleResponseExceptions = (error, location, next) => {
  logger.error(`${error}`, location);

  if (error instanceof HttpException) {
    // eslint-disable-next-line no-unused-vars
    const { status, data, headers, message } = error;
    next(createError(status));
  } else {
    next(createError.InternalServerError());
  }
};

module.exports = { handleResponseExceptions };
