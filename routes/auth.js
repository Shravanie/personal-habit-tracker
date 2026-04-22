
const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const { ensureGuest } = require("../middleware/auth");
const User = require("../models/User");

router.get("/login", ensureGuest, (req, res) => {
  res.render("login", { title: "Login" });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log("AUTH RESULT:", { err, user });

    if (err) return next(err);
    if (!user) {
      req.flash("error_msg", "Login failed");
      return res.redirect("/login");
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log("LOGIN SUCCESS, USER ID:", user._id);
      return res.redirect("/dashboard");
    });
  })(req, res, next);
});


router.get("/register", ensureGuest, (req, res) => {
  res.render("register", { title: "Register" });
});

router.post("/register", async (req, res) => {
  try {
    const { username, email, password, password2 } = req.body;
    if (!username || !email || !password || !password2) {
      req.flash("error_msg", "Please fill in all fields");
      return res.redirect("/register");
    }
    if (password !== password2) {
      req.flash("error_msg", "Passwords do not match");
      return res.redirect("/register");
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash("error_msg", "Email already registered");
      return res.redirect("/register");
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({ username, email: email.toLowerCase(), password: hash });
    req.flash("success_msg", "You are now registered and can log in");
    res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error_msg", "Something went wrong");
    res.redirect("/register");
  }
});

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
});

module.exports = router;
