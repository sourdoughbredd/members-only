exports.isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.send(401, "You must be logged in to view this page");
  }
};

exports.isMember = (req, res, next) => {
  if (req.user && req.user.isMember) {
    next();
  } else {
    res.send(401, "You must be a member to view this page");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.send(401, "You must be an admin to access this resource.");
  }
};
