const express = require("express");
const createError = require("http-errors");

const router = express.Router();

router
  .get("/", (req, res) => {
    res.json("pong");
  })
  .all("/", (req, res, next) => {
    next(createError.MethodNotAllowed());
  });

module.exports = router;
