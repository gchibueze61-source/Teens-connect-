import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
  FaTiktok,
  FaLocationDot,
  FaPhone,
  FaEnvelope,
  FaCalendarDays,
} from "react-icons/fa6";
import "./ContactPage.css";

const socialLinks = [
  {
    name: "Facebook",
    icon: <FaFacebookF />,
    url: "https://share.google/sXvqR78SrNSWoMjBZ",
  },
  {
    name: "Instagram",
    icon: <FaInstagram />,
    url: "https://www.instagram.com/teensconnectafrica/",
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedinIn />,
    url: "https://www.linkedin.com/company/teens-connect-africa/",
  },
  {
    name: "YouTube",
    icon: <FaYoutube />,
    url: "https://youtube.com/@teensconnectafrica",
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp />,
    url: "https://wa.me/2349025489850",
  },
  {
    name: "TikTok",
    icon: <FaTiktok />,
    url: "https://www.tiktok.com/@teensconnectafrica",
  },
];

const ContactPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(
      ".contact-page-animate"
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => {
        element.classList.add("contact-page-visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("contact-page-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;

    const whatsappMessage = `
Hello Teens Connect Africa,

I would like to get in touch.

Name: ${name}

Email: ${email}

Subject: ${subject}

Message:
${message}
`;

    const whatsappUrl =
      `https://wa.me/2349025489850?text=${encodeURIComponent(
        whatsappMessage
      )}`;

    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    form.reset();
  };

  return (
    <main className="contact-page">

      {/* HERO */}
      <section className="contact-page-hero">
        <div className="contact-page-hero-inner">

          <button
            type="button"
            className="contact-page-back contact-page-animate"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

          <span className="contact-page-eyebrow contact-page-animate">
            GET IN TOUCH
          </span>

          <h1 className="contact-page-animate contact-delay-1">
            Let's start a
            <span> conversation.</span>
          </h1>

          <p className="contact-page-animate contact-delay-2">
            Have a question, want to join our community, or interested
            in working with Teens Connect Africa? We'd love to hear from you.
          </p>

        </div>
      </section>


      {/* CONTACT INFORMATION */}
      <section className="contact-page-information">
        <div className="contact-page-container">

          <div className="contact-information-heading contact-page-animate">
            <span>CONTACT US</span>

            <h2>
              We're always happy
              <strong> to hear from you.</strong>
            </h2>
          </div>


          <div className="contact-information-grid">

            {/* LOCATION */}
            <article className="contact-information-card contact-page-animate">

              <div className="contact-information-icon">
                <FaLocationDot />
              </div>

              <div>
                <span>LOCATION</span>

                <h3>Our Location</h3>

                <p>Abuja, Nigeria</p>

                <a
                  href="https://maps.app.goo.gl/tkAdJB4gF4t8qyyg8?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-link"
                >
                  View on Google Maps →
                </a>
              </div>

            </article>


            {/* EMAIL */}
            <article className="contact-information-card contact-page-animate contact-delay-1">

              <div className="contact-information-icon">
                <FaEnvelope />
              </div>

              <div>
                <span>EMAIL</span>

                <h3>Email Us</h3>

                <a
                  href="mailto:teensconnecta@gmail.com"
                  className="contact-information-link"
                >
                  teensconnecta@gmail.com
                </a>
              </div>

            </article>


            {/* PHONE */}
            <article className="contact-information-card contact-page-animate contact-delay-2">

              <div className="contact-information-icon">
                <FaPhone />
              </div>

              <div>
                <span>PHONE</span>

                <h3>Call Us</h3>

                <a
                  href="tel:+2349025489850"
                  className="contact-information-link"
                >
                  +234 902 548 9850
                </a>

                <a
                  href="tel:+2348133384466"
                  className="contact-information-link"
                >
                  +234 813 338 4466
                </a>

                <a
                  href="tel:+2348062772493"
                  className="contact-information-link"
                >
                  +234 806 2772493
                </a>
              </div>

            </article>


            {/* MEETING */}
            <article className="contact-information-card contact-page-animate contact-delay-3">

              <div className="contact-information-icon">
                <FaCalendarDays />
              </div>

              <div>
                <span>MEET WITH US</span>

                <h3>Monthly Meeting</h3>

                <p>Every Third Sunday</p>

                <a
                  href="https://wa.me/2349025489850"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-link"
                >
                  Ask about the next meeting →
                </a>
              </div>

            </article>

          </div>

        </div>
      </section>


      {/* FORM + SOCIAL */}
      <section className="contact-page-connect">
        <div className="contact-page-container contact-connect-grid">

          {/* LEFT */}
          <div className="contact-connect-intro contact-page-animate">

            <span>START A CONVERSATION</span>

            <h2>
              Tell us
              <strong> what's on your mind.</strong>
            </h2>

            <p>
              Whether you have a question, want to collaborate, or simply
              want to learn more about Teens Connect Africa, send us a message.
            </p>


            <div className="contact-page-social">

              <h3>Follow Teens Connect Africa</h3>

              <div className="contact-page-social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Visit our ${social.name} page`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>

            </div>

          </div>


          {/* FORM */}
          <form
            className="contact-page-form contact-page-animate contact-delay-1"
            onSubmit={handleSubmit}
          >

            <div className="contact-form-row">

              <div className="contact-form-group">
                <label htmlFor="contact-page-name">
                  Full Name
                </label>

                <input
                  id="contact-page-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="contact-form-group">
                <label htmlFor="contact-page-email">
                  Email Address
                </label>

                <input
                  id="contact-page-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                />
              </div>

            </div>


            <div className="contact-form-group">
              <label htmlFor="contact-page-subject">
                Subject
              </label>

              <input
                id="contact-page-subject"
                name="subject"
                type="text"
                placeholder="What would you like to talk about?"
                required
              />
            </div>


            <div className="contact-form-group">
              <label htmlFor="contact-page-message">
                Message
              </label>

              <textarea
                id="contact-page-message"
                name="message"
                rows={7}
                placeholder="Write your message here..."
                required
              />
            </div>


            <button
              type="submit"
              className="contact-page-submit"
            >
              Send Message
              <span>→</span>
            </button>

          </form>

        </div>
      </section>


      {/* FINAL CTA */}
      <section className="contact-page-cta">
        <div className="contact-page-container">

          <div className="contact-page-cta-inner contact-page-animate">

            <span>JOIN THE COMMUNITY</span>

            <h2>
              Want to be part of
              <strong> Teens Connect Africa?</strong>
            </h2>

            <p>
              Connect with other teenagers, discover opportunities and
              become part of a community committed to growth.
            </p>

            <button
              type="button"
              onClick={() => navigate("/register")}
            >
              Join Our Community →
            </button>

          </div>

        </div>
      </section>

    </main>
  );
};

export default ContactPage;