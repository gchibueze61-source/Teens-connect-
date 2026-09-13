import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/sections/Footer";
import "./ProgramDetails.css";

type Program = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  image_url: string | null;
  status: string;
  duration: string | null;
  age_range: string | null;
  featured: boolean;
  homepage: boolean;
  registration_deadline: string | null;
  created_at: string;
};

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgram = async () => {
      if (!id) {
        setError("Program not found.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("programs")
        .select(
          `
          id,
          title,
          description,
          category,
          image_url,
          status,
          duration,
          age_range,
          featured,
          homepage,
          registration_deadline,
          created_at
        `
        )
        .eq("id", id)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        console.error("PROGRAM DETAILS ERROR:", error);
        setError("We couldn't load this program.");
        setProgram(null);
      } else if (!data) {
        setError("This program could not be found.");
        setProgram(null);
      } else {
        setProgram(data as Program);
      }

      setLoading(false);
    };

    loadProgram();
  }, [id]);

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;

    return new Date(deadline).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Navbar />

      <main className="program-details">
        {loading && (
          <section className="program-details-state">
            <div className="program-details-spinner" />
            <p>Loading program...</p>
          </section>
        )}

        {!loading && error && (
          <section className="program-details-state">
            <h1>Program unavailable</h1>
            <p>{error}</p>

            <button
              type="button"
              onClick={() => navigate("/programs")}
            >
              ← Back to Programs
            </button>
          </section>
        )}

        {!loading && !error && program && (
          <>
            <section className="program-details-hero">
              <div className="program-details-hero-inner">
                <button
                  type="button"
                  className="program-back-button"
                  onClick={() => navigate("/programs")}
                >
                  ← Back to Programs
                </button>

                <div className="program-details-hero-grid">
                  <div className="program-details-image-wrap">
                    {program.image_url ? (
                      <img
                        src={program.image_url}
                        alt={program.title}
                        className="program-details-image"
                      />
                    ) : (
                      <div className="program-details-image-placeholder">
                        Teens Connect Africa
                      </div>
                    )}
                  </div>

                  <div className="program-details-heading">
                    {program.category && (
                      <span className="program-details-category">
                        {program.category}
                      </span>
                    )}

                    {program.featured && (
                      <span className="program-details-featured">
                        Featured Program
                      </span>
                    )}

                    <h1>{program.title}</h1>

                    {program.description && (
                      <p>{program.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <section className="program-details-content">
              <div className="program-details-content-grid">
                <article className="program-details-main">
                  <span className="program-details-label">
                    ABOUT THIS PROGRAM
                  </span>

                  <h2>
                    An opportunity to{" "}
                    <span>grow, learn and make an impact.</span>
                  </h2>

                  {program.description ? (
                    <div className="program-details-description">
                      {program.description
                        .split(/\r?\n/)
                        .map((paragraph, index) =>
                          paragraph.trim() ? (
                            <p key={index}>{paragraph}</p>
                          ) : null
                        )}
                    </div>
                  ) : (
                    <p className="program-details-empty-description">
                      More information about this program will be available
                      soon.
                    </p>
                  )}
                </article>

                <aside className="program-details-sidebar">
                  <div className="program-details-info-card">
                    <h3>Program Information</h3>

                    {program.category && (
                      <div className="program-info-row">
                        <span>Category</span>
                        <strong>{program.category}</strong>
                      </div>
                    )}

                    {program.duration && (
                      <div className="program-info-row">
                        <span>Duration</span>
                        <strong>{program.duration}</strong>
                      </div>
                    )}

                    {program.age_range && (
                      <div className="program-info-row">
                        <span>Age Range</span>
                        <strong>{program.age_range}</strong>
                      </div>
                    )}

                    {program.registration_deadline && (
                      <div className="program-info-row">
                        <span>Registration Deadline</span>
                        <strong>
                          {formatDeadline(
                            program.registration_deadline
                          )}
                        </strong>
                      </div>
                    )}

                    <button
                      type="button"
                      className="program-register-button"
                      onClick={() => navigate("/register")}
                    >
                      Join Community
                      <span>→</span>
                    </button>

                    <p className="program-register-note">
                      Join the Teens Connect Africa community to stay connected
                      to our programs and opportunities.
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
};

export default ProgramDetails;