
import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const aboutLinks = [
  { name: "Our Story", path: "/about" },
  {
    name: "Board of Directors",
    path: "/board-members",
  },
  {
    name: "Executive Team",
    path: "/team",
  },
  {
    name: "Teen Executive Committee",
    path: "/teen-executive-committee",
  },
];

const navigationLinks = [
  { name: "Our Impact", path: "/impact" },
  { name: "Events", path: "/events" },
  { name: "Blog", path: "/blog" },
  { name: "Get Involved", path: "/volunteer" },
  { name: "Mentor", path: "/mentor" },
  { name: "Contact", path: "/contact" },
];

interface NavLinksProps {
  onNavigate?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ onNavigate }) => {
  const [aboutOpen, setAboutOpen] = useState(false);
  const location = useLocation();

  const isAboutActive = aboutLinks.some(
    (link) =>
      location.pathname === link.path ||
      location.pathname.startsWith(`${link.path}/`)
  );

  const handleNavigation = () => {
    setAboutOpen(false);
    onNavigate?.();
  };

  return (
    <>
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `nav-link ${isActive ? "active" : ""}`
        }
        onClick={handleNavigation}
      >
        Home
      </NavLink>

      <div className={`nav-dropdown ${aboutOpen ? "open" : ""}`}>
        <button
          type="button"
          className={`nav-link nav-dropdown-toggle ${
            isAboutActive ? "active" : ""
          }`}
          aria-expanded={aboutOpen}
          aria-haspopup="true"
          onClick={() => setAboutOpen((previous) => !previous)}
        >
          About <span aria-hidden="true">▾</span>
        </button>

        <div className="nav-dropdown-menu">
          {aboutLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={handleNavigation}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      </div>

      {navigationLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          className={({ isActive }) =>
            `nav-link ${isActive ? "active" : ""}`
          }
          onClick={handleNavigation}
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;
