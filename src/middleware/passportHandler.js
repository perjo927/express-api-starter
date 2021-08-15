const passport = require("passport");

const handle = () => passport.authenticate("jwt", { session: false });

module.exports = { handle };
