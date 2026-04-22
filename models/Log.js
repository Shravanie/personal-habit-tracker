
const mongoose = require("mongoose");

const logSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    habit: { type: mongoose.Schema.Types.ObjectId, ref: "Habit", required: true },
    date: { type: String, required: true }, // 'YYYY-MM-DD' in Asia/Kolkata
    completed: { type: Boolean, default: true }
  },
  { timestamps: true }
);

logSchema.index({ user: 1, habit: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Log", logSchema);
