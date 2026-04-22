
const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const User = require("../models/User");

router.get("/", ensureAuth, async (req, res) => {
  const top = await User.find({}, { username: 1, xp: 1, "streak.current": 1 })
    .sort({ xp: -1 })
    .limit(10)
    .lean();
  res.render("leaderboard", { title: "Leaderboard", top });
});

module.exports = router;
