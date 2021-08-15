const createError = require("http-errors");
const { ENVS } = require("../config/constants");
const env = require("../utils/env");

// middleware with an arity of 4 are considered
// error handling middleware. When you next(err)
// it will be passed through the defined middleware
// in order, but ONLY those with an arity of 4, ignoring
// regular middleware.
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // if err message is safe to expose to client or we are in development mode
  if (err.expose === true || env.getEnv("NODE_ENV") === ENVS.DEVELOPMENT) {
    res.status(err.status || 500).send(err);
  } else {
    res.status(500).send(createError.InternalServerError());
  }
};

module.exports = errorHandler;
