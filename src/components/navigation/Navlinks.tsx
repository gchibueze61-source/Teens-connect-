import React from "react";

const navigationLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Programs", href: "#programs" },
  { name: "Events", href: "#events" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "AI Coach", href: "#ai-coach" },
  { name: "Contact", href: "#footer" }
];

const NavLinks: React.FC = () => {
  return (
    <>
      {navigationLinks.map((link) => (
        <a key={link.name} href={link.href} className="nav-link">
          {link.name}
        </a>
      ))}
    </>
  );
};

export default NavLinks;