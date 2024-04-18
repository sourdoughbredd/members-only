const rateLimit = require("express-rate-limit").rateLimit;

// Global rate limiter: 100 requests per 15 minutes
exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// Rate limiter for posting messages: 10 posts per minute
exports.postMessageMinuteLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 messages per windowMs
  message: "Too many messages posted, please try again after a minute",
});

// Rate limiter for posting messages: 100 posts per day
exports.postMessageDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 100, // limit each IP to 100 messages per windowMs
  message: "Too many messages posted today, please try again tomorrow",
});

// Rate limiter for craeting users : 5 users per day
exports.createUserDailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 10, // limit each IP to 10 create user requests per windowMs
  message:
    "Too many users created with this IP today, please try again tomorrow",
});
