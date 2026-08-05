import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-overlay">
        <div className="hero-content">

<section className="hero" id="home"></section>

          <span className="hero-tag">
            An Africa where teenagers have acces to mentorship, resources and opportunities to develop their talent and become productive members of society
            contributing  to the global goals and driving sustainable development.

          </span>

          <h1>
            Empowering teenagers from Africa's
            <span>Most undeserved communities </span>
          </h1>

          <p>
            Mentorship and Support, Strategic Guidance, Partnerships, Entrepreneurship and Digital
            Skills while connecting with teenagers across Africa.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Join Community
            </button>

            <button className="secondary-btn">
              Explore Programs
            </button>
          </div>

          <div className="hero-stats">

            <div className="stat">
              <h2>500+</h2>
              <span>Teen Members</span>
            </div>

            <div className="stat">
              <h2>1</h2>
              <span>African Country</span>
            </div>

            <div className="stat">
              <h2>10+</h2>
              <span>Projects Achievement</span>
            </div>

            <div className="stat">
              <h2>50+</h2>
              <span>Events Hosted</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;