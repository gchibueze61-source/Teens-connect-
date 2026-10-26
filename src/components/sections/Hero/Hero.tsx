
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Hero.css";

import hero1 from "./bobdaddy 2 1626.jpg";
import hero2 from "./bobdaddy 2 1399.JPG";
import hero3 from "./bobdaddy 2 1363.JPG";
import hero4 from "./bobdaddy 2 1315.JPG";
import hero5 from "./2-4 (1).jpg";

const heroImages = [hero1, hero2, hero3, hero4, hero5];

const Hero = () => {
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);

  const [targets, setTargets] = useState({
    teensReached: 2750, reachedOnline: 3500, yearsOfImpact: 5, citiesActive: 2,
  });
  const [stats, setStats] = useState({
    teensReached: 0, reachedOnline: 0, yearsOfImpact: 0, citiesActive: 0,
  });

  useEffect(() => {
    let active = true;
    async function loadImpactStats() {
      const { data, error } = await supabase
        .from("impact_statistics")
        .select("statistic_key, value")
        .eq("is_published", true)
        .eq("show_on_homepage", true);
      if (error || !data || !active) return;
      const values = Object.fromEntries(data.map((item) => [item.statistic_key, Number(item.value)]));
      setTargets((current) => ({
        teensReached: values.teens_reached ?? current.teensReached,
        reachedOnline: values.online_reach ?? current.reachedOnline,
        yearsOfImpact: values.years_of_impact ?? current.yearsOfImpact,
        citiesActive: values.cities_active ?? current.citiesActive,
      }));
    }
    void loadImpactStats();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentImage(
        (previous) => (previous + 1) % heroImages.length
      );
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();
    let animationFrame = 0;

    const animateStats = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const easeOut = 1 - Math.pow(1 - progress, 3);

      setStats({
        teensReached: Math.floor(targets.teensReached * easeOut),
        reachedOnline: Math.floor(targets.reachedOnline * easeOut),
        yearsOfImpact: Math.floor(targets.yearsOfImpact * easeOut),
        citiesActive: Math.floor(targets.citiesActive * easeOut),
      });

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animateStats);
      }
    };

    animationFrame = requestAnimationFrame(animateStats);

    return () => cancelAnimationFrame(animationFrame);
  }, [targets]);

  return (
    <section className="hero" id="home">
      <div className="hero-background" aria-hidden="true">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`hero-slide ${
              index === currentImage ? "active" : ""
            }`}
            style={{ backgroundImage: `url("${image}")` }}
          />
        ))}
      </div>

      <div className="hero-overlay">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-dot" />
            TEENS CONNECT AFRICA
          </div>

          <h1>Unleashing the Genius in Teens</h1>

          <p className="hero-description">
            Teens Connect Africa connects young people in underserved
            communities across Africa to mentorship, life skills, and
            life changing opportunities, because every teenager deserves
            a chance to discover their purpose and reach their full
            potential.
          </p>

          <div className="hero-buttons">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => navigate("/register")}
            >
              Join us
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => navigate("/volunteer")}
            >
              Get Involved
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{stats.teensReached.toLocaleString()}+</strong>
              <span>Teens Reached Directly</span>
            </div>

            <div className="hero-stat">
              <strong>{stats.reachedOnline.toLocaleString()}+</strong>
              <span>Reached Online</span>
            </div>

            <div className="hero-stat">
              <strong>{stats.yearsOfImpact}+</strong>
              <span>Years of Impact</span>
            </div>

            <div className="hero-stat">
              <strong>{stats.citiesActive}</strong>
              <span>Cities Active</span>
            </div>
          </div>
        </div>
      </div>

      <div
        className="hero-indicators"
        aria-label="Hero image navigation"
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`hero-indicator ${
              index === currentImage ? "active" : ""
            }`}
            onClick={() => setCurrentImage(index)}
            aria-label={`Show image ${index + 1}`}
            aria-current={
              index === currentImage ? "true" : undefined
            }
          />
        ))}
      </div>

      <div className="hero-scroll-hint">
        <span>Scroll to explore</span>
        <span className="hero-scroll-arrow" aria-hidden="true">
          ↓
        </span>
      </div>
    </section>
  );
};

export default Hero;
