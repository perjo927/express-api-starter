#!/usr/bin/env node

const http = require("http");
const app = require("../src/app");
const env = require("../src/utils/env");
const logger = require("../src/utils/logger");

const thisLocation = "www";

const normalizePort = (val) => {
  const port = Number(val);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = (error, port) => {
  if (error.syscall !== "listen") {
    logger.error(`error.syscall !== "listen", error: ${error}`, thisLocation);
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      logger.error(`${bind} requires elevated privileges`, thisLocation);
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(`${bind} is already in use`, thisLocation);
      process.exit(1);
      break;
    default:
      logger.error(`Unknown error: ${error}`, thisLocation);
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 */
const onListening = (server) => {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
  logger.info(`Listening on ${bind}`, thisLocation);
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(env.getEnv("PORT") || "5000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", (error) => onError(error, port));
server.on("listening", () => onListening(server));

module.exports = {
  onListening,
  onError,
  normalizePort,
};
