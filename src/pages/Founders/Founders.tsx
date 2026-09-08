import { Link, useNavigate } from "react-router-dom";
import "./Founders.css";

const Founders = () => {
  const navigate = useNavigate();

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

          <p className="founders-eyebrow">
            THE PEOPLE BEHIND TCA
          </p>

          <h1>
            Meet Our Founders
          </h1>

          <p className="founders-intro">
            Get to know the people whose vision, leadership, and commitment
            continue to shape Teens Connect Africa and its mission to empower
            young people across Africa.
          </p>

        </div>
      </section>

      {/* =========================
          FOUNDERS SECTION
      ========================= */}
      <section className="founders-section">
        <div className="founders-container">

          {/* =========================
              SHARED FOUNDERS IMAGE
          ========================= */}
          <div className="founders-main-image">

            <img
              src="src/pages/Founders/bobdaddy 2 1435 (2).jpg"
              alt="Anne Obize and Merit Kamah"
            />

          </div>

          {/* =========================
              FOUNDERS GRID
          ========================= */}
          <div className="founders-grid">

            {/* =========================
                ANNE OBIZE
            ========================= */}
            <article className="founder-card">

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

            {/* =========================
                MERIT KAMAH
            ========================= */}
            <article className="founder-card">

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