
// Format date to 'YYYY-MM-DD' in Asia/Kolkata (IST)
function dateStrIST(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(d);
}

function yesterdayStrIST() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dateStrIST(d);
}

function awardBadges(user) {
  const has = (b) => user.badges.includes(b);
  const add = (b) => { if (!has(b)) user.badges.push(b); };

  if (user.xp >= 100 && !has("Bronze (100 XP)")) add("Bronze (100 XP)");
  if (user.xp >= 500 && !has("Silver (500 XP)")) add("Silver (500 XP)");
  if (user.xp >= 1000 && !has("Gold (1000 XP)")) add("Gold (1000 XP)");

  if (user.streak.current >= 7 && !has("7-Day Streak")) add("7-Day Streak");
  if (user.streak.current >= 30 && !has("30-Day Streak")) add("30-Day Streak");
}

async function onFirstHabitCreated(user) {
  if (!user.badges.includes("First Habit Created")) {
    user.badges.push("First Habit Created");
    await user.save();
  }
}

async function onCompletion(user) {
  const todayStr = dateStrIST();
  const yesterdayStr = yesterdayStrIST();

  const last = user.streak.lastCheck
    ? dateStrIST(new Date(user.streak.lastCheck))
    : null;

  if (last === todayStr) {
    // already counted today; do nothing
  } else if (last === yesterdayStr) {
    user.streak.current += 1;
    user.streak.lastCheck = new Date();
  } else {
    user.streak.current = 1;
    user.streak.lastCheck = new Date();
  }

  // XP (10 per day at least once)
  if (last !== todayStr) {
    user.xp += 10;
    if (!user.badges.includes("First Check-In")) {
      user.badges.push("First Check-In");
    }
  }

  awardBadges(user);
  await user.save();
}

module.exports = { dateStrIST, onCompletion, onFirstHabitCreated };
