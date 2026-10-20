
import { useEffect, type FormEvent } from "react";
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

const contactEmails = [
  {
    label: "General Enquiries",
    email: "teensconnecta@gmail.com",
  },
  {
    label: "Executive Director",
    email: "obizeanne@gmail.com",
  },
  {
    label: "Programme Director",
    email: "olumbamerit@gmail.com",
  },
];

const locations = [
  {
    name: "Zuba, Abuja",
    description: "Primary hub · Federal Capital Territory",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Zuba%2C+Abuja%2C+Nigeria",
    embedUrl:
      "https://maps.google.com/maps?q=Zuba%2C%20Abuja%2C%20Nigeria&output=embed",
  },
  {
    name: "Egbeda, Lagos",
    description: "Lagos hub",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Egbeda%2C+Lagos%2C+Nigeria",
    embedUrl:
      "https://maps.google.com/maps?q=Egbeda%2C%20Lagos%2C%20Nigeria&output=embed",
  },
];

const subjectOptions = [
  "General Enquiry",
  "Volunteer",
  "Mentor",
  "Partnership",
  "Media & Press",
  "Donation",
  "Other",
];

export default function Contact() {
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".contact .contact-reveal"
    );

    if (typeof IntersectionObserver === "undefined") {
      elements.forEach((element) => {
        element.classList.add("contact-revealed");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("contact-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !subject || !message) {
      return;
    }

    const whatsappMessage = [
      "Hello Teens Connect Africa,",
      "",
      "I would like to get in touch.",
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Subject: ${subject}`,
      "",
      "Message:",
      message,
    ].join("\n");

    const whatsappUrl = `https://wa.me/2349025489850?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-container">
        <div className="section-header contact-reveal">
          <span className="contact-label">GET IN TOUCH</span>
          <h2>Let's Connect</h2>
          <p>
            Have a question, want to join our community, or interested
            in working with Teens Connect Africa? We'd love to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-details">
            <div className="contact-item contact-reveal contact-delay-1">
              <div className="contact-icon">
                <FaLocationDot />
              </div>
              <div>
                <h3>Our Hubs</h3>
                <p>
                  Connect with Teens Connect Africa through our Abuja
                  and Lagos hubs.
                </p>
                <div className="contact-hub-links">
                  {locations.map((location) => (
                    <a
                      key={location.name}
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="contact-location-button"
                    >
                      <FaLocationDot />
                      {location.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="contact-item contact-reveal contact-delay-2">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <div>
                <h3>Email Us</h3>
                {contactEmails.map((item) => (
                  <p className="contact-email-item" key={item.email}>
                    <strong>{item.label}</strong>
                    <br />
                    <a href={`mailto:${item.email}`}>{item.email}</a>
                  </p>
                ))}
              </div>
            </div>

            <div className="contact-item contact-reveal contact-delay-3">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <div>
                <h3>Call Us</h3>
                <p>
                  <a href="tel:+2349025489850">+234 902 548 9850</a>
                </p>
                <p>
                  <a href="tel:+2348133384466">+234 813 338 4466</a>
                </p>
                <p>
                  <a href="tel:+2348062772493">+234 806 277 2493</a>
                </p>
              </div>
            </div>

            <div className="contact-item contact-reveal contact-delay-4">
              <div className="contact-icon">
                <FaCalendarDays />
              </div>
              <div>
                <h3>Monthly Meeting</h3>
                <p>Every Third Sunday</p>
                <p>Please contact us to confirm meeting details.</p>
              </div>
            </div>

            <div className="social-section contact-reveal contact-delay-4">
              <h3>Follow Us</h3>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.url}
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
                ))}
              </div>
            </div>
          </div>

          <form
            className="contact-form contact-reveal contact-reveal-right"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number (Optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject</label>
              <select
                id="subject"
                name="subject"
                defaultValue=""
                required
              >
                <option value="" disabled>
                  Select a subject
                </option>
                {subjectOptions.map((subject) => (
                  <option value={subject} key={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                placeholder="Write your message here..."
                required
              />
            </div>

            <button type="submit" className="contact-submit">
              <span>Continue to WhatsApp</span>
              <span className="contact-submit-arrow" aria-hidden="true">
                →
              </span>
            </button>

            <p className="contact-form-note">
              Your message will open in WhatsApp for you to review and send.
              It is not submitted directly through this website.
            </p>
          </form>
        </div>

        <div className="contact-maps contact-reveal">
          <div className="contact-maps-header">
            <span className="contact-label">FIND US</span>
            <h2>Our Locations</h2>
            <p>Explore our Abuja and Lagos hubs on the map.</p>
          </div>

          <div className="contact-map-grid">
            {locations.map((location) => (
              <article className="contact-map-card" key={location.name}>
                <div className="contact-map-heading">
                  <div>
                    <h3>{location.name}</h3>
                    <p>{location.description}</p>
                  </div>
                  <FaLocationDot aria-hidden="true" />
                </div>

                <iframe
                  title={`Map showing ${location.name}`}
                  src={location.embedUrl}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />

                <a
                  href={location.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-directions"
                >
                  Open in Google Maps →
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
