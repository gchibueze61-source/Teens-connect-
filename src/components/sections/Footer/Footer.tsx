import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer-container">

        <div className="footer-content">
          <div className="footer-brand">
            <h2>Teens Connect Africa</h2>
            <p>
              Empowering teenagers across Africa through
              connection, learning, mentorship, and opportunities.
            </p>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>

            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#programs">Programs</a>
            <a href="#events">Events</a>
            <a href="#testimonials">Testimonials</a>
            <a href="#contact">Contact</a>
          </div>

          <div className="footer-meeting">
            <h3>Our Meetings</h3>

            <p>Every Third Sunday</p>
            <p>Teens Connect Africa</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} Teens Connect Africa. All rights reserved.
          </p>

          <p>
            Built to empower the next generation.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;