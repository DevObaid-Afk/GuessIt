import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const lengthOptions = [
  { value: 3, label: "3 Letters", description: "Fast rounds with tighter margins and sharp pressure." },
  { value: 4, label: "4 Letters", description: "Balanced pace and a strong ladder for quick thinkers." },
  { value: 5, label: "5 Letters", description: "The competitive core with the broadest word bank." },
  { value: 6, label: "6+ Letters", description: "Long-form challenge mode for high-focus players." }
];

const attemptOptions = [3, 4, 5, 6, 7];

function DashboardPage() {
  const [status, setStatus] = useState(null);
  const [selectedLength, setSelectedLength] = useState(5);
  const [selectedAttempts, setSelectedAttempts] = useState(5);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  useEffect(() => {
    async function fetchStatus() {
      try {
        const data = await api.get("/game/status");
        setStatus(data);
        if (data.activeSession) {
          navigate("/gameplay", { replace: true });
        }
      } catch (error) {
        toast.push(error.message, "error");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, [navigate, toast]);

  async function handleStart() {
    setStarting(true);
    try {
      const data = await api.post("/api/game/start", {
        wordLength: selectedLength,
        attemptsAllowed: selectedAttempts
      });
      setUser(data.user);
      toast.push("Daily challenge initialized.", "success");
      navigate("/gameplay");
    } catch (error) {
      toast.push(error.message, "error");
    } finally {
      setStarting(false);
    }
  }

  if (loading) {
    return (
      <div className="center-screen">
        <div className="loader-ring" />
      </div>
    );
  }

  return (
    <PageTransition>
      <section className="dashboard-grid">
        <div className="glass-card">
          <p className="eyebrow">Player Command</p>
          <h1>Welcome back, {user?.username}</h1>
          <div className="stats-strip">
            <div>
              <span>Current Streak</span>
              <strong>{user?.stats?.currentStreak || 0}</strong>
            </div>
            <div>
              <span>Total Wins</span>
              <strong>{user?.stats?.wins || 0}</strong>
            </div>
            <div>
              <span>Games Played</span>
              <strong>{user?.stats?.gamesPlayed || 0}</strong>
            </div>
          </div>
          <div className={`status-banner ${status?.alreadyPlayed ? "status-banner--locked" : ""}`}>
            <strong>{status?.alreadyPlayed ? "Today already completed" : "Today is still available"}</strong>
            <p>
              {status?.alreadyPlayed
                ? "You can review results, track your rank, and come back for the next reset."
                : "Choose a challenge profile and launch your one daily run."}
            </p>
          </div>
        </div>

        <div className="selection-section">
          <div className="section-heading">
            <h2>Select Word Length</h2>
            <p>Difficulty changes with vocabulary size and clue pressure.</p>
          </div>
          <div className="selection-grid">
            {lengthOptions.map((option) => (
              <button
                key={option.value}
                className={`selection-card ${selectedLength === option.value ? "active" : ""}`}
                onClick={() => setSelectedLength(option.value)}
                disabled={status?.alreadyPlayed}
              >
                <strong>{option.label}</strong>
                <p>{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="glass-card">
          <div className="section-heading">
            <h2>Attempt Budget</h2>
            <p>Fewer attempts raise the risk and help leaderboard tiebreakers.</p>
          </div>
          <div className="pill-row">
            {attemptOptions.map((value) => (
              <button
                key={value}
                className={`pill-button ${selectedAttempts === value ? "active" : ""}`}
                onClick={() => setSelectedAttempts(value)}
                disabled={status?.alreadyPlayed}
              >
                {value}
              </button>
            ))}
          </div>
          <button className="button-primary button-block" disabled={status?.alreadyPlayed || starting} onClick={handleStart}>
            {starting ? "Generating Challenge..." : status?.alreadyPlayed ? "Challenge Completed" : "Launch Today’s Challenge"}
          </button>
        </div>
      </section>
    </PageTransition>
  );
}

export default DashboardPage;
