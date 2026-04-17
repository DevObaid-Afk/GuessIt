import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";

const featureCards = [
  {
    title: "Daily Challenge System",
    description: "One synchronized word for everyone each day, backed by anti-replay game tracking."
  },
  {
    title: "Adaptive Difficulty",
    description: "Choose short, sharp rounds or longer high-risk sessions with custom attempt caps."
  },
  {
    title: "Competitive Leaderboards",
    description: "Climb daily, weekly, and all-time boards using speed, efficiency, wins, and streaks."
  },
  {
    title: "Minimal Hint Design",
    description: "Lean hint drops keep the game fair: category, first letter, and a tiny clue."
  }
];

function LandingPage() {
  return (
    <PageTransition>
      <section className="hero">
        <div className="hero__content">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="eyebrow">
            Futuristic Daily Word Arena
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            Daily Word Challenge
          </motion.h1>
          <motion.h2 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.5 }}>
            Choose Your Difficulty. Test Your Mind.
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
            Guess It turns a daily word puzzle into a premium competitive experience with glowing visuals, live feedback,
            profile tracking, streaks, and ranked play.
          </motion.p>
          <div className="hero__actions">
            <Link to="/dashboard" className="button-primary">
              Play Now
            </Link>
            <Link to="/signup" className="button-secondary">
              Sign Up
            </Link>
            <Link to="/leaderboard" className="button-ghost">
              View Leaderboard
            </Link>
          </div>
        </div>
        <div className="hero__visual">
          <div className="hero-panel hero-panel--primary">
            <span>Today&apos;s Pulse</span>
            <strong>5-Letter Daily Core</strong>
            <p>Minimal hints. Shared challenge. Dynamic ranking.</p>
          </div>
          <div className="hero-panel hero-panel--secondary">
            <span>Ranked Queue</span>
            <strong>Speed + Accuracy</strong>
          </div>
          <div className="hero-panel hero-panel--grid">
            {["G", "U", "E", "S", "S"].map((letter) => (
              <div key={letter} className="slot slot--hero">
                {letter}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="info-grid" id="how-it-works">
        {featureCards.map((card, index) => (
          <motion.article
            key={card.title}
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08 }}
          >
            <div className="card-badge">0{index + 1}</div>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
          </motion.article>
        ))}
      </section>

      <section className="split-section" id="daily-system">
        <div className="section-copy">
          <p className="eyebrow">How It Works</p>
          <h3>Every day resets the board with a fresh synchronized challenge.</h3>
          <p>
            Players log in, select a word length and attempt count, then launch one premium round for the day. Guess
            validation, hint usage, timing, and leaderboard metrics are stored automatically.
          </p>
        </div>
        <div className="glass-card timeline-card">
          <div>
            <strong>1. Pick a length</strong>
            <p>Short words are faster. Long words are riskier and more rewarding.</p>
          </div>
          <div>
            <strong>2. Set your attempts</strong>
            <p>Lean attempt counts create stronger leaderboard scores when you pull it off.</p>
          </div>
          <div>
            <strong>3. Submit guesses</strong>
            <p>Get instant feedback, use hints carefully, and finish before the field does.</p>
          </div>
        </div>
      </section>

      <section className="split-section reverse" id="competition">
        <div className="glass-card leaderboard-preview">
          <div className="leader-row leader-row--gold">
            <span>#1 NovaLex</span>
            <span>2 tries</span>
          </div>
          <div className="leader-row leader-row--silver">
            <span>#2 PulseByte</span>
            <span>31 sec</span>
          </div>
          <div className="leader-row leader-row--bronze">
            <span>#3 CipherZen</span>
            <span>11 streak</span>
          </div>
        </div>
        <div className="section-copy">
          <p className="eyebrow">Competition Layer</p>
          <h3>Leaderboard pressure keeps the daily ritual alive.</h3>
          <p>
            Ranked boards factor in attempts used, fastest completion time, total wins, and streak momentum. Top players
            get highlighted with premium neon callouts.
          </p>
        </div>
      </section>
    </PageTransition>
  );
}

export default LandingPage;
