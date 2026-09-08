import { useNavigate } from "react-router-dom";
import "./Volunteer.css";

const Volunteer = () => {
  const navigate = useNavigate();

  return (
    <main className="volunteer-page">

      <button
        type="button"
        className="return-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      {/* =========================
          HERO
      ========================= */}
      <section className="volunteer-hero">
        <div className="volunteer-container volunteer-hero-content">

          <span className="volunteer-eyebrow">
            GET INVOLVED • TEENS CONNECT AFRICA
          </span>

          <h1>
            Volunteer. Connect. <span>Make an Impact.</span>
          </h1>

          <p>
            Your time, skills, experience, and passion can help create
            opportunities for teenagers to learn, grow, discover their
            potential, and contribute meaningfully to their communities.
          </p>

          <div className="volunteer-hero-buttons">
            <a
              href="#volunteer-opportunities"
              className="primary-btn"
            >
              Explore Opportunities
            </a>

            <a
              href="#apply"
              className="secondary-btn"
            >
              Become a Volunteer
            </a>
          </div>

        </div>
      </section>


      {/* =========================
          INTRODUCTION
      ========================= */}
      <section className="volunteer-intro">
        <div className="volunteer-container">

          <div className="volunteer-section-heading">
            <span>WHY VOLUNTEER?</span>

            <h2>
              Be part of something bigger.
            </h2>
          </div>

          <div className="volunteer-intro-grid">

            <div className="volunteer-intro-text">
              <p>
                Teens Connect Africa believes that young people thrive when
                they have access to supportive communities, mentorship,
                resources, opportunities, and people who are willing to invest
                in their growth.
              </p>

              <p>
                Volunteers make this possible by bringing their knowledge,
                talents, experiences, networks, creativity, and time to
                communities where they can make a meaningful difference.
              </p>

              <p>
                Whether you want to mentor teenagers, support education,
                contribute your professional skills, organize programs, or
                help a community initiative, there is a place for you to
                contribute.
              </p>
            </div>

            <div className="volunteer-impact-card">
              <span>YOUR CONTRIBUTION MATTERS</span>

              <h3>
                One person can create an opportunity that changes a young
                person's direction.
              </h3>

              <p>
                We connect volunteers with opportunities where their skills,
                interests, and passion can support teenagers and communities.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* =========================
          OPPORTUNITIES
      ========================= */}
      <section
        className="volunteer-opportunities"
        id="volunteer-opportunities"
      >
        <div className="volunteer-container">

          <div className="volunteer-section-heading light">
            <span>WAYS TO CONTRIBUTE</span>

            <h2>
              How you can help
            </h2>

            <p>
              Choose an area that matches your skills, experience, interests,
              and the kind of impact you want to make.
            </p>
          </div>

          <div className="volunteer-opportunities-grid">

            <article className="volunteer-opportunity-card">
              <span>01</span>
              <h3>Education & Mentorship</h3>
              <p>
                Support teenagers through academic guidance, mentorship,
                learning sessions, career conversations, and personal
                development.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>02</span>
              <h3>Career Guidance</h3>
              <p>
                Share knowledge about careers, professional development,
                industries, skills, and opportunities that can help teenagers
                make informed decisions.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>03</span>
              <h3>Technology</h3>
              <p>
                Use your technology, software, engineering, digital, or
                technical skills to support young people and TCA initiatives.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>04</span>
              <h3>Media & Content</h3>
              <p>
                Help tell stories, create content, document activities, manage
                media, or communicate the impact of TCA programs.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>05</span>
              <h3>Community Outreach</h3>
              <p>
                Help TCA connect with communities, identify opportunities,
                support outreach activities, and connect teenagers with
                available resources.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>06</span>
              <h3>Events & Programs</h3>
              <p>
                Support the planning, coordination, and delivery of events,
                workshops, campaigns, and youth-focused programs.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>07</span>
              <h3>Graphics & Design</h3>
              <p>
                Support TCA through graphic design, visual communication,
                branding, presentations, and creative materials.
              </p>
            </article>

            <article className="volunteer-opportunity-card">
              <span>08</span>
              <h3>Research & Education</h3>
              <p>
                Contribute research, educational resources, ideas, and
                information that can help improve programs and opportunities
                for teenagers.
              </p>
            </article>

          </div>
        </div>
      </section>


      {/* =========================
          WHERE YOU WANT TO HELP
      ========================= */}
      <section className="volunteer-community">
        <div className="volunteer-container">

          <div className="volunteer-community-grid">

            <div className="volunteer-community-content">

              <span>YOUR COMMUNITY</span>

              <h2>
                Where do you want to make an impact?
              </h2>

              <p>
                We want to understand where volunteers are interested in
                contributing so we can better connect people with communities
                and opportunities where they can help.
              </p>

              <p>
                You can volunteer to support teenagers in your own community,
                another community, or contribute to initiatives across your
                country.
              </p>

            </div>

            <div className="volunteer-location-card">

              <div className="location-item">
                <strong>Country</strong>
                <span>Where do you want to contribute?</span>
              </div>

              <div className="location-item">
                <strong>State / Region</strong>
                <span>What area would you like to support?</span>
              </div>

              <div className="location-item">
                <strong>Community</strong>
                <span>Which community would you like to serve?</span>
              </div>

              <div className="location-item">
                <strong>Focus</strong>
                <span>What would you like to help teenagers with?</span>
              </div>

            </div>

          </div>
        </div>
      </section>


      {/* =========================
          WHO CAN VOLUNTEER
      ========================= */}
      <section className="volunteer-who">
        <div className="volunteer-container">

          <div className="volunteer-section-heading">
            <span>WHO CAN VOLUNTEER?</span>

            <h2>
              Everyone brings something valuable.
            </h2>
          </div>

          <div className="volunteer-who-grid">

            <div className="volunteer-who-card">
              <h3>Students</h3>
              <p>
                Share your skills, creativity, ideas, and time while gaining
                meaningful experience.
              </p>
            </div>

            <div className="volunteer-who-card">
              <h3>Professionals</h3>
              <p>
                Use your professional knowledge and experience to mentor and
                support young people.
              </p>
            </div>

            <div className="volunteer-who-card">
              <h3>Educators</h3>
              <p>
                Support learning, mentorship, academic development, and
                educational initiatives.
              </p>
            </div>

            <div className="volunteer-who-card">
              <h3>Entrepreneurs</h3>
              <p>
                Share business knowledge, entrepreneurship experience, and
                practical guidance.
              </p>
            </div>

            <div className="volunteer-who-card">
              <h3>Creatives</h3>
              <p>
                Bring your skills in design, photography, filmmaking, writing,
                music, media, and storytelling.
              </p>
            </div>

            <div className="volunteer-who-card">
              <h3>Organizations</h3>
              <p>
                Partner with TCA through resources, expertise, programs,
                community initiatives, or collaborative opportunities.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          WHAT WE WANT TO KNOW
      ========================= */}
      <section className="volunteer-information">
        <div className="volunteer-container">

          <div className="volunteer-information-box">

            <div>
              <span>BEFORE YOU APPLY</span>

              <h2>
                Tell us how you want to contribute.
              </h2>
            </div>

            <p>
              Our volunteer application helps us understand who you are, what
              you can contribute, where you want to make an impact, and the
              communities and teenagers you are interested in supporting.
            </p>

            <div className="volunteer-information-list">

              <div>
                <span>01</span>
                <p>Your background and interests</p>
              </div>

              <div>
                <span>02</span>
                <p>Your skills and experience</p>
              </div>

              <div>
                <span>03</span>
                <p>The area where you want to volunteer</p>
              </div>

              <div>
                <span>04</span>
                <p>The community or country you want to support</p>
              </div>

              <div>
                <span>05</span>
                <p>How you would like to help teenagers</p>
              </div>

              <div>
                <span>06</span>
                <p>Your availability and preferred involvement</p>
              </div>

            </div>
          </div>
        </div>
      </section>


      {/* =========================
          VOLUNTEER JOURNEY
      ========================= */}
      <section className="volunteer-journey">
        <div className="volunteer-container">

          <div className="volunteer-section-heading light">
            <span>THE JOURNEY</span>

            <h2>
              From application to impact.
            </h2>
          </div>

          <div className="volunteer-journey-grid">

            <div className="volunteer-journey-card">
              <span>01</span>
              <h3>Apply</h3>
              <p>
                Tell us about yourself, your skills, and how you want to
                contribute.
              </p>
            </div>

            <div className="volunteer-journey-card">
              <span>02</span>
              <h3>Review</h3>
              <p>
                The TCA team reviews your information and identifies suitable
                opportunities.
              </p>
            </div>

            <div className="volunteer-journey-card">
              <span>03</span>
              <h3>Connect</h3>
              <p>
                We connect with you about the next steps and possible areas of
                contribution.
              </p>
            </div>

            <div className="volunteer-journey-card">
              <span>04</span>
              <h3>Contribute</h3>
              <p>
                Use your time, skills, and passion to support teenagers and
                communities.
              </p>
            </div>

            <div className="volunteer-journey-card">
              <span>05</span>
              <h3>Grow</h3>
              <p>
                Continue learning, building relationships, and creating
                meaningful impact.
              </p>
            </div>

          </div>
        </div>
      </section>


      {/* =========================
          SAFEGUARDING
      ========================= */}
      <section className="volunteer-safety">
        <div className="volunteer-container">

          <div className="volunteer-safety-card">

            <span>OUR RESPONSIBILITY</span>

            <h2>
              Volunteering with young people comes with responsibility.
            </h2>

            <p>
              Teens Connect Africa is committed to creating respectful,
              supportive, and safe environments for young people. Volunteers
              are expected to act professionally, respect young people's
              privacy and dignity, and follow TCA's safeguarding expectations.
            </p>

          </div>
        </div>
      </section>


      {/* =========================
          APPLICATION CTA
      ========================= */}
      <section
        className="volunteer-apply"
        id="apply"
      >
        <div className="volunteer-container volunteer-apply-content">

          <span>READY TO MAKE A DIFFERENCE?</span>

          <h2>
            Your skills could become someone's opportunity.
          </h2>

          <p>
            Take the first step and tell us how you would like to contribute
            to Teens Connect Africa.
          </p>

          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeS7fgwTFLmPQJxhXWNohL_4XYk99WMBxz8-kffmEcux9qf_A/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            Apply to Volunteer
          </a>

        </div>
      </section>

    </main>
  );
};

export default Volunteer;