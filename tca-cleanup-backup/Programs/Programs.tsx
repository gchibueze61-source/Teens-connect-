import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import "./Programs.css";

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

function Programs() {
  const navigate = useNavigate();

  const [programs, setPrograms] =
    useState<Program[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * Load published homepage programs
   * from Supabase.
   */
  useEffect(() => {
    const loadPrograms = async () => {
      setLoading(true);
      setError("");

      const { data, error } =
        await supabase
          .from("programs")
          .select(`
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
          `)
          .eq("status", "published")
          .eq("homepage", true)
          .order("featured", {
            ascending: false,
          })
          .order("created_at", {
            ascending: false,
          })
          .limit(3);

      if (error) {
        console.error(
          "PUBLIC PROGRAMS ERROR:",
          error
        );

        setPrograms([]);

        setError(
          "We couldn't load our programs right now."
        );
      } else {
        setPrograms(
          (data || []) as Program[]
        );
      }

      setLoading(false);
    };

    loadPrograms();
  }, []);

  /*
   * Scroll reveal animation.
   */
  useEffect(() => {
    const elements =
      document.querySelectorAll(
        ".programs .program-reveal"
      );

    if (
      typeof IntersectionObserver ===
      "undefined"
    ) {
      elements.forEach((element) => {
        element.classList.add(
          "program-revealed"
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
                "program-revealed"
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
  }, [programs]);

  const formatDeadline = (
    deadline: string | null
  ) => {
    if (!deadline) {
      return null;
    }

    return new Date(
      deadline
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  return (
    <section
      className="programs"
      id="programs"
    >
      <div className="programs-container">

        {/* =================================
            HEADER
        ================================= */}

        <div className="programs-heading program-reveal">

          <div>
            <span className="programs-label">
              WHAT WE DO
            </span>

            <h2>
              Programs designed to
              <span>
                {" "}
                help teenagers thrive.
              </span>
            </h2>
          </div>

          <p>
            Explore opportunities created to help
            teenagers develop their skills, discover
            their potential and prepare for the future.
          </p>

        </div>

        {/* =================================
            LOADING
        ================================= */}

        {loading && (
          <div className="programs-state program-reveal">
            <div className="programs-spinner" />

            <p>
              Loading programs...
            </p>
          </div>
        )}

        {/* =================================
            ERROR
        ================================= */}

        {!loading &&
          error && (
            <div className="programs-state program-reveal">
              <p>
                {error}
              </p>
            </div>
          )}

        {/* =================================
            EMPTY
        ================================= */}

        {!loading &&
          !error &&
          programs.length === 0 && (
            <div className="programs-state program-reveal">

              <h3>
                Programs coming soon
              </h3>

              <p>
                We're preparing opportunities
                for teenagers. Check back soon.
              </p>

            </div>
          )}

        {/* =================================
            PROGRAM CARDS
        ================================= */}

        {!loading &&
          !error &&
          programs.length > 0 && (
            <div className="programs-grid">

              {programs.map(
                (program, index) => (
                  <article
                    className={`program-card program-reveal program-delay-${Math.min(
                      index + 1,
                      4
                    )}`}
                    key={program.id}
                  >

                    {/* IMAGE */}

                    <div className="program-image-wrapper">

                      {program.image_url ? (
                        <img
                          src={
                            program.image_url
                          }
                          alt={
                            program.title
                          }
                          className="program-image"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="program-image-placeholder">
                          Teens Connect Africa
                        </div>
                      )}

                      {program.category && (
                        <span className="program-category">
                          {program.category}
                        </span>
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="program-content">

                      <h3>
                        {program.title}
                      </h3>

                      {program.description && (
                        <p>
                          {
                            program.description
                          }
                        </p>
                      )}

                      <div className="program-meta">

                        {program.duration && (
                          <span>
                            {
                              program.duration
                            }
                          </span>
                        )}

                        {program.age_range && (
                          <span>
                            {
                              program.age_range
                            }
                          </span>
                        )}

                      </div>

                      {program.registration_deadline && (
                        <div className="program-deadline">
                          Registration closes{" "}
                          <strong>
                            {
                              formatDeadline(
                                program.registration_deadline
                              )
                            }
                          </strong>
                        </div>
                      )}

                      <button
                        type="button"
                        className="program-learn-more"
                        onClick={() =>
                          navigate(
                            `/programs/${program.id}`
                          )
                        }
                      >
                        Learn More
                        <span>
                          →
                        </span>
                      </button>

                    </div>

                  </article>
                )
              )}

            </div>
          )}

        {/* =================================
            VIEW ALL
        ================================= */}

        <div className="programs-footer program-reveal">

          <button
            type="button"
            className="programs-view-all"
            onClick={() =>
              navigate(
                "/programs"
              )
            }
          >
            View All Programs
            <span>
              →
            </span>
          </button>

        </div>

      </div>
    </section>
  );
}

export default Programs;