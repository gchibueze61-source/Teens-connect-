import React from "react";
import { NavLink } from "react-router-dom";

const navigationLinks = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "About",
    path: "/about",
  },
  {
    name: "Programs",
    path: "/programs",
  },
  {
    name: "Events",
    path: "/events",
  },
  {
    name: "Gallery",
    path: "/gallery",
  },
  {
    name: "Blog",
    path: "/blog",
  },
  {
    name: "Get Involved",
    path: "/volunteer",
  },
  {
    name: "Contact",
    path: "/contact",
  },
];

interface NavLinksProps {
  onNavigate?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({
  onNavigate,
}) => {
  return (
    <>
      {navigationLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          end={link.path === "/"}
          className={({ isActive }) =>
            `nav-link ${
              isActive ? "active" : ""
            }`
          }
          onClick={onNavigate}
        >
          {link.name}
        </NavLink>
      ))}
    </>
  );
};

export default NavLinks;