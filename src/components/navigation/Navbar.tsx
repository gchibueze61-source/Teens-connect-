import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";
import NavLinks from "./Navlinks";
import MobileMenu from "./MobileMenu";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleJoinNow = () => {
    setMenuOpen(false);
    navigate("/register");
  };

  const handleLogin = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">

        <Logo />

        <nav className="desktop-nav">
          <NavLinks />
        </nav>

        <div className="navbar-actions">

          <button
            type="button"
            className="login-btn"
            onClick={handleLogin}
          >
            Login
          </button>

          <button
            type="button"
            className="join-btn"
            onClick={handleJoinNow}
          >
            Join Now
          </button>

        </div>

        <button
          type="button"
          className={`hamburger ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

      </div>

      <MobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

    </header>
  );
};

export default Navbar;