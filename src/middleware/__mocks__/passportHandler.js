const passport = {
  authenticate: () => (req, res, next) => {
    next();
  },
};

const handle = () => passport.authenticate();

module.exports = { handle };
