const asyncHandler = require("express-async-handler");
const permissions = require("../middleware/permissions");
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");

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
