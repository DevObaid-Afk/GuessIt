import GameSession from "../models/GameSession.js";
import { getWordEntry } from "./wordBank.js";

function getChallengeDate(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function getChallengeSeed(date = new Date()) {
  const challengeDate = getChallengeDate(date);
  const epochDay = Math.floor(challengeDate.getTime() / 86400000);
  return {
    challengeDate,
    seedIndex: epochDay
  };
}

export function buildChallenge(wordLength, date = new Date()) {
  const normalizedLength = wordLength >= 6 ? 6 : wordLength;
  const { challengeDate, seedIndex } = getChallengeSeed(date);
  const entry = getWordEntry(normalizedLength, seedIndex);
  const challengeKey = `${challengeDate.toISOString().slice(0, 10)}:${normalizedLength}`;

  return {
    challengeDate,
    challengeKey,
    wordLength: normalizedLength,
    answer: entry.answer,
    category: entry.category,
    clue: entry.clue
  };
}

export async function findTodaysSession(userId) {
  const { challengeDate } = getChallengeSeed(new Date());
  const nextDate = new Date(challengeDate.getTime() + 86400000);

  return GameSession.findOne({
    user: userId,
    challengeDate: {
      $gte: challengeDate,
      $lt: nextDate
    }
  }).sort({ createdAt: -1 });
}

export function buildFeedback(answer, guess) {
  const normalizedAnswer = answer.toUpperCase();
  const normalizedGuess = guess.toUpperCase();
  const answerLetters = normalizedAnswer.split("");
  const guessLetters = normalizedGuess.split("");
  const states = Array(guessLetters.length).fill("absent");
  const remaining = {};

  answerLetters.forEach((letter, index) => {
    if (guessLetters[index] === letter) {
      states[index] = "correct";
    } else {
      remaining[letter] = (remaining[letter] || 0) + 1;
    }
  });

  guessLetters.forEach((letter, index) => {
    if (states[index] === "correct") {
      return;
    }

    if (remaining[letter]) {
      states[index] = "present";
      remaining[letter] -= 1;
    }
  });

  return guessLetters.map((letter, index) => ({
    letter,
    state: states[index]
  }));
}

export function buildHintSet(session) {
  return [
    { key: "category", label: "Category", value: session.category },
    { key: "first-letter", label: "First Letter", value: session.answer[0] },
    { key: "clue", label: "Tiny Clue", value: session.clue }
  ];
}
