
# Habit Hero — Gamified Habit Tracker

Full-stack app using Node.js, Express, MongoDB, EJS, Passport. Track habits, earn XP, badges, and compete on a leaderboard.

## Quick Start

### 1) Prereqs
- Node.js 16+
- Git
- MongoDB Atlas (or local MongoDB)

### 2) Install
```bash
npm install
```

### 3) Configure Environment
Create `.env` from `.env.example` and fill values:
```
PORT=3000
MONGO_URI=YOUR_MONGODB_URI
SESSION_SECRET=supersecret
```

### 4) Run
```bash
npm run dev
# http://localhost:3000
```

### 5) Deploy (Render)
- Create a new **Web Service**
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- Add environment variables from `.env`
- Connect to your GitHub repo

### 6) Scripts
- `npm run dev` — dev server with nodemon
- `npm start` — production

## Tech
- Express, EJS + express-ejs-layouts, Bootstrap
- MongoDB + Mongoose
- Passport (local), Sessions
- Flash messages
