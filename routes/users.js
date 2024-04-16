const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/sign-up", userController.userCreateGet);

router.post("/sign-up", userController.userCreatePost);

module.exports = router;
