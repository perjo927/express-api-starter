/* eslint-disable camelcase */
const createError = require("http-errors");
const { logger } = require("../../../utils/logger");

const {
  handleResponseExceptions,
} = require("../../../utils/handleResponseExceptions");
const { getUser } = require("../../../middleware/auth");
const { getBodyKeys } = require("../../../utils/getBodyKeys");

const thisLocation = "controllers/authorize";
const BODY_KEY = "id_token";

const handle = (req, res, next) => {
  const bodyKeys = getBodyKeys(req, BODY_KEY);

  if (!bodyKeys) {
    logger.error(
      `No ${BODY_KEY} was provided in body data to route`,
      thisLocation
    );
    next(createError.BadRequest());
    return;
  }

  const { [BODY_KEY]: idToken } = bodyKeys;

  getUser(idToken)
    .then((accessToken) => {
      res.json({
        accessToken,
      });
    })
    .catch((error) => {
      handleResponseExceptions(error, thisLocation, next);
    });
};

module.exports = { handle, BODY_KEY };
