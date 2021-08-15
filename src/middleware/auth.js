const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { verifyIdToken } = require("../data/admin");
const logger = require("../utils/logger");
const { generateAccessToken, getSecret } = require("../utils/token");

const thisLocation = "middleware/auth";

const getUser = (idToken) =>
  new Promise((resolve, reject) => {
    verifyIdToken(idToken)
      .then((decodedToken) => {
        const { uid: sub, name } = decodedToken;

        const accessToken = generateAccessToken({ sub, name });

        if (!accessToken) {
          const error = "No access token could be generated";
          logger.error(error, thisLocation);
          reject(error);
        }

        resolve(accessToken);
      })
      .catch((error) => {
        logger.error("Could not verify ID token", thisLocation);
        reject(error);
      });
  });

const init = () => {
  const secretOrKey = getSecret();

  if (!secretOrKey) {
    return;
  }

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey,
  };

  passport.use(
    new JwtStrategy(options, (jwtPayload, done) => {
      const { sub: uid, name } = jwtPayload;

      const isInvalid = !uid || !name;

      if (isInvalid) {
        const error = "JWT token could not be verified";
        logger.error(error, thisLocation);
        return done(error, false);
      }

      return done(null, jwtPayload);
    })
  );
};

module.exports = { init, getUser };
