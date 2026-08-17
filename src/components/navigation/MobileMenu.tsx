import React from "react";
import NavLinks from "./Navlinks";

interface MobileMenuProps {
  isOpen: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen }) => {
  return (
    <div className={`mobile-menu ${isOpen ? "open" : ""}`}>
      <NavLinks />

      <div className="mobile-actions">
        <button className="login-btn">Login</button>
        <button className="join-btn">Join Now</button>
      </div>
    </div>
  );
};

export default MobileMenu;