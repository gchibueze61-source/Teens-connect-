import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/sections/Footer";
import "./ProgramsPage.css";

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

const ProgramsPage = () => {
  const navigate = useNavigate();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const loadPrograms = async () => {
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
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("PROGRAMS PAGE ERROR:", error);
        setError("We couldn't load our programs right now.");
        setPrograms([]);
      } else {
        setPrograms((data || []) as Program[]);
      }

      setLoading(false);
    };

    loadPrograms();
  }, []);

  const categories = useMemo(() => {
    const values = programs
      .map((program) => program.category)
      .filter((value): value is string => Boolean(value));

    return ["All", ...Array.from(new Set(values))];
  }, [programs]);

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        program.title.toLowerCase().includes(query) ||
        program.description?.toLowerCase().includes(query) ||
        program.category?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" || program.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [programs, search, category]);

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

      <main className="programs-page">
        <section className="programs-page-hero">
          <div className="programs-page-hero-inner">
            <span className="programs-page-label">OUR PROGRAMS</span>

            <h1>
              Opportunities designed to help teenagers{" "}
              <span>grow and thrive.</span>
            </h1>

            <p>
              Explore our programs, initiatives and opportunities created to
              help teenagers develop skills, discover their potential and make
              meaningful impact.
            </p>
          </div>
        </section>

        <section className="programs-directory">
          <div className="programs-directory-container">
            <div className="programs-directory-top">
              <div>
                <span className="programs-directory-label">
                  EXPLORE OPPORTUNITIES
                </span>

                <h2>Find a program for you.</h2>
              </div>

              <p>
                Browse our available programs and discover an opportunity that
                matches your interests and goals.
              </p>
            </div>

            <div className="programs-filters">
              <div className="program-search">
                <span aria-hidden="true">⌕</span>

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search programs..."
                  aria-label="Search programs"
                />
              </div>

              <div className="program-categories">
                {categories.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={category === item ? "active" : ""}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="programs-page-state">
                <div className="programs-page-spinner" />
                <p>Loading programs...</p>
              </div>
            )}

            {!loading && error && (
              <div className="programs-page-state">
                <h3>Something went wrong</h3>
                <p>{error}</p>
              </div>
            )}

            {!loading &&
              !error &&
              filteredPrograms.length === 0 && (
                <div className="programs-page-state">
                  <h3>No programs found</h3>
                  <p>
                    Try another search term or choose a different category.
                  </p>
                </div>
              )}

            {!loading &&
              !error &&
              filteredPrograms.length > 0 && (
                <div className="programs-page-grid">
                  {filteredPrograms.map((program) => (
                    <article
                      className="program-page-card"
                      key={program.id}
                    >
                      <div className="program-page-image-wrapper">
                        {program.image_url ? (
                          <img
                            src={program.image_url}
                            alt={program.title}
                            className="program-page-image"
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <div className="program-page-image-placeholder">
                            <span>Teens Connect Africa</span>
                          </div>
                        )}

                        {program.category && (
                          <span className="program-page-category">
                            {program.category}
                          </span>
                        )}

                        {program.featured && (
                          <span className="program-page-featured">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="program-page-content">
                        <h3>{program.title}</h3>

                        {program.description && (
                          <p>{program.description}</p>
                        )}

                        <div className="program-page-meta">
                          {program.duration && (
                            <span>
                              <strong>Duration</strong>
                              {program.duration}
                            </span>
                          )}

                          {program.age_range && (
                            <span>
                              <strong>Age</strong>
                              {program.age_range}
                            </span>
                          )}
                        </div>

                        {program.registration_deadline && (
                          <div className="program-page-deadline">
                            Registration closes{" "}
                            <strong>
                              {formatDeadline(
                                program.registration_deadline
                              )}
                            </strong>
                          </div>
                        )}

                        <button
                          type="button"
                          className="program-page-button"
                          onClick={() =>
                            navigate(`/programs/${program.id}`)
                          }
                        >
                          View Program
                          <span>→</span>
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default ProgramsPage;