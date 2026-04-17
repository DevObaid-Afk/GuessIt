import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    letter: String,
    state: {
      type: String,
      enum: ["correct", "present", "absent"]
    }
  },
  { _id: false }
);

const guessSchema = new mongoose.Schema(
  {
    guess: String,
    feedback: [feedbackSchema]
  },
  { _id: false }
);

const hintSchema = new mongoose.Schema(
  {
    key: String,
    label: String,
    value: String
  },
  { _id: false }
);

const gameSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    challengeKey: {
      type: String,
      required: true
    },
    challengeDate: {
      type: Date,
      required: true
    },
    wordLength: {
      type: Number,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    clue: {
      type: String,
      required: true
    },
    attemptsAllowed: {
      type: Number,
      required: true
    },
    guesses: {
      type: [guessSchema],
      default: []
    },
    hintsUsed: {
      type: [hintSchema],
      default: []
    },
    status: {
      type: String,
      enum: ["active", "won", "lost"],
      default: "active"
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    completedAt: Date,
    elapsedSeconds: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

gameSessionSchema.index({ user: 1, challengeKey: 1 }, { unique: true });

export default mongoose.model("GameSession", gameSessionSchema);
