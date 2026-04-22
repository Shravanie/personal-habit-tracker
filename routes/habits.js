router.post("/:id/complete", ensureAuth, async (req, res) => {
  try {
    console.log("COMPLETE HIT");

    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });

    if (!habit) {
      req.flash("error_msg", "Habit not found");
      return res.redirect("/dashboard");
    }

    const today = dateStrIST();

    // Check if already completed today
    const existing = await Log.findOne({
      user: req.user._id,
      habit: habit._id,
      date: today,
    });

    if (existing) {
      req.flash("error_msg", "Already marked as done today");
      return res.redirect("/dashboard");
    }

    // Create log
    await Log.create({
      user: req.user._id,
      habit: habit._id,
      date: today,
      completed: true,
    });

    // 🔥 SIMPLE STREAK LOGIC
    habit.streak = (habit.streak || 0) + 1;

    await habit.save();

    const me = await User.findById(req.user._id);
    await onCompletion(me);

    req.flash("success_msg", `Checked in "${habit.name}" for today! +10 XP`);
    res.redirect("/dashboard");

  } catch (e) {
    console.error(e);
    req.flash("error_msg", "Could not complete habit");
    res.redirect("/dashboard");
  }
});