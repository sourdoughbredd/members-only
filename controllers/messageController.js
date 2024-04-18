const asyncHandler = require("express-async-handler");
const permissions = require("../middleware/permissions");

// Create Message
exports.messageCreateGet = [
  // Check permissions
  permissions.isLoggedIn,
  asyncHandler(async (req, res, next) => {
    res.send("NOT IMPLEMENTED: Message Create GET");
  }),
];

exports.messageCreatePost = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message Create POST");
});
