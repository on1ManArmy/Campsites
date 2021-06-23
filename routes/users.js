const express = require("express");
const router = express.Router();
const User = require("../models/user");
const users = require("../controllers/users");
const { route } = require("./campgrounds");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

router.get("/register", users.renderRegister);

router.post("/register", catchAsync(users.register));

router.get("/login", users.renderLogin);

// passport authenticate will automatically check for db for username and deserilixed password
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

router.get("/logout", users.logout);

module.exports = router;
