 # Guess It

Guess It is a full-stack daily word challenge platform with:

- React + Vite frontend
- Node.js + Express backend
- MongoDB persistence
- JWT authentication
- Daily challenge tracking
- Hint-limited gameplay
- Daily, weekly, and all-time leaderboards
- Responsive futuristic neon UI

## Project Structure

- `client/` React application
- `server/` Express API and MongoDB models

## Setup

### 1. Server

Copy `server/.env.example` to `server/.env` and fill in:

- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`

Install and run:

```bash
cd server
npm install
npm run dev
```

### 2. Client

Copy `client/.env.example` to `client/.env` if you want to override the default API URL.

Install and run:

```bash
cd client
npm install
npm run dev
```

## Key Features

- One daily run per authenticated player
- Difficulty selection by word length and attempt count
- Minimal hint system
- Stored streaks, wins, history, and profile data
- Anti-replay backend enforcement
- Searchable leaderboard views
- Futuristic animated responsive interface
