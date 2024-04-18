const asyncHandler = require("express-async-handler");
const permissions = require("../middleware/permissions");
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");
const User = require("../models/user");

// Display Message Board
exports.messageBoardGet = asyncHandler(async (req, res, next) => {
  // Get messages
  const messages = await Message.find({})
    .sort({ timestamp: -1 })
    .populate("user")
    .exec();
  res.render("message-board", { messages });
});

// Create Message
exports.messageCreateGet = [
  permissions.isLoggedIn,
  asyncHandler(async (req, res, next) => {
    res.render("message-form", {});
  }),
];

exports.messageCreatePost = [
  permissions.isLoggedIn,
  body("title", "Title is required").trim().notEmpty(),
  body("text", "Message is required").trim().notEmpty(),
  asyncHandler(async (req, res, next) => {
    // Extract validation results
    const errors = validationResult(req).array();

    const message = new Message({
      user: req.user,
      title: req.body.title,
      text: req.body.text,
    });

    if (errors.length > 0) {
      res.render("message-form", { message, errors });
      return;
    }

    // Post the message
    await message.save();
    res.redirect("/");
  }),
];

// Delete message
exports.messageDeletePost = [
  permissions.isAdmin,
  asyncHandler(async (req, res, next) => {
    await Message.findByIdAndDelete(req.params.id);
    res.redirect("/");
  }),
];
