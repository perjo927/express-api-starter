const express = require("express");
const { ROUTES } = require("../../../config/constants");

const router = express.Router();

const ping = require("./ping");
const testAuth = require("./test-auth");
const authorize = require("./authorize");

router.get("/", (req, res, next) => {
  next();
});

router.use(ROUTES.PING, ping);
router.use(ROUTES.AUTHORIZE, authorize);
router.use(ROUTES.TEST_AUTH, testAuth);

const init = (app) => {
  app.use("/api/v1", router);
};

module.exports = { init };
