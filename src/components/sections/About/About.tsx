import { useNavigate } from "react-router-dom";
import "./About.css";

const About = () => {
  const navigate = useNavigate();

  return (
    <section className="about" id="about">
      <div className="about-container">

        <div className="about-content">

          <div className="about-label">
            ABOUT TEENS CONNECT AFRICA
          </div>

          <h2>
            Connecting teenagers to
            <span> opportunities that matter.</span>
          </h2>

          <p className="about-intro">
            Teens Connect Africa, registered as Teens Connect
            Initiative, is a non-profit organization dedicated
            to empowering teenagers by connecting them to
            mentorship, resources and opportunities to grow,
            develop their talents and become productive
            members of society.
          </p>

          <div className="about-buttons">
  <button
    type="button"
    className="about-button"
    onClick={() => navigate("/about")}
  >
    Discover Our Story <span>→</span>
  </button>

  <button
    type="button"
    className="about-button about-button-outline"
    onClick={() => navigate("/founders")}
  >
    Get to Know Our Founders <span>→</span>
  </button>
</div>
        </div>

        <div className="about-highlights">

          <div className="about-highlight">
            <span className="about-number">01</span>

            <div>
              <h3>Mentorship</h3>
              <p>
                Helping teenagers learn from people
                with experience and guidance.
              </p>
            </div>
          </div>

          <div className="about-highlight">
            <span className="about-number">02</span>

            <div>
              <h3>Skills</h3>
              <p>
                Creating opportunities to develop
                practical and digital skills.
              </p>
            </div>
          </div>

          <div className="about-highlight">
            <span className="about-number">03</span>

            <div>
              <h3>Opportunities</h3>
              <p>
                Connecting teenagers with resources,
                partnerships and opportunities to grow.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;