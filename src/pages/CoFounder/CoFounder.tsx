import { useNavigate } from "react-router-dom";
import "./CoFounder.css";

const CoFounder = () => {
  const navigate = useNavigate();
  return (
    <main className="cofounder-page">
 <button
        type="button"
        className="return-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* =========================       
          CO-FOUNDER HERO
      ========================= */}
      <section className="cofounder-hero">
        <div className="cofounder-container cofounder-hero-grid">

          <div className="cofounder-hero-content">
            <span className="cofounder-eyebrow">
              CO-FOUNDER • TEENS CONNECT AFRICA
            </span>

            <h1>
              Merit Kamah
              <span>Née Olumba</span>
            </h1>

            <p className="cofounder-hero-title">
              Impact Filmmaker • Project Manager • Child Advocate
            </p>

            <p className="cofounder-hero-text">
              An impact filmmaker, project manager, and advocate passionate
              about storytelling, purposeful projects, social impact, and
              creating meaningful opportunities for young people and
              communities.
            </p>

            <div className="cofounder-hero-buttons">
              <a
                href="https://www.linkedin.com/in/merit-kamah-née-olumba-790660218"
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

          <div className="cofounder-hero-image">
            <img
              src="src/pages/CoFounder/ChatGPT Image Sep 7, 2026, 05_24_52 PM (1).png"
              alt="Merit Kamah"
            />

            <div className="cofounder-image-label">
              <strong>Co-Founder</strong>
              <span>Teens Connect Africa</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================
          ABOUT
      ========================= */}
      <section className="cofounder-about">
        <div className="cofounder-container">

          <div className="cofounder-section-heading">
            <span>ABOUT HER</span>
            <h2>Meet Merit</h2>
          </div>

          <div className="cofounder-about-grid">

            <div className="cofounder-about-text">
              <p>
                Merit Kamah is an impact filmmaker, project manager, and
                advocate with experience in storytelling, project development,
                community-focused initiatives, and social impact work.
              </p>

              <p>
                Her professional journey brings together creativity,
                filmmaking, project management, advocacy, media and production,
                and purposeful initiatives focused on creating meaningful
                outcomes.
              </p>

              <p>
                Merit has also contributed to initiatives focused on children,
                women, girls, and communities, using her skills and experience
                to support projects that promote positive social change.
              </p>
            </div>

            <div className="cofounder-highlight-card">
              <span>HER APPROACH</span>

              <h3>
                Turning storytelling and purposeful projects into meaningful
                impact.
              </h3>

              <p>
                Through creativity, project management, advocacy, and
                collaboration, Merit contributes to initiatives designed to
                create positive change and meaningful opportunities.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          PROFESSIONAL JOURNEY
      ========================= */}
      <section className="cofounder-journey">
        <div className="cofounder-container">

          <div className="cofounder-section-heading light">
            <span>PROFESSIONAL JOURNEY</span>
            <h2>Experience & Leadership</h2>
          </div>

          <div className="cofounder-journey-grid">

            <div className="cofounder-journey-card">
              <div className="cofounder-journey-number">
                01
              </div>

              <div>
                <h3>Impact Filmmaking</h3>

                <p>
                  Using film and storytelling as tools for communication,
                  awareness, advocacy, and social impact.
                </p>
              </div>
            </div>

            <div className="cofounder-journey-card">
              <div className="cofounder-journey-number">
                02
              </div>

              <div>
                <h3>Project Management</h3>

                <p>
                  Supporting the planning, coordination, development, and
                  execution of projects and initiatives designed to create
                  meaningful outcomes.
                </p>
              </div>
            </div>

            <div className="cofounder-journey-card">
              <div className="cofounder-journey-number">
                03
              </div>

              <div>
                <h3>Advocacy & Social Impact</h3>

                <p>
                  Contributing to initiatives that support children, women,
                  girls, young people, and communities through purposeful
                  advocacy and social impact work.
                </p>
              </div>
            </div>

            <div className="cofounder-journey-card">
              <div className="cofounder-journey-number">
                04
              </div>

              <div>
                <h3>Media & Production</h3>

                <p>
                  Bringing together storytelling, media, production, and
                  creative communication to support projects and initiatives
                  with meaningful objectives.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          ROLE AT TCA
      ========================= */}
      <section className="cofounder-role-section">
        <div className="cofounder-container">

          <div className="cofounder-role-box">

            <div>
              <span>HER ROLE AT TCA</span>

              <h2>
                Supporting a platform where young people can connect, learn,
                develop, and grow.
              </h2>
            </div>

            <p>
              As Co-Founder of Teens Connect Africa, Merit contributes to the
              organization's mission of connecting teenagers with mentorship,
              resources, opportunities, and experiences that can help them
              develop their talents and fulfill their potential.
            </p>

          </div>
        </div>
      </section>

      {/* =========================
          VISION
      ========================= */}
      <section className="cofounder-vision">
        <div className="cofounder-container">

          <div className="vision-content">
            <span>HER VISION</span>

            <h2>
              Using creativity, leadership, and opportunity to help shape a
              stronger generation.
            </h2>

            <p>
              Merit believes in creating spaces where young people can access
              the guidance, opportunities, resources, and supportive
              communities they need to develop their potential and contribute
              meaningfully to society.
            </p>
          </div>

        </div>
      </section>

      {/* =========================
          MESSAGE
      ========================= */}
      <section className="cofounder-message">
        <div className="cofounder-container">

          <div className="cofounder-message-card">
            <span>A MESSAGE TO YOUNG PEOPLE</span>

            <h2>
              Your story, your talent, and your ideas can create impact.
            </h2>

            <p>
              Keep learning, keep developing your talents, and remain open to
              opportunities that help you grow. Your creativity, experiences,
              and voice can become powerful tools for creating positive change
              in your community and beyond.
            </p>

            <div className="cofounder-message-line"></div>

            <strong>
              Merit Kamah
            </strong>

            <small>
              Co-Founder, Teens Connect Africa
            </small>
          </div>

        </div>
      </section>

      {/* =========================
          CONNECT
      ========================= */}
      <section className="cofounder-connect">
        <div className="cofounder-container">

          <span>CONNECT</span>

          <h2>
            Follow the journey.
          </h2>

          <p>
            Learn more about Merit's professional journey, filmmaking,
            project work, advocacy, and social impact initiatives.
          </p>

          <a
            href="https://www.linkedin.com/in/merit-kamah-née-olumba-790660218"
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

export default CoFounder;