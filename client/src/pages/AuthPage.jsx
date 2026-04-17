import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

function AuthPage({ mode }) {
  const isSignup = mode === "signup";
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (isSignup) {
        await signup(form);
        toast.push("Account created. Welcome to Guess It.", "success");
      } else {
        await login({ email: form.email, password: form.password });
        toast.push("Login successful. Daily challenge unlocked.", "success");
      }

      navigate(location.state?.from || "/dashboard");
    } catch (error) {
      toast.push(error.message, "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <PageTransition>
      <div className="auth-page">
        <div className="auth-copy">
          <p className="eyebrow">Secure Access</p>
          <h1>{isSignup ? "Create your player identity" : "Return to the arena"}</h1>
          <p>
            Track streaks, leaderboard performance, total wins, and daily history inside a responsive premium dashboard.
          </p>
        </div>

        <form className="glass-card auth-card" onSubmit={handleSubmit}>
          <div className="card-outline" />
          <h2>{isSignup ? "Sign Up" : "Log In"}</h2>
          {isSignup && (
            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={updateField}
                placeholder="NovaPlayer"
                minLength="3"
                required
              />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
          </label>
          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? "Processing..." : isSignup ? "Create Account" : "Enter Game"}
          </button>
          <p className="auth-switch">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link to={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Sign up"}</Link>
          </p>
        </form>
      </div>
    </PageTransition>
  );
}

export default AuthPage;
