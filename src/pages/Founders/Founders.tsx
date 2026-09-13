import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Founders.css";
import foundersImage from "./bobdaddy 2 1435 (2).jpg";

const Founders = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".founders-page .reveal"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="founders-page">

      <button
        type="button"
        className="return-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* =========================
          PAGE INTRO
      ========================= */}
      <section className="founders-hero">
        <div className="founders-container">

          <p className="founders-eyebrow reveal">
            THE PEOPLE BEHIND TCA
          </p>

          <h1 className="reveal reveal-delay-1">
            Meet Our Founders
          </h1>

          <p className="founders-intro reveal reveal-delay-2">
            Get to know the people whose vision, leadership, and commitment
            continue to shape Teens Connect Africa and its mission to empower
            young people across Africa.
          </p>

          <div className="founders-hero-action reveal reveal-delay-3">
            <Link to="/founder" className="founders-cta-button">
              Get to Know Our Founders
              <span>→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* =========================
          FOUNDERS SECTION
      ========================= */}
      <section className="founders-section">
        <div className="founders-container">

          {/* SHARED IMAGE */}
          <div className="founders-main-image reveal reveal-scale">
            <img
              src={foundersImage}
              alt="Anne Obize and Merit Kamah"
            />
          </div>

          {/* FOUNDERS GRID */}
          <div className="founders-grid">

            {/* ANNE */}
            <article className="founder-card reveal reveal-left">

              <div className="founder-content">

                <span className="founder-role">
                  FOUNDER
                </span>

                <h2>
                  Anne Obize
                </h2>

                <p className="founder-title">
                  Corporate MC • Executive Communication Coach •
                  Personal Development Strategist
                </p>

                <p>
                  Anne Obize, also known as MacAnne, is a professional
                  communicator, corporate event host, executive communication
                  coach, and personal development strategist.
                </p>

                <p>
                  Her professional experience spans public speaking, corporate
                  events, brand consulting, public relations, content
                  strategy, digital marketing, event coordination, marketing
                  consulting, and educational consulting.
                </p>

                <p>
                  Through her work, Anne focuses on helping people discover
                  their voice, communicate effectively, develop confidence,
                  and grow into stronger leaders.
                </p>

                <Link
                  to="/founder"
                  className="primary-btn"
                >
                  View Full Profile
                </Link>

              </div>

            </article>

            {/* MERIT */}
            <article className="founder-card reveal reveal-right">

              <div className="founder-content">

                <span className="founder-role">
                  CO-FOUNDER
                </span>

                <h2>
                  Merit Kamah (Née Olumba)
                </h2>

                <p className="founder-title">
                  Impact Filmmaker • Project Manager • Child Advocate
                </p>

                <p>
                  Merit Kamah is an impact filmmaker and project manager with
                  experience in storytelling, advocacy, project development,
                  and community-focused initiatives.
                </p>

                <p>
                  Her professional journey includes work with Teens Connect
                  Africa, media and production, project management, and
                  initiatives focused on children, women, girls, and social
                  impact.
                </p>

                <Link
                  to="/co-founder"
                  className="primary-btn"
                >
                  View Full Profile
                </Link>

              </div>

            </article>

          </div>

        </div>
      </section>

    </main>
  );
};

export default Founders;