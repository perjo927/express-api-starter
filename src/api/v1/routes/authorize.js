const express = require("express");
const createError = require("http-errors");
const { authorize } = require("../controllers/index");

const router = express.Router();

router.post("/", [authorize.handle]).all("/", (req, res, next) => {
  next(createError.MethodNotAllowed());
});

module.exports = router;
