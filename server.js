const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();

const apiHabitRoutes = require("./routes/apiHabits");

const app = express();

// -----------------
// Passport Config
// -----------------
require("./config/passport")(passport);

// -----------------
// MongoDB Connection
// -----------------
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/habit_hero";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));
 mongoose.connection.on("connected", () => {
  console.log("🟢 Connected DB name:", mongoose.connection.name);
});


// -----------------
// View Engine & Layouts
// -----------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);
app.set("layout", "layout");

// -----------------
// Body Parser
// -----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// -----------------
// Static Files
// -----------------
app.use(express.static(path.join(__dirname, "public")));

// -----------------
// Sessions ✅ FIXED
// -----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,   // ✅ USE URI DIRECTLY
      ttl: 14 * 24 * 60 * 60,             // 14 days
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,    // 7 days
      secure: false,
      sameSite: "lax",
    },
  })
);


// -----------------
// Passport Middleware
// -----------------
app.use(passport.initialize());
app.use(passport.session());

// -----------------
// Flash Messages
// -----------------
app.use(flash());

// -----------------
// Global Template Variables
// -----------------
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;

  res.locals.title = "Habit Hero";
  res.locals.habits = [];
  res.locals.logsToday = 0;
  res.locals.dashboardStats = {};

  next();
});

// -----------------
// Routes
// -----------------
app.use("/", require("./routes/index"));
app.use("/", require("./routes/auth"));
app.use("/habits", require("./routes/habits"));
app.use("/leaderboard", require("./routes/leaderboard"));
app.use("/api/habits", apiHabitRoutes);

// -----------------
// Server Start
// -----------------
const PORT = process.env.PORT || 3000;
app.get("/test-db", async (req, res) => {
  try {
    const User = require("./models/User");

    const user = await User.create({
      username: "testuser",
      email: "testuser@example.com",
      password: "test123",
    });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.listen(PORT, () =>
  console.log(`🚀 Server running → http://localhost:${PORT}`)
);
