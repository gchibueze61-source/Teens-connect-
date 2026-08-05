import React, { useState } from "react";
import "./Navbar.css";
import Logo from "./Logo";
import NavLinks from "./NavLinks";
import MobileMenu from "./MobileMenu";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Logo />

        <nav className="desktop-nav">
          <NavLinks />
        </nav>

        <div className="navbar-actions">
          <button className="login-btn">
            Login
          </button>

          <button className="join-btn">
            Join Now
          </button>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Navigation"
        >
          ☰
        </button>
      </div>

      <MobileMenu isOpen={menuOpen} />
    </header>
  );
};

export default Navbar;