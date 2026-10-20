
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Volunteer.css";

const VOLUNTEER_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSeS7fgwTFLmPQJxhXWNohL_4XYk99WMBxz8-kffmEcux9qf_A/viewform?usp=dialog";

const volunteerOpportunities = [
  {
    number: "01",
    title: "Programme Delivery",
    description:
      "Support mentorship sessions, youth development activities, workshops, and TCA programmes.",
  },
  {
    number: "02",
    title: "Communications",
    description:
      "Help communicate TCA's work through writing, public relations, social media, and community updates.",
  },
  {
    number: "03",
    title: "Community Outreach",
    description:
      "Help connect TCA with communities, schools, families, and organisations working to support teenagers.",
  },
  {
    number: "04",
    title: "Administration",
    description:
      "Contribute to coordination, documentation, planning, record organisation, and day-to-day operations.",
  },
  {
    number: "05",
    title: "Content & Media",
    description:
      "Support photography, video production, storytelling, content creation, and responsible documentation of activities.",
  },
  {
    number: "06",
    title: "Technology & Digital Skills",
    description:
      "Contribute your knowledge of technology, coding, digital tools, ICT, and technical problem-solving.",
  },
  {
    number: "07",
    title: "Graphics & Creative Work",
    description:
      "Help develop visual materials, presentations, designs, and creative resources for TCA initiatives.",
  },
  {
    number: "08",
    title: "Research & Education",
    description:
      "Contribute research, educational resources, learning materials, and ideas that improve youth programmes.",
  },
];

const volunteerBenefits = [
  {
    number: "01",
    title: "Professional Development",
    description:
      "Opportunities to participate in quarterly professional development and capacity-building seminars.",
  },
  {
    number: "02",
    title: "Conferences & Events",
    description:
      "Invitations to relevant youth development conferences, summits, and events.",
  },
  {
    number: "03",
    title: "Recognition & Awards",
    description:
      "Opportunities for Volunteer of the Month or Volunteer of the Year recognition.",
  },
  {
    number: "04",
    title: "Social Media Features",
    description:
      "Opportunities to be featured while celebrating your contributions to the TCA community.",
  },
  {
    number: "05",
    title: "Recommendation Letters",
    description:
      "Eligible volunteers may receive letters of recommendation from the organisation.",
  },
  {
    number: "06",
    title: "Leadership Opportunities",
    description:
      "Potential pathways to greater responsibility, leadership, and career development.",
  },
];

const volunteerJourney = [
  {
    number: "01",
    title: "Apply",
    description:
      "Complete the volunteer application form and tell us about your background, skills, and interests.",
  },
  {
    number: "02",
    title: "Review",
    description:
      "The TCA team reviews your application and considers suitable areas of contribution.",
  },
  {
    number: "03",
    title: "Connect",
    description:
      "Discuss possible roles, availability, expectations, and the next steps with the team.",
  },
  {
    number: "04",
    title: "Contribute",
    description:
      "Use your time, skills, and experience to support teenagers and communities.",
  },
];

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

      {/* HERO */}
      <section className="volunteer-hero">
        <div className="volunteer-container volunteer-hero-content">
          <span className="volunteer-eyebrow">
            GET INVOLVED · TEENS CONNECT AFRICA
          </span>

          <h1>
            Join the Team That&apos;s{" "}
            <span>Changing Lives.</span>
          </h1>

          <p>
            Our volunteers are the engine of Teens Connect Africa. Whether
            you are a professional, a recent graduate, a creative, a student,
            or someone who cares deeply about young people, there is a role
            for you to contribute.
          </p>

          <div className="volunteer-hero-buttons">
            <a
              href="#volunteer-opportunities"
              className="primary-btn"
            >
              Explore Opportunities
            </a>

            <a href="#apply" className="secondary-btn">
              Apply to Volunteer
            </a>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="volunteer-intro">
        <div className="volunteer-container">
          <div className="volunteer-section-heading">
            <span>WHY VOLUNTEER WITH TCA?</span>
            <h2>Be part of something bigger.</h2>
          </div>

          <div className="volunteer-intro-grid">
            <div className="volunteer-intro-text">
              <p>
                Teens Connect Africa connects teenagers to mentorship,
                resources, and opportunities to grow, develop, unleash their
                potential, and fulfil their purpose.
              </p>

              <p>
                Our volunteers contribute their knowledge, experience,
                creativity, networks, and time to programmes that support
                young people and strengthen communities.
              </p>

              <p>
                You can contribute through programme delivery,
                communications, community engagement, administration,
                content creation, education, and other areas where your
                abilities can make a difference.
              </p>
            </div>

            <div className="volunteer-impact-card">
              <span>YOUR CONTRIBUTION MATTERS</span>
              <h3>
                Your time and skills can help a teenager discover new
                possibilities.
              </h3>
              <p>
                You do not have to do everything. Start with what you know,
                what you can offer, and the difference you want to make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* VOLUNTEER OPPORTUNITIES */}
      <section
        className="volunteer-opportunities"
        id="volunteer-opportunities"
      >
        <div className="volunteer-container">
          <div className="volunteer-section-heading light">
            <span>WAYS TO CONTRIBUTE</span>
            <h2>Find your place on the team.</h2>
            <p>
              Choose an area that matches your skills, interests, experience,
              and availability.
            </p>
          </div>

          <div className="volunteer-opportunities-grid">
            {volunteerOpportunities.map((opportunity) => (
              <article
                className="volunteer-opportunity-card"
                key={opportunity.number}
              >
                <span>{opportunity.number}</span>
                <h3>{opportunity.title}</h3>
                <p>{opportunity.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VOLUNTEER BENEFITS */}
      <section className="volunteer-who">
        <div className="volunteer-container">
          <div className="volunteer-section-heading">
            <span>GROW WHILE YOU GIVE</span>
            <h2>What our volunteers can gain.</h2>
            <p>
              Volunteering is an opportunity to serve, learn, build
              relationships, and develop useful professional skills.
            </p>
          </div>

          <div className="volunteer-who-grid">
            {volunteerBenefits.map((benefit) => (
              <article
                className="volunteer-who-card"
                key={benefit.number}
              >
                <span className="volunteer-benefit-number">
                  {benefit.number}
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>

          <p className="volunteer-benefits-note">
            Benefits and recognition are subject to TCA&apos;s applicable
            policies, availability, and eligibility requirements.
          </p>
        </div>
      </section>

      {/* WHO CAN VOLUNTEER */}
      <section className="volunteer-community">
        <div className="volunteer-container">
          <div className="volunteer-community-grid">
            <div className="volunteer-community-content">
              <span>EVERYONE HAS SOMETHING TO OFFER</span>
              <h2>Who can volunteer?</h2>

              <p>
                We welcome people who are willing to contribute responsibly
                to the growth and development of teenagers.
              </p>

              <p>
                Students, recent graduates, professionals, educators,
                entrepreneurs, creatives, and people with relevant
                technical skills can all explore opportunities to contribute.
              </p>

              <p>
                Your application helps us understand your abilities and
                identify opportunities that may suit you.
              </p>
            </div>

            <div className="volunteer-location-card">
              <div className="location-item">
                <strong>Students & Graduates</strong>
                <span>
                  Contribute your ideas, creativity, energy, and skills.
                </span>
              </div>

              <div className="location-item">
                <strong>Professionals & Educators</strong>
                <span>
                  Share knowledge, experience, and practical guidance.
                </span>
              </div>

              <div className="location-item">
                <strong>Entrepreneurs & Creatives</strong>
                <span>
                  Contribute business insight, design, media, and storytelling.
                </span>
              </div>

              <div className="location-item">
                <strong>Community Contributors</strong>
                <span>
                  Support outreach, local initiatives, and programme activities.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VOLUNTEER APPLICATION INFORMATION */}
      <section className="volunteer-information">
        <div className="volunteer-container">
          <div className="volunteer-information-box">
            <span>BEFORE YOU APPLY</span>
            <h2>Tell us how you want to contribute.</h2>

            <p>
              Complete the volunteer application form using the link below.
              The information you provide helps Teens Connect Africa
              understand your background and the areas where you would like
              to serve.
            </p>

            <div className="volunteer-information-list">
              <div>
                <span>01</span>
                <p>Full name and contact information</p>
              </div>

              <div>
                <span>02</span>
                <p>City or location</p>
              </div>

              <div>
                <span>03</span>
                <p>Professional background and skills</p>
              </div>

              <div>
                <span>04</span>
                <p>Preferred volunteering area</p>
              </div>

              <div>
                <span>05</span>
                <p>Why you want to volunteer with TCA</p>
              </div>

              <div>
                <span>06</span>
                <p>Your availability and interests</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* VOLUNTEER JOURNEY */}
      <section className="volunteer-journey">
        <div className="volunteer-container">
          <div className="volunteer-section-heading light">
            <span>YOUR VOLUNTEER JOURNEY</span>
            <h2>From application to impact.</h2>
          </div>

          <div className="volunteer-journey-grid">
            {volunteerJourney.map((step) => (
              <article
                className="volunteer-journey-card"
                key={step.number}
              >
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SAFEGUARDING */}
      <section className="volunteer-safety">
        <div className="volunteer-container">
          <div className="volunteer-safety-card">
            <span>OUR RESPONSIBILITY</span>
            <h2>
              Creating safe and respectful spaces for teenagers.
            </h2>

            <p>
              Teens Connect Africa is committed to protecting the safety,
              dignity, privacy, and wellbeing of young people. Volunteers
              must act responsibly, respect appropriate boundaries, and
              follow TCA&apos;s child safeguarding expectations and policies.
            </p>
          </div>
        </div>
      </section>

      {/* APPLICATION CTA */}
      <section className="volunteer-apply" id="apply">
        <div className="volunteer-container volunteer-apply-content">
          <span>READY TO MAKE A DIFFERENCE?</span>

          <h2>
            Your skills could become someone&apos;s opportunity.
          </h2>

          <p>
            Take the first step by completing our volunteer application.
            Tell us about yourself and how you would like to contribute
            to Teens Connect Africa.
          </p>

          <a
            href={VOLUNTEER_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-btn"
          >
            Apply to Volunteer <span aria-hidden="true">↗</span>
          </a>

          <p className="volunteer-application-note">
            The application opens in Google Forms in a new tab.
          </p>

          <div className="volunteer-next-steps">
            <p>Interested in supporting TCA in another way?</p>
            <div className="volunteer-hero-buttons">
              <Link to="/donate" className="secondary-btn">
                Support Our Mission
              </Link>
              <Link to="/contact" className="secondary-btn">
                Contact TCA
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Volunteer;
