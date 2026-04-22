const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const User = require("../models/User");
const Habit = require("../models/Habit");
const Log = require("../models/Log");
const { dateStrIST } = require("../utils/gamify");

// 🔥 CHANGE HERE: redirect home to login
router.get("/", (req, res) => {
  res.redirect("/login");
});

router.get("/dashboard", ensureAuth, async (req, res) => {
  const userId = req.user._id;
  const today = dateStrIST();

  const habits = await Habit.find({ user: userId, archived: false }).lean();
  const logsToday = await Log.find({ user: userId, date: today }).lean();
  const doneIds = new Set(logsToday.map((l) => String(l.habit)));

  // 🔥 Chart data
  const last7Days = [];
  const completionCounts = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const next = new Date(d);
    next.setDate(d.getDate() + 1);

    const count = await Log.countDocuments({
      user: userId,
      completed: true,
      date: { $gte: d, $lt: next }
    });

    last7Days.push(
      d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    );
    completionCounts.push(count);
  }

  res.render("dashboard", {
    title: "Dashboard",
    habits,
    doneIds,
    me: await User.findById(userId).lean(),
    last7Days,
    completionCounts
  });
});

router.get("/profile", ensureAuth, async (req, res) => {
  const me = await User.findById(req.user._id).lean();
  res.render("profile", { title: "Profile", me });
});

module.exports = router;