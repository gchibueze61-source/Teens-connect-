import React from "react";

const navigationLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Events", href: "/events" },
  { name: "Gallery", href: "/gallery" },
  { name: "AI Coach", href: "/ai-coach" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
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