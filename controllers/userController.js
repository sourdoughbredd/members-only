const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.userCreateGet = asyncHandler(async (req, res, next) => {
  res.render("signup", { title: "Sign Up" });
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
        title: "Sign Up",
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
        title: "Sign Up",
        user,
        errors,
      });
      return;
    }

    // All checks passed, create user
    await user.save();
    res.redirect("/");
  }),
];
