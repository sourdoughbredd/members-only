require("dotenv").config();
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_PRIVATE_KEY = Buffer.from(
  process.env.JWT_PRIVATE_KEY_BASE64,
  "base64"
).toString("ascii");

// SIGN UP

exports.userCreateGet = asyncHandler(async (req, res, next) => {
  res.render("signup", {});
});

exports.userCreatePost = [
  // Validate and sanitize
  body("firstName").trim(),
  body("lastName").trim(),
  body("email", "Invalid email").trim().isEmail(),
  body("password", "Password does not meet requirements")
    .trim()
    .isStrongPassword(),
  body("passwordConfirm", "Passwords do not match")
    .trim()
    .custom((pwdCnf, { req }) => pwdCnf === req.body.password),

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract validation results
    const errors = validationResult(req).array();

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user object
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });

    // Check for validation errors
    if (errors.length > 0) {
      res.render("signup", {
        user,
        errors,
      });
      return;
    }

    // Check that email not already in use
    const existingUser = await User.findOne({ email: req.body.email }).exec();

    if (existingUser) {
      // Create error object that matches express-validator format
      errors.push({
        type: "custom",
        value: req.body.email,
        msg: "An account is already associated with this email",
        path: "email",
        location: "body",
      });
      // Re-render the signup form
      res.render("signup", {
        user,
        errors,
      });
      return;
    }

    // All checks passed, create user
    await user.save();
    res.redirect("/users/login");
  }),
];

// LOG IN

exports.userLoginGet = asyncHandler(async (req, res, next) => {
  res.render("login", {});
});

exports.userLoginPost = [
  // Validate and sanitize
  body("email", "Invalid email").trim().isEmail(),
  body("password", "Password does not meet requirements")
    .trim()
    .isStrongPassword(),

  // Process the request
  asyncHandler(async (req, res, next) => {
    // Extract validaton results
    const errors = validationResult(req).array();

    if (errors.length > 0) {
      res.render("login", {
        email: req.body.email,
        errors,
      });
    }

    // Look up user
    const user = await User.findOne({ email: req.body.email }).exec();

    if (!user) {
      // Create error object that matches express-validator format
      errors.push({
        type: "custom",
        value: req.body.email,
        msg: "There is no account associated with this email",
        path: "email",
        location: "body",
      });

      res.render("login", {
        email: req.body.email,
        errors,
      });
      return;
    }

    // Check password
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      // Create error object that matches express-validator format
      errors.push({
        type: "custom",
        value: req.body.password,
        msg: "Incorrect password",
        path: "password",
        location: "body",
      });

      res.render("login", {
        email: req.body.email,
        errors,
      });
      return;
    }

    // All checks passed! Generate JWT and save to cookies
    const payload = { sub: user.id };
    const token = jwt.sign(payload, JWT_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "1d",
    });
    res.cookie("token", token, {
      httpOnly: true, // The cookie is not accessible via JavaScript (XSS protection)
      secure: process.env.NODE_ENV !== "development", // The cookie is sent over HTTPS only
      sameSite: "strict", // The cookie is not sent with cross-site requests (CSRF protection)
      maxAge: 24 * 60 * 60 * 1000, // Expires in 1 day
    });

    // Redirect to home page
    res.redirect("/");
  }),
];

// LOG OUT
exports.userLogoutGet = asyncHandler((req, res, next) => {
  res.cookie("token", "", { expires: new Date(0) });
  res.redirect("/");
});
