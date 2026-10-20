import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Donation.css";

type DonationOption = {
  amount: number | "custom";
  title: string;
  description: string;
  impact: string;
};

const donationOptions: DonationOption[] = [
  {
    amount: 5000,
    title: "A sense of belonging",
    description: "TCA-branded T-shirt for one teenager.",
    impact: "Helps a teenager feel included and connected.",
  },
  {
    amount: 20000,
    title: "A welcoming session",
    description: "Light refreshments for a full mentorship session.",
    impact: "Helps make mentorship sessions welcoming and inclusive.",
  },
  {
    amount: 68000,
    title: "Support education",
    description: "WAEC examination fees for one student.",
    impact: "Helps a teenager stay on track with their education.",
  },
  {
    amount: 150000,
    title: "Keep programmes running",
    description: "Annual venue rent for monthly meetings.",
    impact: "Supports a consistent space for TCA activities.",
  },
  {
    amount: 300000,
    title: "Strengthen digital learning",
    description: "A laptop for administration and online learning.",
    impact: "Supports content delivery, outreach and programme management.",
  },
  {
    amount: 600000,
    title: "Sustain youth development",
    description: "Annual salary support for one staff member.",
    impact: "Helps sustain dedicated support for teenagers.",
  },
  {
    amount: "custom",
    title: "Make a larger impact",
    description: "Sponsor a full TDSAP skills training cohort.",
    impact: "Discuss a custom contribution to support skills training.",
  },
];

const Donation = () => {
  const navigate = useNavigate();

  const [selectedAmount, setSelectedAmount] = useState<string>("20000");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [submitted, setSubmitted] = useState(false);

  const amount =
    selectedAmount === "custom" ? customAmount : selectedAmount;

  const formattedAmount = amount
    ? `₦${Number(amount).toLocaleString("en-NG")}`
    : "₦0";

  const handleAmountSelection = (value: number | "custom") => {
    setSelectedAmount(String(value));

    if (value !== "custom") {
      setCustomAmount("");
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount < 1) {
      window.alert("Please enter a valid donation amount.");
      return;
    }

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const purpose = String(formData.get("purpose") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const donationFrequency =
      frequency === "monthly" ? "Monthly recurring preference" : "One-time";

    const whatsappMessage = [
      "Hello Teens Connect Africa,",
      "",
      "I would like to discuss making a donation.",
      "",
      "DONATION DETAILS",
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Amount: ${formattedAmount}`,
      `Donation preference: ${donationFrequency}`,
      `Purpose: ${purpose}`,
      "",
      "Additional message:",
      message || "None",
      "",
      "Please let me know the next steps for completing this donation.",
      "",
      "Thank you.",
    ].join("\n");

    // WhatsApp is used for discussion, not as a payment gateway.
    // The monthly option records the donor's preference; it does not
    // automatically charge the donor every month.
    const adminWhatsAppNumber = "2348133384466";

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
        className="donation-back-button"
        onClick={() => navigate("/")}
      >
        <span aria-hidden="true">←</span> Back to Home
      </button>

      <section className="donation-hero">
        <div className="donation-container donation-hero-grid">
          <div className="donation-hero-content">
            <span className="donation-eyebrow">
              SUPPORT A TEENAGER
            </span>

            <h1>
              Your Generosity Gives a Teenager a{" "}
              <span>Fighting Chance.</span>
            </h1>

            <p>
              Every teenager deserves the opportunity to learn, discover
              their talents, and build a future filled with possibility.
              Your contribution helps Teens Connect Africa make those
              opportunities real.
            </p>

            <a href="#donation-options" className="donation-primary-button">
              Choose Your Contribution
              <span aria-hidden="true">↓</span>
            </a>

            <p className="donation-hero-note">
              Unleashing the Genius in Teens
            </p>
          </div>

          <div className="donation-hero-card">
            <span className="donation-hero-card-icon" aria-hidden="true">
              ✦
            </span>

            <p className="donation-card-label">YOUR CONTRIBUTION MATTERS</p>

            <h2>Small acts of generosity can open big doors.</h2>

            <p>
              Support mentorship, education, skills development and
              community programmes for teenagers.
            </p>

            <div className="donation-card-divider" />

            <div className="donation-card-footer">
              <span>Education</span>
              <span>Mentorship</span>
              <span>Opportunity</span>
            </div>
          </div>
        </div>
      </section>

      <section className="donation-introduction">
        <div className="donation-container donation-intro-grid">
          <div>
            <span className="donation-section-label">WHY YOUR GIFT MATTERS</span>

            <h2>Help a teenager discover what is possible.</h2>
          </div>

          <div className="donation-intro-copy">
            <p>
              Teens Connect Africa is dedicated to empowering teenagers
              through mentorship, talent development, skills acquisition
              and community engagement.
            </p>

            <p>
              Every contribution helps support the resources and
              opportunities that enable young people to learn, grow and
              participate meaningfully in their communities.
            </p>
          </div>
        </div>
      </section>

      <section
        className="donation-options-section"
        id="donation-options"
      >
        <div className="donation-container">
          <div className="donation-section-heading">
            <span className="donation-section-label">
              CHOOSE YOUR IMPACT
            </span>

            <h2>Every contribution has a purpose.</h2>

            <p>
              Select a contribution below to see what it can support.
              You can also choose a custom amount.
            </p>
          </div>

          <div className="donation-impact-grid">
            {donationOptions.map((option) => {
              const optionValue = String(option.amount);
              const isSelected = selectedAmount === optionValue;

              return (
                <button
                  type="button"
                  key={optionValue}
                  className={`donation-impact-card ${
                    isSelected ? "selected" : ""
                  }`}
                  onClick={() => handleAmountSelection(option.amount)}
                  aria-pressed={isSelected}
                >
                  <span className="donation-impact-check" aria-hidden="true">
                    {isSelected ? "✓" : "+"}
                  </span>

                  <span className="donation-impact-amount">
                    {option.amount === "custom"
                      ? "Custom"
                      : `₦${option.amount.toLocaleString("en-NG")}`}
                  </span>

                  <span className="donation-impact-title">
                    {option.title}
                  </span>

                  <span className="donation-impact-description">
                    {option.description}
                  </span>

                  <span className="donation-impact-result">
                    {option.impact}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedAmount === "custom" && (
            <div className="donation-custom-amount">
              <label htmlFor="custom-donation-amount">
                Enter your contribution (₦)
              </label>

              <input
                id="custom-donation-amount"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                placeholder="Enter your amount"
                value={customAmount}
                onChange={(event) => setCustomAmount(event.target.value)}
                required
              />

              <p>
                Custom contributions can also be discussed with TCA to
                support a full TDSAP skills training cohort.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="donation-form-section" id="donation-form">
        <div className="donation-container donation-form-layout">
          <div className="donation-form-intro">
            <span className="donation-section-label">TAKE THE NEXT STEP</span>

            <h2>Let’s make your contribution count.</h2>

            <p>
              Share your details so the TCA team can discuss your
              contribution and explain the next steps.
            </p>

            <div className="donation-selected-summary">
              <span>Your selected contribution</span>
              <strong>{formattedAmount}</strong>
              <span>
                {frequency === "monthly"
                  ? "Monthly donation preference"
                  : "One-time donation"}
              </span>
            </div>

            <div className="donation-contact-note">
              <span aria-hidden="true">ⓘ</span>
              <p>
                This form opens a WhatsApp conversation with TCA. It does
                not collect payment or automatically charge your account.
              </p>
            </div>
          </div>

          <div className="donation-form-card">
            {submitted ? (
              <div className="donation-success" role="status">
                <span className="donation-success-icon" aria-hidden="true">
                  ✓
                </span>

                <h3>Thank you for supporting teenagers!</h3>

                <p>
                  Your donation details have been prepared. If WhatsApp
                  opened successfully, send the prepared message to the
                  TCA team to discuss the next steps.
                </p>

                <p className="donation-success-reminder">
                  Your contribution is not yet a completed payment.
                </p>

                <button
                  type="button"
                  className="donation-primary-button"
                  onClick={() => setSubmitted(false)}
                >
                  Make Another Enquiry
                </button>
              </div>
            ) : (
              <form className="donation-form" onSubmit={handleSubmit}>
                <h3>Donation Information</h3>

                <p className="donation-form-description">
                  Complete the details below to continue via WhatsApp.
                </p>

                <fieldset className="donation-frequency-fieldset">
                  <legend>How would you like to give?</legend>

                  <div className="donation-frequency-options">
                    <button
                      type="button"
                      className={
                        frequency === "once" ? "active" : ""
                      }
                      aria-pressed={frequency === "once"}
                      onClick={() => setFrequency("once")}
                    >
                      <span aria-hidden="true">○</span>
                      One-time
                    </button>

                    <button
                      type="button"
                      className={
                        frequency === "monthly" ? "active" : ""
                      }
                      aria-pressed={frequency === "monthly"}
                      onClick={() => setFrequency("monthly")}
                    >
                      <span aria-hidden="true">↻</span>
                      Monthly
                    </button>
                  </div>

                  {frequency === "monthly" && (
                    <p className="donation-monthly-note">
                      Monthly is your preferred giving frequency. Automatic
                      recurring payments are not active on this page.
                    </p>
                  )}
                </fieldset>

                <div className="donation-form-row">
                  <div className="donation-form-group">
                    <label htmlFor="donor-name">Full Name *</label>
                    <input
                      id="donor-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="donation-form-group">
                    <label htmlFor="donor-phone">Phone Number *</label>
                    <input
                      id="donor-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="Your phone number"
                      required
                    />
                  </div>
                </div>

                <div className="donation-form-group">
                  <label htmlFor="donor-email">Email Address *</label>
                  <input
                    id="donor-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="donation-form-group">
                  <label htmlFor="donation-purpose">Donation Purpose *</label>

                  <select
                    id="donation-purpose"
                    name="purpose"
                    defaultValue="General Support"
                    required
                  >
                    <option value="General Support">General Support</option>
                    <option value="Monthly Mentorship">
                      Monthly Mentorship
                    </option>
                    <option value="Education and WAEC Fees">
                      Education and WAEC Fees
                    </option>
                    <option value="Talent Development and Skills Acquisition">
                      Talent Development and Skills Acquisition (TDSAP)
                    </option>
                    <option value="Community Service">
                      Community Service
                    </option>
                    <option value="Girl Emerge Project">
                      Girl Emerge Project
                    </option>
                    <option value="Equipment and Digital Learning">
                      Equipment and Digital Learning
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="donation-form-group">
                  <label htmlFor="donation-message">
                    Additional Message
                  </label>

                  <textarea
                    id="donation-message"
                    name="message"
                    rows={4}
                    placeholder="Share any questions or details (optional)"
                  />
                </div>

                <div className="donation-form-total">
                  <span>Contribution amount</span>
                  <strong>{formattedAmount}</strong>
                </div>

                <button
                  type="submit"
                  className="donation-submit-button"
                  disabled={
                    !amount ||
                    !Number.isFinite(Number(amount)) ||
                    Number(amount) < 1
                  }
                >
                  Continue via WhatsApp
                  <span aria-hidden="true">↗</span>
                </button>

                <p className="donation-form-disclaimer">
                  Continuing opens WhatsApp to discuss your contribution.
                  No payment is taken through this form.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="donation-closing">
        <div className="donation-container">
          <span className="donation-section-label">BE PART OF THE CHANGE</span>

          <h2>Invest in potential. Encourage purpose. Create opportunity.</h2>

          <p>
            Together, we can help more teenagers access the mentorship,
            skills and support they need to shape their futures.
          </p>

          <a href="#donation-options" className="donation-primary-button">
            Choose Your Contribution
          </a>
        </div>
      </section>
    </main>
  );
};

export default Donation;