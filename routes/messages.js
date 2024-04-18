const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

// Create message
router.get("/create", messageController.messageCreateGet);
router.post("/create", messageController.messageCreatePost);

module.exports = router;
