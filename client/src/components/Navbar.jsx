import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { sound } from "../utils/sound";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleSoundToggle() {
    const next = sound.toggle();
    setSoundEnabled(next);
    sound.click();
  }

  function handleLogout() {
    logout();
    navigate("/");
  }

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="navbar">
      <Link to="/" className="brand" onClick={closeMenu}>
        <span className="brand__glow">Guess</span> It
      </Link>

      <button className="menu-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
        <span />
        <span />
        <span />
      </button>

      <nav className={`nav-links ${open ? "nav-links--open" : ""}`}>
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/leaderboard" onClick={closeMenu}>
          Leaderboard
        </NavLink>
        {user ? (
          <>
            <NavLink to="/dashboard" onClick={closeMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/profile" onClick={closeMenu}>
              Profile
            </NavLink>
            <button className="nav-ghost" onClick={handleLogout}>
              Log Out
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={closeMenu}>
              Log In
            </NavLink>
            <NavLink to="/signup" className="button-link" onClick={closeMenu}>
              Sign Up
            </NavLink>
          </>
        )}
        <button className={`sound-toggle ${soundEnabled ? "active" : ""}`} onClick={handleSoundToggle}>
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
