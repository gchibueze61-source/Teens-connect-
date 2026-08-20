import React from "react";
import { useNavigate } from "react-router-dom";
import NavLinks from "./Navlinks";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    onClose();
    navigate("/register");
  };

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <div className={`mobile-menu ${isOpen ? "open" : ""}`}>

      <NavLinks />

      <div className="mobile-actions">

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

    </div>
  );
};

export default MobileMenu;