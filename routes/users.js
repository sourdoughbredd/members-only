const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

// Sign up routes
router.get("/signup", userController.userCreateGet);
router.post("/signup", userController.userCreatePost);

// Log in routes
router.get("/login", userController.userLoginGet);
router.post("/login", userController.userLoginPost);

// Log out route
router.get("/logout", userController.userLogoutGet);

// Membership Route
router.get("/membership", userController.userMembershipGet);
router.post("/membership", userController.userMembershipPost);

module.exports = router;
