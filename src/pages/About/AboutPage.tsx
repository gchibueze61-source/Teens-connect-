import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AboutPage.css";

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(".about-animate");

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("about-visible"));
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="about-page">
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
            Born from a Belief That{" "}
            <span>Every Teenager Deserves a Chance</span>
          </h1>

          <p className="about-animate about-delay-2">
            Teens Connect Africa connects teenagers in underserved communities
            with mentorship, resources, and real opportunities to develop their
            potential and contribute to community and national development.
          </p>

          <div className="about-hero-image-wrap about-animate">
            <img
              className="about-hero-image"
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1600&q=85"
              alt="Young people learning and participating in a group activity"
              loading="lazy"
            />
    
          </div>
        </div>
      </section>

      <section className="about-page-story">
        <div className="about-page-container about-story-grid">
          <div className="about-section-heading about-animate">
            <span>OUR STORY</span>
            <h2>
              Born from a Belief That{" "}
              <strong>Every Teenager Deserves a Chance</strong>
            </h2>
          </div>

          <div className="about-story-content about-animate about-delay-1">
            <p>
              Teens Connect Africa was founded in September 2020 and registered
              as Teens Connect Initiative in 2023. The organisation was born
              out of a simple but powerful belief: that teenagers in underserved
              communities, often dismissed, overlooked, or left without
              guidance, are not problems to be managed. They are potential
              waiting to be unleashed.
            </p>

            <p>
              In the Zuba community of Abuja, where teenagers faced high risks
              of school dropout, teenage pregnancy, cultism, and unemployment,
              our founder created a platform to provide what was missing:
              access to mentors, resources, and real opportunities. What began
              as informal monthly meetings has grown into a structured,
              multi-programme organisation operating in Abuja and Lagos, with
              a long-term goal of reaching 10,000 teenagers from Africa's most
              underserved communities by 2035.
            </p>

            <p>
              Since inception, Teens Connect Africa has reached over 2,750
              teenagers directly through its monthly mentorship meetings and
              over 3,500 more through its online platforms. The Talent
              Development Program alone has supported 345 teenagers across
              three editions and established five talent clubs. The
              organisation has partnered with international bodies including
              Save the Children International Nigeria, Global Changemakers,
              and Women Who Win Africa.
            </p>

            <p>
              We accelerate access to quality education through informal and
              non-formal strategies, including mentorship, skills training,
              community service, and creative engagement, preparing teenagers
              for life, career paths, and national development. In all of this,
              Teens Connect Africa remains committed to nurturing a generation
              of African teenagers equipped with the skills, mindset, and
              support to become productive members of society and drive
              meaningful change.
            </p>
          </div>
        </div>
      </section>

      <section className="about-page-work">
        <div className="about-page-container">
          <div className="about-work-heading about-animate">
            <span>EXPLORE TCA</span>
            <h2>
              Meet the People <strong>Behind Our Mission</strong>
            </h2>
            <p>
              Discover the people who provide leadership, support our
              programmes, and help young people contribute to positive change.
              Explore each group on its dedicated page.
            </p>
          </div>

          <div className="about-work-grid about-leadership-grid">
            <article className="about-work-card about-animate">
              <span className="about-card-number">01</span>
              <h3>Board of Directors</h3>
              <p>
                Learn about the board and its role in providing guidance and
                oversight for the organisation.
              </p>
              <button
                type="button"
                className="about-cta-primary"
                onClick={() => navigate("/board-members")}
              >
                Meet the Board
              </button>
            </article>

            <article className="about-work-card about-animate about-delay-1">
              <span className="about-card-number">02</span>
              <h3>Executive Team</h3>
              <p>
                Discover the team supporting TCA's programmes, community
                engagement, communications, and day-to-day work.
              </p>
              <button
                type="button"
                className="about-cta-primary"
                onClick={() => navigate("/team")}
              >
                Meet Our Team
              </button>
            </article>

            <article className="about-work-card about-animate about-delay-2">
              <span className="about-card-number">03</span>
              <h3>Teen Executive Committee</h3>
              <p>
                Explore the young leaders who help represent teen voices and
                contribute to youth-led initiatives.
              </p>
              <button
                type="button"
                className="about-cta-primary"
                onClick={() => navigate("/teen-executive-committee")}
              >
                Meet Our Teen Leaders
              </button>
            </article>
          </div>
        </div>
      </section>

      <section className="about-page-vision">
        <div className="about-page-container about-vision-grid">
          <article className="about-vision-card about-animate">
            <div className="about-vision-label">OUR VISION</div>
            <h2>
              An Africa where teenagers have access to opportunities to develop
              their talent and become productive members of society contributing
              to the global goals and driving sustainable development.
            </h2>
          </article>

          <article className="about-vision-card about-animate about-delay-1">
            <div className="about-vision-label">OUR MISSION</div>
            <h2>
              To connect teenagers to mentorship, resources, and opportunities
              to grow, develop, and unleash their potential, and fulfil their
              purpose.
            </h2>
          </article>

          <article className="about-vision-card about-animate about-delay-2">
            <div className="about-vision-label">OUR LONG-TERM GOAL</div>
            <h2>
              To empower 10,000 teenagers from Africa's most underserved
              communities by 2035.
            </h2>
          </article>
        </div>
      </section>

      <section className="about-page-work about-values-section">
        <div className="about-page-container">
          <div className="about-work-heading about-animate">
            <span>OUR VALUES</span>
            <h2>
              The Principles That <strong>Guide Our Work</strong>
            </h2>
          </div>

          <div className="about-work-grid about-values-grid">
            <article className="about-work-card about-animate">
              <span className="about-card-number">01</span>
              <h3>Integrity</h3>
              <p>We do what we say, and we say what we do.</p>
            </article>

            <article className="about-work-card about-animate about-delay-1">
              <span className="about-card-number">02</span>
              <h3>Personal Development</h3>
              <p>We believe in the continuous growth of every individual.</p>
            </article>

            <article className="about-work-card about-animate about-delay-2">
              <span className="about-card-number">03</span>
              <h3>Excellence</h3>
              <p>We hold ourselves and our teens to high standards.</p>
            </article>

            <article className="about-work-card about-animate">
              <span className="about-card-number">04</span>
              <h3>Innovation &amp; Creativity</h3>
              <p>We find new ways to reach, inspire, and equip young people.</p>
            </article>

            <article className="about-work-card about-animate about-delay-1">
              <span className="about-card-number">05</span>
              <h3>Collaboration</h3>
              <p>
                We are stronger together with partners, volunteers, and
                communities.
              </p>
            </article>

            <article className="about-work-card about-animate about-delay-2">
              <span className="about-card-number">06</span>
              <h3>Communication</h3>
              <p>
                Clear, honest, and empowering communication in everything we do.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="about-page-belief">
        <div className="about-page-container about-belief-grid">
          <div className="about-belief-intro about-animate">
            <span>OUR APPROACH &amp; SDGs</span>
            <h2>
              Turning Opportunities Into <strong>Sustainable Change</strong>
            </h2>

            <img
              className="about-approach-image"
              src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85"
              alt="Students learning and collaborating in an educational setting"
              loading="lazy"
            />
            <span className="about-image-note">Illustrative image</span>
          </div>

          <div className="about-belief-content about-animate about-delay-1">
            <p>
              Teens Connect Africa uses mentorship, skills training, community
              service, and creative engagement to help teenagers develop their
              abilities, explore opportunities, and contribute to their
              communities.
            </p>

            <p>
              <strong>SDG 4: Quality Education.</strong> Mentorship and
              non-formal learning help promote access to educational
              opportunities in underserved communities.
            </p>

            <p>
              <strong>SDG 5: Gender Equality.</strong> The Girl Emerge Project
              and International Day of the Girl Child programming support the
              participation and development of girls.
            </p>

            <p>
              <strong>SDG 8: Decent Work &amp; Economic Growth.</strong> Skills
              acquisition, vocational training, entrepreneurship workshops,
              and the Talent Development Program help teenagers prepare for
              future opportunities.
            </p>

            <p>
              <strong>SDG 13: Climate Action.</strong> Project Keep Zuba Clean,
              the Generation Hope climate campaign with Save the Children,
              climate ambassadors, and COP 29 Simulation participation reflect
              TCA's climate engagement.
            </p>

            <p>
              <strong>SDG 17: Partnerships for the Goals.</strong> Collaboration
              with partner organisations helps strengthen initiatives and
              expand opportunities for young people.
            </p>
          </div>
        </div>
      </section>

      <section className="about-page-story about-theory-section">
        <div className="about-page-container about-story-grid">
          <div className="about-section-heading about-animate">
            <span>OUR THEORY OF CHANGE</span>
            <h2>
              Every Teenager Has Potential{" "}
              <strong>Worth Investing In</strong>
            </h2>
          </div>

          <div className="about-story-content about-animate about-delay-1">
            <p>
              If young minds can be drawn into harmful paths through neglect
              and a lack of opportunity, we believe that with the right
              mentorship and exposure, those same minds can be shaped into
              productive forces for community and national development.
            </p>

            <p>
              Teens Connect Africa uses a community-based, informal, and
              inclusive model of mentorship, meeting teenagers where they are,
              removing barriers to participation, and creating safe,
              empowering spaces for growth. This model is expanding to new
              cities and communities.
            </p>
          </div>
        </div>
      </section>

      <section className="about-page-cta">
        <div className="about-page-container">
          <div className="about-cta-inner about-animate">
            <span>BE PART OF THE MOVEMENT</span>
            <h2>
              Help Us Unleash <strong>the Genius in Teens</strong>
            </h2>
            <p>
              Join us in connecting teenagers to mentorship, resources, and
              opportunities to grow, develop, and fulfil their purpose.
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