import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Donation.css";

const Donation = () => {
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const name = formData.get("name")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || "";
    const amount = formData.get("amount")?.toString().trim() || "";
    const purpose = formData.get("purpose")?.toString().trim() || "";
    const message = formData.get("message")?.toString().trim() || "";

    const whatsappMessage = `
Hello Teens Connect Africa,

I would like to make a donation.

Donation Details:
Name: ${name}
Email: ${email}
Phone: ${phone}
Amount: ₦${amount}
Purpose: ${purpose}

Additional Message:
${message || "None"}

I would like to discuss the donation and the next steps.

Thank you.
    `.trim();

    const adminWhatsAppNumber = "+2348133384466"; // Replace with the actual admin WhatsApp number

    const whatsappUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setSubmitted(true);
  };

  return (
    <main className="donation-page">
      <button
        type="button"
        className="return-home-button"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <section className="donation-hero">
        <div className="donation-hero-content">
          <span className="donation-label">SUPPORT OUR MISSION</span>

          <h1>Make a Difference</h1>

          <p>
            Your support helps Teens Connect Africa create opportunities,
            empower young people, and build stronger communities across Africa.
          </p>
        </div>
      </section>

      <section className="donation-section">
        <div className="donation-info">
          <span className="section-label">DONATE</span>

          <h2>Support Teens Connect Africa</h2>

          <p>
            Every contribution helps us provide programs, resources,
            opportunities, and meaningful experiences for young people.
          </p>

          <div className="donation-impact">
            <div className="impact-card">
              <h3>Youth Development</h3>
              <p>
                Support programs that help young people develop their skills
                and confidence.
              </p>
            </div>

            <div className="impact-card">
              <h3>Community Impact</h3>
              <p>
                Help us create initiatives that make a positive difference in
                communities.
              </p>
            </div>

            <div className="impact-card">
              <h3>Future Opportunities</h3>
              <p>
                Help connect young people with opportunities to learn, grow,
                and contribute.
              </p>
            </div>
          </div>
        </div>

        <div className="donation-form-container">
          <h2>Donation Information</h2>

          {submitted ? (
            <div className="donation-success">
              <h3>Thank You!</h3>

              <p>
                Your donation details have been prepared and WhatsApp should
                now be open for further discussion with the Teens Connect
                Africa admin.
              </p>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
              >
                Make Another Donation
              </button>
            </div>
          ) : (
            <form className="donation-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="donor-name">Full Name</label>
                <input
                  id="donor-name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donor-email">Email Address</label>
                <input
                  id="donor-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donor-phone">Phone Number</label>
                <input
                  id="donor-phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donation-amount">Donation Amount</label>
                <input
                  id="donation-amount"
                  name="amount"
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="donation-purpose">
                  Donation Purpose
                </label>

                <select
                  id="donation-purpose"
                  name="purpose"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select a purpose
                  </option>

                  <option value="General Support">
                    General Support
                  </option>

                  <option value="Youth Development">
                    Youth Development
                  </option>

                  <option value="Community Programs">
                    Community Programs
                  </option>

                  <option value="Education">
                    Education
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="donation-message">
                  Message
                </label>

                <textarea
                  id="donation-message"
                  name="message"
                  rows={5}
                  placeholder="Write a message or note (optional)"
                />
              </div>

              <button
                type="submit"
                className="donation-submit"
              >
                Continue with Donation
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default Donation;