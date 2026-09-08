import "./Founder.css";
import { useNavigate } from "react-router-dom";
import founderImage from "./ChatGPT Image Sep 7, 2026, 05_24_34 PM (1).png";
const Founder = () => {
  const navigate = useNavigate();
  return (
    <main className="founder-page">
<button
        type="button"
        className="return-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>
      {/* =========================
          FOUNDER HERO
      ========================= */}
      <section className="founder-hero">
        <div className="founder-container founder-hero-grid">

          <div className="founder-hero-content">
            <span className="founder-eyebrow">
              FOUNDER • TEENS CONNECT AFRICA
            </span>

            <h1>
              Anne Obize
              <span>MacAnne</span>
            </h1>

            <p className="founder-hero-title">
              Corporate MC • Executive Communication Coach • Personal
              Development Strategist
            </p>

            <p className="founder-hero-text">
              A passionate communicator and personal development strategist
              committed to helping people discover their voice, communicate
              with confidence, and grow into stronger leaders.
            </p>

            <div className="founder-hero-buttons">
              <a
                href="https://www.linkedin.com/in/anne-obize"
                target="_blank"
                rel="noopener noreferrer"
                className="primary-btn"
              >
                Connect on LinkedIn
              </a>

              <a
                href="/founders"
                className="secondary-btn"
              >
                Meet Our Founders
              </a>
            </div>
          </div>

          <div className="founder-hero-image">
           <img
  src={founderImage}
  alt="Anne Obize"
/>

            <div className="founder-image-label">
              <strong>Founder</strong>
              <span>Teens Connect Africa</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          ABOUT
      ========================= */}
      <section className="founder-about">
        <div className="founder-container">

          <div className="founder-section-heading">
            <span>ABOUT HER</span>
            <h2>Meet Anne</h2>
          </div>

          <div className="founder-about-grid">

            <div className="founder-about-text">
              <p>
                Anne Obize, also known as MacAnne, is a professional
                communicator, corporate event host, executive communication
                coach, and personal development strategist.
              </p>

              <p>
                Her professional experience spans public speaking, corporate
                events, brand consulting, public relations, content strategy,
                digital marketing, event coordination, marketing consulting,
                and educational consulting.
              </p>

              <p>
                Through her work, Anne focuses on helping people discover
                their voice, communicate effectively, develop confidence, and
                grow into stronger leaders.
              </p>
            </div>

            <div className="founder-highlight-card">
              <span>HER APPROACH</span>

              <h3>
                Helping people find their voice and turn growth into impact.
              </h3>

              <p>
                Through communication, personal development, leadership, and
                purposeful engagement, Anne helps people build the confidence
                and skills needed to make a meaningful difference.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          PROFESSIONAL JOURNEY
      ========================= */}
      <section className="founder-journey">
        <div className="founder-container">

          <div className="founder-section-heading light">
            <span>PROFESSIONAL JOURNEY</span>
            <h2>Experience & Leadership</h2>
          </div>

          <div className="founder-journey-grid">

            <div className="journey-card">
              <div className="journey-number">01</div>

              <div>
                <h3>Corporate Communication</h3>

                <p>
                  Helping professionals and leaders communicate with greater
                  clarity, confidence, and purpose in professional settings.
                </p>
              </div>
            </div>

            <div className="journey-card">
              <div className="journey-number">02</div>

              <div>
                <h3>Public Speaking</h3>

                <p>
                  Using public speaking and professional communication to help
                  individuals become more confident and effective communicators.
                </p>
              </div>
            </div>

            <div className="journey-card">
              <div className="journey-number">03</div>

              <div>
                <h3>Personal Development</h3>

                <p>
                  Supporting people in discovering their potential, developing
                  confidence, and becoming more intentional about their growth.
                </p>
              </div>
            </div>

            <div className="journey-card">
              <div className="journey-number">04</div>

              <div>
                <h3>Events & Brand Communication</h3>

                <p>
                  Bringing together event hosting, brand communication,
                  content, public relations, and strategic engagement.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          ROLE AT TCA
      ========================= */}
      <section className="founder-role-section">
        <div className="founder-container">

          <div className="founder-role-box">

            <div>
              <span>HER ROLE AT TCA</span>

              <h2>
                Building a platform where young people can discover their
                potential, connect, and grow.
              </h2>
            </div>

            <p>
              As Founder of Teens Connect Africa, Anne contributes to the
              organization's vision of connecting teenagers with mentorship,
              resources, opportunities, and guidance that can help them develop
              their talents and become productive members of society.
            </p>

          </div>
        </div>
      </section>

      {/* =========================
          VISION
      ========================= */}
      <section className="founder-vision">
        <div className="founder-container">

          <div className="vision-content">
            <span>HER VISION</span>

            <h2>
              Empowering young people to discover their voice, develop
              themselves, and create meaningful impact.
            </h2>

            <p>
              Anne's work reflects a strong belief in personal development,
              effective communication, confidence, and purposeful leadership.
              She believes that developing individuals can contribute to
              stronger communities and a better future.
            </p>
          </div>

        </div>
      </section>

      {/* =========================
          MESSAGE
      ========================= */}
      <section className="founder-message">
        <div className="founder-container">

          <div className="message-card">
            <span>A MESSAGE TO YOUNG PEOPLE</span>

            <h2>
              Find your voice. Develop yourself. Make an impact.
            </h2>

            <p>
              Never underestimate the power of developing yourself. Learn to
              communicate your ideas, build your confidence, discover your
              strengths, and remain open to growth. The person you become can
              influence the people and communities around you.
            </p>

            <div className="message-line"></div>

            <strong>
              Anne Obize
            </strong>

            <small>
              Founder, Teens Connect Africa
            </small>
          </div>

        </div>
      </section>

      {/* =========================
          CONNECT
      ========================= */}
      <section className="founder-connect">
        <div className="founder-container">

          <span>CONNECT</span>

          <h2>
            Follow the journey.
          </h2>

          <p>
            Learn more about Anne's professional journey, communication work,
            and personal development initiatives.
          </p>

          <a
            href="https://www.linkedin.com/in/anne-obize"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            Visit LinkedIn
          </a>

        </div>
      </section>

    </main>
  );
};

export default Founder;