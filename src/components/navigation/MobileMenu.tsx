import React from "react";
import NavLinks from "./Navlinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onJoin: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  onLogin,
  onJoin,
}) => {
  return (
    <div
      className={`mobile-menu ${
        isOpen ? "open" : ""
      }`}
      aria-hidden={!isOpen}
    >
      <div className="mobile-menu-inner">

        <nav
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          <NavLinks onNavigate={onClose} />
        </nav>

        <div className="mobile-actions">

          <button
            type="button"
            className="mobile-login-btn"
            onClick={onLogin}
          >
            Login
          </button>

          <button
            type="button"
            className="mobile-join-btn"
            onClick={onJoin}
          >
            Join Community
          </button>

        </div>

      </div>
    </div>
  );
};

export default MobileMenu;