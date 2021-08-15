/* eslint-disable no-unused-vars */
const axios = require("axios");
const { HttpException } = require("./exceptions");
const logger = require("./logger");

const thisLocation = "utils/handleRequest";

const handleRequest = async (...request) => {
  try {
    const response = await axios(...request);
    const {
      data,
      status,
      statusText,
      headers,
      config,
      request: originalRequest,
    } = response;

    return response;
  } catch (error) {
    logger.error("Request Error!", thisLocation);
    logger.error(JSON.stringify(error.toJSON()), thisLocation);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data, status, headers } = error.response;
      const errorObject = {
        status,
        data,
        headers,
        message: "Unsuccessful Status Code",
      };

      logger.error(JSON.stringify(errorObject), thisLocation);

      throw new HttpException(errorObject);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      const errorObject = {
        status: 503,
        message: "No response received",
        data: error.request,
      };

      logger.error(JSON.stringify(errorObject), thisLocation);

      throw new HttpException(errorObject);
    } else {
      // Something happened in setting up the request that triggered an Error
      const errorObject = {
        status: 500,
        message: error?.message,
      };

      logger.error(JSON.stringify(errorObject), thisLocation);

      throw new HttpException(errorObject);
    }
  }
};

module.exports = handleRequest;
