import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear =
    new Date().getFullYear();

  useEffect(() => {
    const elements =
      document.querySelectorAll(
        ".footer .footer-reveal"
      );

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      elements.forEach((element) => {
        element.classList.add(
          "footer-revealed"
        );
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting
            ) {
              entry.target.classList.add(
                "footer-revealed"
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin:
            "0px 0px -40px 0px",
        }
      );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <footer
      className="footer"
      id="footer"
    >
      <div className="footer-container">

        <div className="footer-content">

          <div className="footer-brand footer-reveal footer-delay-1">
            <h2>
              Teens Connect Africa
            </h2>

            <p>
              Empowering teenagers across
              Africa through connection,
              learning, mentorship, and
              opportunities.
            </p>
          </div>


          <div className="footer-links footer-reveal footer-delay-2">
            <h3>
              Quick Links
            </h3>

            <a href="#home">
              Home
            </a>

            <a href="#about">
              About
            </a>

            <a href="#programs">
              Programs
            </a>

            <a href="#events">
              Events
            </a>

            <a href="#testimonials">
              Testimonials
            </a>

            <a href="#contact">
              Contact
            </a>

            <Link to="/donate">
              Donate
            </Link>
          </div>


          <div className="footer-meeting footer-reveal footer-delay-3">
            <h3>
              Our Meetings
            </h3>

            <p>
              Every Third Sunday
            </p>

            <p>
              Teens Connect Africa
            </p>
          </div>

        </div>


        <div className="footer-bottom footer-reveal footer-delay-4">

          <p>
            © {currentYear} Teens Connect Africa.
            All rights reserved.
          </p>

          <p>
            Built to empower the next generation.
          </p>

        </div>


        <p className="footer-courtesy footer-reveal footer-delay-4">
          Courtesy: Obize Gospel
        </p>

      </div>
    </footer>
  );
};

export default Footer;