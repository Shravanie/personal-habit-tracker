const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Habit = require("../models/Habit");

// GET all habits (REST API)
router.get("/", ensureAuth, async (req, res) => {
  try {
    const habits = await Habit.find({
      user: req.user._id,
      archived: false,
    });

    res.status(200).json({
      success: true,
      count: habits.length,
      data: habits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch habits",
    });
  }
});

module.exports = router;
