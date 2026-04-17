import GameSession from "../models/GameSession.js";
import { serializeUser } from "./authController.js";

async function getBestRankForUser(userId) {
  const sessions = await GameSession.find({ status: "won" }).populate("user");
  const grouped = new Map();

  sessions.forEach((session) => {
    if (!session.user) {
      return;
    }

    const key = String(session.user._id);
    const current = grouped.get(key) || {
      userId: key,
      wins: 0,
      totalAttempts: 0,
      bestTime: Number.MAX_SAFE_INTEGER,
      currentStreak: session.user.stats.currentStreak
    };

    current.wins += 1;
    current.totalAttempts += session.guesses.length;
    current.bestTime = Math.min(current.bestTime, session.elapsedSeconds);
    grouped.set(key, current);
  });

  const ranked = Array.from(grouped.values())
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

  const index = ranked.findIndex((entry) => entry.userId === String(userId));
  return index >= 0 ? index + 1 : null;
}

function buildBadges(user) {
  const badges = [];

  if (user.stats.wins >= 1) {
    badges.push({ title: "First Light", description: "Logged your first victory." });
  }
  if (user.stats.currentStreak >= 3) {
    badges.push({ title: "Neon Streak", description: "Reached a 3-day active streak." });
  }
  if (user.stats.bestStreak >= 7) {
    badges.push({ title: "Circuit Master", description: "Held a week-long best streak." });
  }
  if (user.stats.bestRank && user.stats.bestRank <= 3) {
    badges.push({ title: "Podium Pulse", description: "Reached the leaderboard top three." });
  }
  if (!badges.length) {
    badges.push({ title: "Warmup Mode", description: "Play your first daily run to unlock achievements." });
  }

  return badges;
}

export async function getProfile(req, res) {
  const history = await GameSession.find({ user: req.user._id }).sort({ challengeDate: -1 }).limit(8);
  const bestRank = await getBestRankForUser(req.user._id);
  const user = serializeUser(req.user);
  user.stats.bestRank = bestRank;

  return res.json({
    user,
    badges: buildBadges(req.user),
    history: history.map((entry) => ({
      id: entry._id,
      dateLabel: new Date(entry.challengeDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      }),
      status: entry.status,
      wordLength: entry.wordLength,
      attemptsUsed: entry.guesses.length,
      elapsedSeconds: entry.elapsedSeconds
    }))
  });
}
