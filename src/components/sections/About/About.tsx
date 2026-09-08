
import "./About.css";

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <h2>About Teens Connect Africa</h2>

          <p>
            Teens Connect Africa, registered as Teens Connect Initiative, is a
            non-profit organization founded in September 2020 and dedicated to
            empowering young people in Africa by connecting them to mentorship,
            resources, and opportunities that enable them to grow, develop their
            talents, and become productive members of society. We contribute to
            the global Sustainable Development Goals, including SDG 4, 5, and 8,
            which promote quality education, gender equality, decent work,
            economic growth, and partnerships for the goals.
          </p>

          <a href="/founders" className="founders-button">
            Get to Know Our Founders
          </a>
        </div>
      </div>

      <div className="about-grid">
        <div className="about-card">
          <h3>Our Mission</h3>
          <p>
            To connect teenagers to mentorship, resources, and opportunities to
            grow, develop, unleash their potential, and fulfill their purpose.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Vision</h3>
          <p>
            An Africa where teenagers have access to opportunities to develop
            their talents and become productive members of society, contributing
            to the global goals and driving sustainable development.
          </p>
        </div>

        <div className="about-card">
          <h3>Our Impact</h3>
          <p>
            Through online and physical programs, we have connected with
            teenagers in Lagos and Abuja, starting with the Zuba community. We
            have given teenagers access to mentors, scholarships, career
            guidance, and a supportive community.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
