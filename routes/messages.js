const express = require("express");
const router = express.Router();

const messageController = require("../controllers/messageController");

// Display message board
router.get("/", messageController.messageBoardGet);

// Create message
router.get("/create", messageController.messageCreateGet);
router.post("/create", messageController.messageCreatePost);

// Delete message
router.post("/:id/delete", messageController.messageDeletePost);

module.exports = router;
