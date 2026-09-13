import { useEffect } from "react";
import "./Contact.css";

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

export default function Contact() {

  /*
   * Scroll reveal animation.
   */
  useEffect(() => {
    const elements =
      document.querySelectorAll(
        ".contact .contact-reveal"
      );

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      elements.forEach((element) => {
        element.classList.add(
          "contact-revealed"
        );
      });

      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
              entry.isIntersecting
            ) {
              entry.target.classList.add(
                "contact-revealed"
              );

              observer.unobserve(
                entry.target
              );
            }
          });
        },
        {
          threshold: 0.12,
          rootMargin:
            "0px 0px -60px 0px",
        }
      );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const form =
      event.currentTarget;

    const formData =
      new FormData(form);

    const name =
      formData.get("name") as string;

    const email =
      formData.get("email") as string;

    const subject =
      formData.get("subject") as string;

    const message =
      formData.get("message") as string;

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
    <section
      className="contact"
      id="contact"
    >
      <div className="contact-container">

        {/* SECTION HEADER */}

        <div className="section-header contact-reveal">

          <span className="contact-label">
            GET IN TOUCH
          </span>

          <h2>
            Let's Connect
          </h2>

          <p>
            Have a question, want to join our
            community, or interested in working
            with Teens Connect Africa? We'd love
            to hear from you.
          </p>

        </div>


        <div className="contact-grid">

          {/* CONTACT INFORMATION */}

          <div className="contact-details">

            {/* LOCATION */}

            <div className="contact-item contact-reveal contact-delay-1">

              <div className="contact-icon">
                <FaLocationDot />
              </div>

              <div>
                <h3>
                  Our Location
                </h3>

                <a
                  href="https://maps.app.goo.gl/tkAdJB4gF4t8qyyg8?g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-location-button"
                >
                  <FaLocationDot />
                  Click to View Our Location
                </a>

                <p>
                  Abuja, Nigeria
                </p>
              </div>

            </div>


            {/* EMAIL */}

            <div className="contact-item contact-reveal contact-delay-2">

              <div className="contact-icon">
                <FaEnvelope />
              </div>

              <div>
                <h3>
                  Email Us
                </h3>

                <p>
                  teensconnecta@gmail.com
                </p>
              </div>

            </div>


            {/* PHONE */}

            <div className="contact-item contact-reveal contact-delay-3">

              <div className="contact-icon">
                <FaPhone />
              </div>

              <div>
                <h3>
                  Call Us
                </h3>

                <p>
                  +234 902 548 9850
                </p>

                <p>
                  +234 813 338 4466
                </p>

                <p>
                  +234 806 2772493
                </p>
              </div>

            </div>


            {/* MEETING */}

            <div className="contact-item contact-reveal contact-delay-4">

              <div className="contact-icon">
                <FaCalendarDays />
              </div>

              <div>
                <h3>
                  Monthly Meeting
                </h3>

                <p>
                  Every Third Sunday
                </p>
              </div>

            </div>


            {/* SOCIAL MEDIA */}

            <div className="social-section contact-reveal contact-delay-4">

              <h3>
                Follow Us
              </h3>

              <div className="social-links">

                {socialLinks.map(
                  (social, index) => (
                    <a
                      key={
                        social.name
                      }
                      href={
                        social.url
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit our ${social.name} page`}
                      className={`social-link social-delay-${Math.min(
                        index + 1,
                        6
                      )}`}
                    >
                      {social.icon}
                    </a>
                  )
                )}

              </div>

            </div>

          </div>


          {/* CONTACT FORM */}

          <form
            className="contact-form contact-reveal contact-reveal-right"
            onSubmit={
              handleSubmit
            }
          >

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="subject">
                Subject
              </label>

              <input
                id="subject"
                name="subject"
                type="text"
                placeholder="What would you like to talk about?"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="message">
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Write your message here..."
                required
              />

            </div>


            <button
              type="submit"
              className="contact-submit"
            >
              <span>
                Send Message
              </span>

              <span className="contact-submit-arrow">
                →
              </span>
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}