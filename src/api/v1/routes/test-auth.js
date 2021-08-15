const express = require("express");
const createError = require("http-errors");
const passportMiddleware = require("../../../middleware/passportHandler");
const { testAuth } = require("../controllers/index");

const router = express.Router();

router
  .get("/", passportMiddleware.handle(), [testAuth.handle])
  .all("/", (req, res, next) => {
    next(createError.MethodNotAllowed());
  });

module.exports = router;
