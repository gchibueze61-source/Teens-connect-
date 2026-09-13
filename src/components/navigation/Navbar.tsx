import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo";
import NavLinks from "./Navlinks";
import MobileMenu from "./MobileMenu";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleJoinNow = () => {
    closeMenu();
    navigate("/register");
  };

  const handleLogin = () => {
    closeMenu();
    navigate("/login");
  };

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`navbar ${
        menuOpen ? "menu-open" : ""
      }`}
    >
      <div className="navbar-container">

        <Logo />

        <nav
          className="desktop-nav"
          aria-label="Main navigation"
        >
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
            Join Community
          </button>

        </div>

        <button
          type="button"
          className={`hamburger ${
            menuOpen ? "active" : ""
          }`}
          onClick={() =>
            setMenuOpen((previous) => !previous)
          }
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

      </div>

      <MobileMenu
        isOpen={menuOpen}
        onClose={closeMenu}
        onLogin={handleLogin}
        onJoin={handleJoinNow}
      />

    </header>
  );
};

export default Navbar;