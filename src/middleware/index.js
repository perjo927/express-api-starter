const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const createError = require("http-errors");
const cors = require("cors");
const errorHandler = require("./errorHandler");
const { ENVS } = require("../config/constants");
const env = require("../utils/env");
const auth = require("./auth");

const init = (app) => {
  const loggingStyle =
    env.getEnv("NODE_ENV") === ENVS.DEVELOPMENT ? "dev" : "common";

  app.use(logger(loggingStyle));
  app.use(helmet());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: false,
    })
  );
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, "public")));
  app.use(cors());

  auth.init();

  return app;
};

const postInit = (app) => {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(createError.NotFound());
  });

  // pass any errors to the error handler
  // Since it's placed last
  // it will be the last middleware called, if all others
  // invoke next() and do not respond.
  app.use(errorHandler);

  return app;
};

module.exports = { init, postInit };
