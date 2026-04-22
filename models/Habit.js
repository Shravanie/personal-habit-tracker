const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    archived: { type: Boolean, default: false },

    // ✅ NEW FIELDS
    streakCount: { type: Number, default: 0 },
    lastCompletedDate: { type: Date },

    logs: [
      {
        date: { type: Date, required: true },
        status: {
          type: String,
          enum: ["complete", "skip", "fail"],
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Habit", habitSchema);