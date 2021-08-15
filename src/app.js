const express = require("express");

const routes = require("./api/v1/routes/index");
const config = require("./config");
const middleware = require("./middleware");
const data = require("./data/index");

const app = express();

config.init();
middleware.init(app);
routes.init(app);
data.init();
middleware.postInit(app);

module.exports = app;
