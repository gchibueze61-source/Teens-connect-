import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

import hero1 from "./bobdaddy 2 1626.jpg";
import hero2 from "./bobdaddy 2 1399.JPG";
import hero3 from "./bobdaddy 2 1363.JPG";
import hero4 from "./bobdaddy 2 1315.JPG";
import hero5 from "./2-4 (1).jpg";

const heroImages = [
  hero1,
  hero2,
  hero3,
  hero4,
  hero5,
];

const Hero = () => {
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);

  const [stats, setStats] = useState({
    members: 0,
    countries: 0,
    projects: 0,
    events: 0,
  });

  /* =========================================
     AUTOMATIC IMAGE ROTATION
  ========================================= */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImage((previous) =>
        (previous + 1) % heroImages.length
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  /* =========================================
     STAT COUNTER ANIMATION
  ========================================= */

  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();

    const animateStats = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easeOut =
        1 - Math.pow(1 - progress, 3);

      setStats({
        members: Math.floor(500 * easeOut),
        countries: Math.floor(1 * easeOut),
        projects: Math.floor(10 * easeOut),
        events: Math.floor(50 * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animateStats);
      }
    };

    const animationFrame =
      requestAnimationFrame(animateStats);

    return () =>
      cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="hero" id="home">

      {/* =====================================
          BACKGROUND SLIDES
      ===================================== */}

      <div
        className="hero-background"
        aria-hidden="true"
      >
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`hero-slide ${
              index === currentImage
                ? "active"
                : ""
            }`}
            style={{
              backgroundImage: `url("${image}")`,
            }}
          />
        ))}
      </div>

      {/* =====================================
          CONTENT
      ===================================== */}

      <div className="hero-overlay">
        <div className="hero-content">

          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            TEENS CONNECT AFRICA
          </div>

          <h1>
            Empowering teenagers to{" "}
            <span>shape Africa's future.</span>
          </h1>

          <p className="hero-description">
            Connecting teenagers with mentorship,
            skills, resources and opportunities to
            grow, discover their potential and make
            meaningful impact.
          </p>

          <div className="hero-buttons">

            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => navigate("/register")}
            >
              Join Our Community
              <span>→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => navigate("/programs")}
            >
              Explore Programs
            </button>

          </div>

          {/* ===================================
              STATS
          =================================== */}

          <div className="hero-stats">

            <div className="hero-stat">
              <strong>{stats.members}+</strong>
              <span>Teen Members</span>
            </div>

            <div className="hero-stat">
              <strong>{stats.countries}</strong>
              <span>African Country</span>
            </div>

            <div className="hero-stat">
              <strong>{stats.projects}+</strong>
              <span>Projects</span>
            </div>

            <div className="hero-stat">
              <strong>{stats.events}+</strong>
              <span>Events Hosted</span>
            </div>

          </div>

        </div>
      </div>

      {/* =====================================
          SLIDE INDICATORS
      ===================================== */}

      <div
        className="hero-indicators"
        aria-label="Hero image navigation"
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-indicator ${
              index === currentImage
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCurrentImage(index)
            }
            aria-label={`Show image ${index + 1}`}
            aria-current={
              index === currentImage
                ? "true"
                : undefined
            }
          />
        ))}
      </div>

      <div className="hero-scroll-hint">
        <span>Scroll to explore</span>
        <span className="hero-scroll-arrow">↓</span>
      </div>

    </section>
  );
};

export default Hero;