require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const authenticateJWT = require("./middleware/authMiddleware");
const rateLimit = require("express-rate-limit").rateLimit;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const messagesRouter = require("./routes/messages");

const app = express();

// Set up database connection
const db = require("./config/database");
async function dbConnectWrapper() {
  await db.connect();
}
dbConnectWrapper().catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Apply the rate limiting middleware to all requests.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
app.use(limiter);

// Authenticate user (sets res.locals.isAuthenticated)
app.use(authenticateJWT);

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/messages", messagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
