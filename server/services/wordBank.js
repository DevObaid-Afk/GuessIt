export const WORD_BANK = {
  3: [
    { answer: "ION", category: "Science", clue: "Charged particle in chemistry." },
    { answer: "ARC", category: "Geometry", clue: "A curved path or segment." },
    { answer: "WEB", category: "Technology", clue: "Where browsers spend their time." },
    { answer: "SKY", category: "Nature", clue: "Blue by day, star-filled by night." }
  ],
  4: [
    { answer: "NOVA", category: "Space", clue: "A suddenly bright stellar event." },
    { answer: "BYTE", category: "Computing", clue: "Eight bits travel together here." },
    { answer: "ECHO", category: "Sound", clue: "A reflected voice." },
    { answer: "WAVE", category: "Physics", clue: "Carries energy through motion." }
  ],
  5: [
    { answer: "GLINT", category: "Light", clue: "A small quick flash." },
    { answer: "CRYPT", category: "Security", clue: "Hidden or encrypted in spirit." },
    { answer: "PULSE", category: "Signal", clue: "Rhythmic burst of energy." },
    { answer: "AURIC", category: "Color", clue: "Relating to gold." }
  ],
  6: [
    { answer: "NEBULA", category: "Space", clue: "A glowing cosmic cloud." },
    { answer: "QUARTZ", category: "Mineral", clue: "Crystal often used in watches." },
    { answer: "CIPHER", category: "Security", clue: "Code-shifting secrecy tool." },
    { answer: "VECTOR", category: "Math", clue: "Direction and magnitude combined." }
  ]
};

export function getWordEntry(wordLength, seedIndex) {
  const normalizedLength = wordLength >= 6 ? 6 : wordLength;
  const pool = WORD_BANK[normalizedLength];
  return pool[seedIndex % pool.length];
}

const EXTRA_GUESSES = {
  3: ["ORB", "CPU", "KEY", "MAP", "SUN", "ICE"],
  4: ["GRID", "LENS", "MINT", "GLOW", "RIFT", "SYNC"],
  5: ["LASER", "LOGIC", "PIXEL", "SPARK", "FLASH", "FRAME"],
  6: ["SIGNAL", "PHOTON", "MATRIX", "KERNEL", "ENGINE", "MODULE"]
};

export function isValidGuess(wordLength, guess) {
  const normalizedLength = wordLength >= 6 ? 6 : wordLength;
  const pool = WORD_BANK[normalizedLength].map((entry) => entry.answer);
  const extras = EXTRA_GUESSES[normalizedLength];
  const candidate = guess.toUpperCase();
  return [...pool, ...extras].includes(candidate);
}
