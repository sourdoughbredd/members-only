const passport = require("passport");

// Load the passport configuration
require("../config/passport");

function authenticateJWT(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (user) {
      req.user = user;
      res.locals.currentUser = user;
    } else {
      res.locals.currentUser = null;
    }

    next();
  })(req, res, next);
}

module.exports = authenticateJWT;
