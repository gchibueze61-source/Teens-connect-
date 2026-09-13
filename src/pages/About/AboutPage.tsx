import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".about-animate"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("about-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("about-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-page">

      {/* HERO */}
      <section className="about-page-hero">
        <div className="about-page-hero-inner">

          <button
            type="button"
            className="about-page-back about-animate"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

          <span className="about-page-eyebrow about-animate">
            ABOUT TEENS CONNECT AFRICA
          </span>

          <h1 className="about-animate about-delay-1">
            Helping teenagers discover
            <span> what they are capable of.</span>
          </h1>

          <p className="about-animate about-delay-2">
            Teens Connect Africa is a non-profit organization connecting
            teenagers to mentorship, resources and opportunities that help
            them develop their potential and become productive members of
            society.
          </p>

        </div>
      </section>


      {/* OUR STORY */}
      <section className="about-page-story">
        <div className="about-page-container about-story-grid">

          <div className="about-section-heading about-animate">
            <span>OUR STORY</span>

            <h2>
              It started with a
              <strong> desire to see teenagers thrive.</strong>
            </h2>
          </div>

          <div className="about-story-content about-animate about-delay-1">

            <p>
              Teens Connect Africa was founded in 2020 by Anne Obize after
              witnessing the challenges teenagers in underserved communities
              faced, including limited access to mentorship, exposure and
              opportunities.
            </p>

            <p>
              Having lived in the Zuba community for many years, she saw how
              the environment around young people could influence their
              choices and their future. Rather than accepting those
              limitations, Teens Connect Africa was created to provide a
              platform where teenagers could receive guidance, discover their
              abilities and engage in positive opportunities.
            </p>

            <p>
              Today, the organization continues to use mentorship,
              non-formal education, talent development and community
              engagement to help teenagers grow.
            </p>

          </div>

        </div>
      </section>


      {/* VISION */}
      <section className="about-page-vision">
        <div className="about-page-container">

          <div className="about-vision-card about-animate">

            <div className="about-vision-label">
              OUR VISION
            </div>

            <h2>
              An Africa where teenagers have access to opportunities to
              develop their talent and become productive members of society.
            </h2>

          </div>

        </div>
      </section>


      {/* WHAT WE DO */}
      <section className="about-page-work">
        <div className="about-page-container">

          <div className="about-work-heading about-animate">
            <span>WHAT WE DO</span>

            <h2>
              Creating pathways for
              <strong> teenage potential.</strong>
            </h2>

            <p>
              Our work focuses on creating the guidance, exposure and
              opportunities teenagers need to grow.
            </p>
          </div>


          <div className="about-work-grid">

            <article className="about-work-card about-animate">
              <span>01</span>

              <h3>Mentorship</h3>

              <p>
                We connect teenagers with people who can provide guidance,
                knowledge, encouragement and practical perspectives for
                navigating life.
              </p>
            </article>


            <article className="about-work-card about-animate about-delay-1">
              <span>02</span>

              <h3>Talent Development</h3>

              <p>
                We create opportunities for teenagers to discover,
                develop and express their talents through practical
                programmes and activities.
              </p>
            </article>


            <article className="about-work-card about-animate about-delay-2">
              <span>03</span>

              <h3>Skills & Capacity</h3>

              <p>
                We expose young people to useful skills, knowledge and
                learning experiences that can support their personal
                development.
              </p>
            </article>


            <article className="about-work-card about-animate about-delay-3">
              <span>04</span>

              <h3>Community Engagement</h3>

              <p>
                We encourage teenagers to contribute positively to their
                communities through service, awareness and youth-led
                initiatives.
              </p>
            </article>

          </div>

        </div>
      </section>


      {/* JOURNEY */}
      <section className="about-page-impact">
        <div className="about-page-container">

          <div className="about-impact-header about-animate">
            <span>OUR JOURNEY</span>

            <h2>
              From one community to
              <strong> a growing movement.</strong>
            </h2>
          </div>


          <div className="about-impact-timeline">

            <div className="about-timeline-item about-animate">
              <div className="about-timeline-year">
                2020
              </div>

              <div>
                <h3>Teens Connect Africa begins</h3>

                <p>
                  TCA was founded to connect teenagers in underserved
                  communities with mentorship, resources and opportunities.
                </p>
              </div>
            </div>


            <div className="about-timeline-item about-animate about-delay-1">
              <div className="about-timeline-year">
                GROWTH
              </div>

              <div>
                <h3>Mentorship & talent development</h3>

                <p>
                  Monthly mentorship activities and talent development
                  initiatives created spaces for teenagers to learn,
                  connect and develop their potential.
                </p>
              </div>
            </div>


            <div className="about-timeline-item about-animate about-delay-2">
              <div className="about-timeline-year">
                TODAY
              </div>

              <div>
                <h3>Expanding the movement</h3>

                <p>
                  TCA continues its work in Abuja while expanding its
                  community of teenagers, mentors and volunteers beyond
                  its original Zuba base.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* WHY WE EXIST */}
      <section className="about-page-belief">
        <div className="about-page-container about-belief-grid">

          <div className="about-animate">
            <span>WHY WE EXIST</span>

            <h2>
              Every teenager deserves someone who sees their potential.
            </h2>
          </div>

          <div className="about-animate about-delay-1">

            <p>
              We believe teenagers should not have to figure out their
              potential alone.
            </p>

            <p>
              With the right guidance, exposure and opportunities, young
              people can develop their talents, make better decisions and
              contribute meaningfully to their communities.
            </p>

            <p>
              That belief continues to shape the work of Teens Connect
              Africa.
            </p>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="about-page-cta">
        <div className="about-page-container">

          <div className="about-cta-inner about-animate">

            <span>BE PART OF THE MOVEMENT</span>

            <h2>
              There is a place for you at
              <strong> Teens Connect Africa.</strong>
            </h2>

            <p>
              Join a growing community committed to helping teenagers
              learn, grow and make a difference.
            </p>

            <div className="about-cta-actions">

              <button
                type="button"
                className="about-cta-primary"
                onClick={() => navigate("/register")}
              >
                Join Our Community
              </button>

              <button
                type="button"
                className="about-cta-secondary"
                onClick={() => navigate("/volunteer")}
              >
                Get Involved
              </button>

            </div>

          </div>

        </div>
      </section>

    </main>
  );
};

export default AboutPage;