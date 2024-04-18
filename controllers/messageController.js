const asyncHandler = require("express-async-handler");

// Create Message
exports.messageCreateGet = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message Create GET");
});

exports.messageCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message Create POST");
});
