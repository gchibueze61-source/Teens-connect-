
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Mentor.css";

const MENTOR_WHATSAPP_NUMBER = "2348133384466";

const mentorBenefits = [
  {
    number: "01",
    title: "Make a Difference",
    description:
      "Share your experience and help teenagers build confidence, discover opportunities, and make informed decisions about their future.",
  },
  {
    number: "02",
    title: "Share Your Experience",
    description:
      "Bring practical knowledge from your profession, personal journey, and life lessons to young people who can learn from you.",
  },
  {
    number: "03",
    title: "Inspire Possibility",
    description:
      "Help teenagers see that meaningful careers, personal growth, and positive change are possible.",
  },
];

const mentorSteps = [
  {
    number: "01",
    title: "Tell Us About Yourself",
    description:
      "Complete the mentor interest form with your contact information, professional background, and area of expertise.",
  },
  {
    number: "02",
    title: "Connect With Our Team",
    description:
      "Send your interest through WhatsApp so the team can discuss your availability and the next steps with you.",
  },
  {
    number: "03",
    title: "Share Your Knowledge",
    description:
      "Subject to coordination and appropriate screening, you may be invited to facilitate a 45-minute life skills session.",
  },
];

function Mentor() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    profession: "",
    expertise: "",
    preferredMonth: "",
    location: "",
    bio: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const message = [
      "TEENS CONNECT AFRICA — MENTOR INTEREST",
      "",
      `Full Name: ${formData.fullName.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Phone: ${formData.phone.trim()}`,
      `Profession / Industry: ${formData.profession.trim()}`,
      `Topic / Area of Expertise: ${formData.expertise.trim()}`,
      `Preferred Month: ${formData.preferredMonth}`,
      `Preferred Location: ${formData.location}`,
      `Brief Bio: ${formData.bio.trim() || "Not provided"}`,
      "",
      "I am interested in becoming a mentor with Teens Connect Africa.",
    ].join("\n");

    const whatsappUrl =
      `https://wa.me/${MENTOR_WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);

    const newWindow = window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer",
    );

    if (!newWindow) {
      setError(
        "Your browser may have blocked the WhatsApp window. Please allow pop-ups and try again.",
      );
      return;
    }

    setError(
      "WhatsApp should open with your details prepared. Review the message and press Send to submit your interest.",
    );
  };

  return (
    <main className="mentor-page">
      <div className="mentor-container">
        <button
          type="button"
          className="return-home-button"
          onClick={() => navigate("/")}
        >
          ← Back to Home
        </button>

        <section className="mentor-hero">
          <div className="mentor-hero-content">
            <span className="mentor-eyebrow">
              BECOME A MENTOR
            </span>

            <h1>
              Share Your Story.
              <span> Change a Life.</span>
            </h1>

            <p>
              You don't need to be famous or have a perfect story. You
              just need to be willing to show up, share what you've
              learned, and help a teenager see what is possible.
            </p>

            <div className="mentor-hero-actions">
              <a href="#mentor-form" className="mentor-primary-btn">
                Become a Mentor
                <span aria-hidden="true"> →</span>
              </a>

              <Link to="/volunteer" className="mentor-secondary-btn">
                Explore Volunteering
              </Link>
            </div>

            <div className="mentor-hero-note">
              <span className="mentor-note-icon" aria-hidden="true">
                ★
              </span>
              <span>
                One mentor. One 45-minute session. A meaningful
                opportunity to inspire.
              </span>
            </div>
          </div>

          <div className="mentor-hero-art" aria-hidden="true">
            <div className="mentor-art-orbit mentor-art-orbit-one" />
            <div className="mentor-art-orbit mentor-art-orbit-two" />

            <div className="mentor-art-card">
              <span className="mentor-art-symbol">TCA</span>
              <div className="mentor-art-line" />
              <h2>Experience meets possibility.</h2>
              <p>
                Helping young people discover what their future can hold.
              </p>
              <span className="mentor-art-stars">✦ ✦ ✦</span>
            </div>

            <span className="mentor-floating-word mentor-floating-word-one">
              INSPIRE
            </span>
            <span className="mentor-floating-word mentor-floating-word-two">
              CONNECT
            </span>
          </div>
        </section>

        <section className="mentor-intro">
          <div className="mentor-section-heading">
            <span className="mentor-section-label">WHY MENTOR?</span>
            <h2>
              Your experience could be the encouragement someone needs.
            </h2>
            <p>
              Teenagers benefit from learning directly from people who
              have navigated different paths in life. Your story,
              knowledge, and honest advice can help make those paths
              easier to understand.
            </p>
          </div>

          <div className="mentor-benefits-grid">
            {mentorBenefits.map((benefit) => (
              <article className="mentor-benefit-card" key={benefit.number}>
                <span className="mentor-card-number">
                  {benefit.number}
                </span>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mentor-who">
          <div className="mentor-who-copy">
            <span className="mentor-section-label">
              WHO CAN BECOME A MENTOR?
            </span>
            <h2>
              Bring your knowledge. Be real. Make an impact.
            </h2>
            <p>
              We welcome people with useful experiences and a genuine
              interest in supporting teenagers. You do not need to have
              achieved everything in life to share something valuable.
            </p>
          </div>

          <div className="mentor-fields-grid">
            <div className="mentor-field-card">
              <span aria-hidden="true">01</span>
              <h3>Education</h3>
              <p>Learning, career choices, study habits, and personal growth.</p>
            </div>

            <div className="mentor-field-card">
              <span aria-hidden="true">02</span>
              <h3>Business</h3>
              <p>Entrepreneurship, leadership, money skills, and work.</p>
            </div>

            <div className="mentor-field-card">
              <span aria-hidden="true">03</span>
              <h3>Technology</h3>
              <p>Digital skills, innovation, engineering, and technology careers.</p>
            </div>

            <div className="mentor-field-card">
              <span aria-hidden="true">04</span>
              <h3>Creative Fields</h3>
              <p>Arts, media, writing, communication, and creative careers.</p>
            </div>

            <div className="mentor-field-card">
              <span aria-hidden="true">05</span>
              <h3>Health & Wellbeing</h3>
              <p>Healthy habits, personal development, and wellbeing awareness.</p>
            </div>

            <div className="mentor-field-card">
              <span aria-hidden="true">06</span>
              <h3>Other Professions</h3>
              <p>Finance, public service, skilled trades, and other life experiences.</p>
            </div>
          </div>
        </section>

        <section className="mentor-session">
          <div className="mentor-session-main">
            <span className="mentor-section-label">
              WHAT DOES MENTORING INVOLVE?
            </span>
            <h2>A simple session. A valuable conversation.</h2>
            <p>
              The TCA mentoring model invites a mentor to facilitate a
              45-minute life skills session for teenagers each month.
              Sessions can focus on practical knowledge, personal
              experiences, career exploration, or lessons that young
              people can apply in their lives.
            </p>
          </div>

          <div className="mentor-session-time">
            <span className="mentor-session-star" aria-hidden="true">
              ✦
            </span>
            <strong>45</strong>
            <span>MINUTES</span>
            <p>One session designed to share knowledge and inspire.</p>
          </div>
        </section>

        <section className="mentor-process">
          <div className="mentor-section-heading">
            <span className="mentor-section-label">HOW IT WORKS</span>
            <h2>Your mentoring journey starts here.</h2>
          </div>

          <div className="mentor-process-grid">
            {mentorSteps.map((step) => (
              <article className="mentor-process-card" key={step.number}>
                <span className="mentor-process-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mentor-form-section" id="mentor-form">
          <div className="mentor-form-intro">
            <span className="mentor-section-label">
              MENTOR INTEREST FORM
            </span>
            <h2>Let's start a conversation.</h2>
            <p>
              Tell us a little about yourself and how you would like to
              contribute. Your details will be prepared in a WhatsApp
              message for you to review and send to our team.
            </p>

            <div className="mentor-form-reminder">
              <span aria-hidden="true">✓</span>
              <p>
                <strong>What happens next?</strong>
                <br />
                Our team can discuss your availability, the session topic,
                and the next steps, including appropriate screening.
              </p>
            </div>
          </div>

          <form className="mentor-form" onSubmit={handleSubmit}>
            <div className="mentor-form-heading">
              <h3>Your details</h3>
              <p>Fields marked with * are required.</p>
            </div>

            <div className="mentor-form-grid">
              <div className="mentor-form-field">
                <label htmlFor="mentor-fullName">Full name *</label>
                <input
                  id="mentor-fullName"
                  name="fullName"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mentor-form-field">
                <label htmlFor="mentor-email">Email address *</label>
                <input
                  id="mentor-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="mentor-form-field">
                <label htmlFor="mentor-phone">Phone number *</label>
                <input
                  id="mentor-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mentor-form-field">
                <label htmlFor="mentor-profession">
                  Profession / Industry *
                </label>
                <input
                  id="mentor-profession"
                  name="profession"
                  type="text"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="e.g. Education, Technology, Business"
                  required
                />
              </div>

              <div className="mentor-form-field mentor-form-field-full">
                <label htmlFor="mentor-expertise">
                  Topic / Area of expertise *
                </label>
                <input
                  id="mentor-expertise"
                  name="expertise"
                  type="text"
                  value={formData.expertise}
                  onChange={handleChange}
                  placeholder="What would you like to share with teenagers?"
                  required
                />
              </div>

              <div className="mentor-form-field">
                <label htmlFor="mentor-month">
                  Preferred month to mentor *
                </label>
                <select
                  id="mentor-month"
                  name="preferredMonth"
                  value={formData.preferredMonth}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a month</option>
                  <option value="January">January</option>
                  <option value="February">February</option>
                  <option value="March">March</option>
                  <option value="April">April</option>
                  <option value="May">May</option>
                  <option value="June">June</option>
                  <option value="July">July</option>
                  <option value="August">August</option>
                  <option value="September">September</option>
                  <option value="October">October</option>
                  <option value="November">November</option>
                  <option value="December">December</option>
                  <option value="Flexible / To be discussed">
                    Flexible / To be discussed
                  </option>
                </select>
              </div>

              <div className="mentor-form-field">
                <label htmlFor="mentor-location">Preferred location *</label>
                <select
                  id="mentor-location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                >
                  <option value="">Choose a location</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Virtual">Virtual</option>
                </select>
              </div>

              <div className="mentor-form-field mentor-form-field-full">
                <label htmlFor="mentor-bio">Brief bio (optional)</label>
                <textarea
                  id="mentor-bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Share a little about your experience and why you would like to mentor."
                  rows={5}
                />
              </div>
            </div>

            <p className="mentor-form-privacy">
              Please provide only information you are comfortable sharing
              with the TCA team. Submitting this form does not automatically
              confirm a mentoring placement.
            </p>

            {error && (
              <p className="mentor-form-status" role="status">
                {error}
              </p>
            )}

            <button type="submit" className="mentor-submit-btn">
              Prepare WhatsApp Message
              <span aria-hidden="true"> →</span>
            </button>

            <p className="mentor-form-footnote">
              WhatsApp will open with your message prepared. You must review
              and send it yourself to complete your enquiry.
            </p>
          </form>
        </section>

        <section className="mentor-safeguarding">
          <div className="mentor-safeguarding-icon" aria-hidden="true">
            ✓
          </div>
          <div>
            <h2>Young people deserve a safe mentoring environment.</h2>
            <p>
              TCA mentoring activities should be respectful, age-appropriate,
              and guided by appropriate safeguarding procedures. Expressions
              of interest are not automatic approval to work with teenagers.
            </p>
          </div>
        </section>

        <section className="mentor-bottom-cta">
          <span className="mentor-section-label">BE PART OF THE STORY</span>
          <h2>Someone's next chapter could be inspired by you.</h2>
          <p>
            Share what you know. Encourage a young person. Help make
            possibility feel real.
          </p>
          <a href="#mentor-form" className="mentor-primary-btn">
            Express Your Interest
            <span aria-hidden="true"> →</span>
          </a>
        </section>

        <footer className="mentor-footer">
          <Link to="/" className="mentor-footer-brand">
            TEENS CONNECT AFRICA
          </Link>
          <p>Unleashing the Genius in Teens</p>
          <div className="mentor-footer-links">
            <Link to="/volunteer">Volunteer</Link>
            <Link to="/donate">Donate</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default Mentor;
