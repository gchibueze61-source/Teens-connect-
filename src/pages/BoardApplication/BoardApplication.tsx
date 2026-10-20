import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./BoardApplication.css";

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  short_bio: string;
  full_bio: string;
  education: string;
  professional_background: string;
  skills: string;
  areas_of_expertise: string;
  linkedin_url: string;
  website_url: string;
  why_join_board: string;
}

const initialForm: FormData = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  state: "",
  city: "",
  short_bio: "",
  full_bio: "",
  education: "",
  professional_background: "",
  skills: "",
  areas_of_expertise: "",
  linkedin_url: "",
  website_url: "",
  why_join_board: "",
};

const BoardApplication: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    const {
      full_name,
      email,
      phone,
      country,
      state,
      city,
      short_bio,
      full_bio,
      education,
      professional_background,
      skills,
      areas_of_expertise,
      linkedin_url,
      website_url,
      why_join_board,
    } = form;

    if (
      !full_name.trim() ||
      !email.trim() ||
      !country.trim() ||
      !short_bio.trim() ||
      !why_join_board.trim()
    ) {
      setError(
        "Please complete all required fields before submitting."
      );
      setSubmitting(false);
      return;
    }

    const { error: submitError } = await supabase
      .from("board_member_applications")
      .insert({
        full_name: full_name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || null,
        country: country.trim(),
        state: state.trim() || null,
        city: city.trim() || null,
        short_bio: short_bio.trim(),
        full_bio: full_bio.trim() || null,
        education: education.trim() || null,
        professional_background:
          professional_background.trim() || null,
        skills: skills.trim() || null,
        areas_of_expertise:
          areas_of_expertise.trim() || null,
        linkedin_url: linkedin_url.trim() || null,
        website_url: website_url.trim() || null,
        why_join_board: why_join_board.trim(),
        status: "pending",
      });

    if (submitError) {
      console.error(submitError);
      setError(
        "We could not submit your application. Please try again."
      );
      setSubmitting(false);
      return;
    }

    setForm(initialForm);
    setSuccess(
      "Your Board Member application has been submitted successfully. The TCA team will review your information."
    );
    setSubmitting(false);
  };

  return (
    <main className="board-application-page">
      <button
        type="button"
        className="return-home-button"
        onClick={() => navigate("/volunteer")}
      >
        ← Back to Volunteer
      </button>

      <section className="board-application-hero">
        <div className="volunteer-container board-application-hero-content">
          <span className="volunteer-eyebrow">
            TEENS CONNECT AFRICA • BOARD
          </span>

          <h1>
            Become part of the
            <span> TCA Board.</span>
          </h1>

          <p>
            Tell us about yourself, your experience, your skills,
            and how you would like to contribute to the leadership
            and growth of Teens Connect Africa.
          </p>
        </div>
      </section>

      <section className="board-application-section">
        <div className="volunteer-container">
          <div className="board-application-layout">
            <div className="board-application-intro">
              <span>BOARD APPLICATION</span>

              <h2>
                Your experience can help shape the future.
              </h2>

              <p>
                Board membership is a position of responsibility.
                We want to understand your background, experience,
                expertise, and the contribution you believe you can
                make to Teens Connect Africa.
              </p>

              <div className="board-application-note">
                <strong>What happens next?</strong>

                <p>
                  Your application will be reviewed by the TCA
                  administration. Approval is required before you
                  become an official Board Member.
                </p>
              </div>

              <div className="board-application-steps">
                <div>
                  <span>01</span>
                  <p>Submit your information</p>
                </div>

                <div>
                  <span>02</span>
                  <p>Admin reviews your application</p>
                </div>

                <div>
                  <span>03</span>
                  <p>Approved applicants receive access</p>
                </div>

                <div>
                  <span>04</span>
                  <p>Complete your Board profile</p>
                </div>
              </div>
            </div>

            <div className="board-application-form-card">
              <div className="board-application-form-heading">
                <span>APPLICATION FORM</span>
                <h2>Tell us about yourself</h2>
                <p>
                  Fields marked with * are required.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="board-form-grid">
                  <div className="board-form-field">
                    <label htmlFor="full_name">
                      Full Name *
                    </label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      value={form.full_name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="phone">
                      Phone / WhatsApp
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+234..."
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="country">
                      Country *
                    </label>
                    <input
                      id="country"
                      name="country"
                      type="text"
                      value={form.country}
                      onChange={handleChange}
                      placeholder="Country"
                      required
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="state">
                      State / Region
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State or region"
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="city">
                      City / Community
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City or community"
                    />
                  </div>
                </div>

                <div className="board-form-field">
                  <label htmlFor="short_bio">
                    Short Biography *
                  </label>
                  <textarea
                    id="short_bio"
                    name="short_bio"
                    value={form.short_bio}
                    onChange={handleChange}
                    placeholder="Give us a brief introduction about yourself."
                    rows={4}
                    maxLength={1000}
                    required
                  />
                </div>

                <div className="board-form-field">
                  <label htmlFor="full_bio">
                    Full Biography
                  </label>
                  <textarea
                    id="full_bio"
                    name="full_bio"
                    value={form.full_bio}
                    onChange={handleChange}
                    placeholder="Tell us more about your background and journey."
                    rows={6}
                  />
                </div>

                <div className="board-form-field">
                  <label htmlFor="education">
                    Education
                  </label>
                  <textarea
                    id="education"
                    name="education"
                    value={form.education}
                    onChange={handleChange}
                    placeholder="Education, certifications or relevant training."
                    rows={4}
                  />
                </div>

                <div className="board-form-field">
                  <label htmlFor="professional_background">
                    Professional Background
                  </label>
                  <textarea
                    id="professional_background"
                    name="professional_background"
                    value={form.professional_background}
                    onChange={handleChange}
                    placeholder="Your professional experience and previous work."
                    rows={5}
                  />
                </div>

                <div className="board-form-grid">
                  <div className="board-form-field">
                    <label htmlFor="skills">Skills</label>
                    <textarea
                      id="skills"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      placeholder="What skills do you bring?"
                      rows={4}
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="areas_of_expertise">
                      Areas of Expertise
                    </label>
                    <textarea
                      id="areas_of_expertise"
                      name="areas_of_expertise"
                      value={form.areas_of_expertise}
                      onChange={handleChange}
                      placeholder="Your main areas of expertise."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="board-form-grid">
                  <div className="board-form-field">
                    <label htmlFor="linkedin_url">
                      LinkedIn URL
                    </label>
                    <input
                      id="linkedin_url"
                      name="linkedin_url"
                      type="url"
                      value={form.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="board-form-field">
                    <label htmlFor="website_url">
                      Website URL
                    </label>
                    <input
                      id="website_url"
                      name="website_url"
                      type="url"
                      value={form.website_url}
                      onChange={handleChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="board-form-field">
                  <label htmlFor="why_join_board">
                    Why do you want to join the TCA Board? *
                  </label>
                  <textarea
                    id="why_join_board"
                    name="why_join_board"
                    value={form.why_join_board}
                    onChange={handleChange}
                    placeholder="Tell us why you would like to serve on the Board and what you hope to contribute."
                    rows={7}
                    required
                  />
                </div>

                {error && (
                  <div className="board-form-message error">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="board-form-message success">
                    {success}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-btn board-submit-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Submitting Application..."
                    : "Submit Board Application"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BoardApplication;