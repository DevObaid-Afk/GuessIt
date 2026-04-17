import GameSession from "../models/GameSession.js";
import { serializeUser } from "./authController.js";
import { buildChallenge, buildFeedback, buildHintSet, findTodaysSession } from "../services/dailyChallengeService.js";
import { isValidGuess } from "../services/wordBank.js";

function formatSession(session) {
  return {
    _id: session._id,
    wordLength: session.wordLength,
    attemptsAllowed: session.attemptsAllowed,
    guesses: session.guesses,
    hintsUsed: session.hintsUsed,
    status: session.status,
    answer: session.answer,
    elapsedSeconds: session.elapsedSeconds,
    challengeDateLabel: new Date(session.challengeDate).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric"
    })
  };
}

async function applyResultStats(user, session) {
  user.stats.gamesPlayed += 1;

  if (session.status === "won") {
    user.stats.wins += 1;
    user.stats.currentStreak += 1;
    user.stats.bestStreak = Math.max(user.stats.bestStreak, user.stats.currentStreak);
  } else {
    user.stats.currentStreak = 0;
  }

  await user.save();
}

export async function getStatus(req, res) {
  const session = await findTodaysSession(req.user._id);

  return res.json({
    alreadyPlayed: !!session && session.status !== "active",
    activeSession: session?.status === "active" ? formatSession(session) : null
  });
}

export async function startGame(req, res) {
  const { wordLength, attemptsAllowed } = req.body;

  if (![3, 4, 5, 6].includes(Number(wordLength))) {
    return res.status(400).json({ message: "Select a valid word length." });
  }

  if (![3, 4, 5, 6, 7].includes(Number(attemptsAllowed))) {
    return res.status(400).json({ message: "Select a valid attempt count." });
  }

  const existing = await findTodaysSession(req.user._id);
  if (existing?.status === "active") {
    return res.status(200).json({
      session: formatSession(existing),
      user: serializeUser(req.user)
    });
  }

  if (existing && existing.status !== "active") {
    return res.status(409).json({ message: "You have already played today’s challenge." });
  }

  const challenge = buildChallenge(Number(wordLength));
  const session = await GameSession.create({
    user: req.user._id,
    challengeKey: challenge.challengeKey,
    challengeDate: challenge.challengeDate,
    wordLength: challenge.wordLength,
    answer: challenge.answer,
    category: challenge.category,
    clue: challenge.clue,
    attemptsAllowed: Number(attemptsAllowed)
  });

  return res.status(201).json({
    session: formatSession(session),
    user: serializeUser(req.user)
  });
}

export async function getActiveSession(req, res) {
  const session = await findTodaysSession(req.user._id);

  if (!session) {
    return res.status(404).json({ message: "No session found for today." });
  }

  return res.json({ session: formatSession(session) });
}

export async function submitGuess(req, res) {
  const { sessionId, guess } = req.body;
  const session = await GameSession.findOne({ _id: sessionId, user: req.user._id });

  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  if (session.status !== "active") {
    return res.status(400).json({ message: "This challenge is already complete." });
  }

  const normalizedGuess = String(guess || "").trim().toUpperCase();

  if (normalizedGuess.length !== session.wordLength) {
    return res.status(400).json({ message: `Guess must be ${session.wordLength} letters long.` });
  }

  if (!/^[A-Z]+$/.test(normalizedGuess)) {
    return res.status(400).json({ message: "Only alphabetic guesses are allowed." });
  }

  if (!isValidGuess(session.wordLength, normalizedGuess)) {
    return res.status(400).json({ message: "That word is not in today’s accepted guess pool." });
  }

  const feedback = buildFeedback(session.answer, normalizedGuess);
  session.guesses.push({
    guess: normalizedGuess,
    feedback
  });

  if (normalizedGuess === session.answer) {
    session.status = "won";
    session.completedAt = new Date();
    session.elapsedSeconds = Math.max(1, Math.round((session.completedAt - session.startedAt) / 1000));
    await session.save();
    await applyResultStats(req.user, session);
  } else if (session.guesses.length >= session.attemptsAllowed) {
    session.status = "lost";
    session.completedAt = new Date();
    session.elapsedSeconds = Math.max(1, Math.round((session.completedAt - session.startedAt) / 1000));
    await session.save();
    await applyResultStats(req.user, session);
  } else {
    await session.save();
  }

  return res.json({ session: formatSession(session) });
}

export async function useHint(req, res) {
  const { sessionId } = req.body;
  const session = await GameSession.findOne({ _id: sessionId, user: req.user._id });

  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  if (session.status !== "active") {
    return res.status(400).json({ message: "Hints are only available during active games." });
  }

  const hints = buildHintSet(session);
  if (session.hintsUsed.length >= 2) {
    return res.status(400).json({ message: "You have already used the maximum hints." });
  }

  const nextHint = hints[session.hintsUsed.length];
  session.hintsUsed.push(nextHint);
  await session.save();

  return res.json({
    latestHint: nextHint,
    session: formatSession(session)
  });
}
