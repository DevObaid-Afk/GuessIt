import GameSession from "../models/GameSession.js";

function getRangeFilter(range) {
  const now = new Date();
  let startDate;

  if (range === "daily") {
    startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  } else if (range === "weekly") {
    startDate = new Date(now);
    startDate.setUTCDate(now.getUTCDate() - 7);
  }

  return startDate ? { completedAt: { $gte: startDate } } : {};
}

export async function getLeaderboard(req, res) {
  const range = req.query.range || "daily";
  const match = {
    status: "won",
    ...getRangeFilter(range)
  };

  const sessions = await GameSession.find(match).populate("user");
  const grouped = new Map();

  sessions.forEach((session) => {
    if (!session.user) {
      return;
    }

    const key = String(session.user._id);
    const existing = grouped.get(key) || {
      userId: key,
      username: session.user.username,
      wins: 0,
      totalAttempts: 0,
      bestTime: Number.MAX_SAFE_INTEGER,
      currentStreak: session.user.stats.currentStreak
    };

    existing.wins += 1;
    existing.totalAttempts += session.guesses.length;
    existing.bestTime = Math.min(existing.bestTime, session.elapsedSeconds);
    grouped.set(key, existing);
  });

  const entries = Array.from(grouped.values())
    .map((entry) => ({
      ...entry,
      avgAttempts: entry.wins ? entry.totalAttempts / entry.wins : 0
    }))
    .sort((a, b) => {
      if (a.avgAttempts !== b.avgAttempts) {
        return a.avgAttempts - b.avgAttempts;
      }
      if (a.bestTime !== b.bestTime) {
        return a.bestTime - b.bestTime;
      }
      if (a.wins !== b.wins) {
        return b.wins - a.wins;
      }
      return b.currentStreak - a.currentStreak;
    });

  return res.json({ entries });
}
