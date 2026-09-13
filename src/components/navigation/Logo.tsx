import React from "react";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
  return (
    <Link
      to="/"
      className="logo"
      aria-label="Teens Connect Africa home"
    >
      <img
        src="/logo/bobdaddy 2 1580.jpg"
        alt="Teens Connect Africa"
        className="logo-image"
      />

      <span className="logo-text">
        Teens Connect Africa
      </span>
    </Link>
  );
};

export default Logo;