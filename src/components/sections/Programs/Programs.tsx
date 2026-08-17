import { useEffect, useState } from "react";
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
};

export default function Programs() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          registration_deadline
        `
        )
        .eq("homepage", true)
        .eq("status", "published")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load programs:", error.message);
        setError("Unable to load programs right now.");
      } else {
        setPrograms(data || []);
      }

      setLoading(false);
    };

    loadPrograms();
  }, []);

  if (loading) {
    return (
      <section className="programs" id="programs">
        <div className="container">
          <div className="section-header">
            <h2>Our Programs</h2>
            <p>Loading our latest programs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="programs" id="programs">
        <div className="container">
          <div className="section-header">
            <h2>Our Programs</h2>
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="programs" id="programs">
      <div className="container">

        <div className="section-header">
          <h2>Our Programs</h2>

          <p>
            Empowering African teenagers through education,
            technology, leadership and mentorship.
          </p>
        </div>

        {programs.length === 0 ? (
          <div className="programs-empty">
            <p>No programs are currently available.</p>
          </div>
        ) : (
          <div className="program-grid">

            {programs.map((program) => (
              <article
                className="program-card"
                key={program.id}
              >

                {program.image_url && (
                  <div className="program-image">
                    <img
                      src={program.image_url}
                      alt={program.title}
                    />
                  </div>
                )}

                <div className="program-card-content">

                  {program.category && (
                    <span className="category">
                      {program.category}
                    </span>
                  )}

                  <h3>{program.title}</h3>

                  <p>
                    {program.description ||
                      "Learn more about this TCA program."}
                  </p>

                  <div className="program-meta">

                    {program.duration && (
                      <span>
                        {program.duration}
                      </span>
                    )}

                    {program.age_range && (
                      <span>
                        {program.age_range}
                      </span>
                    )}

                  </div>

                  <div className="status-row">

                    <span
                      className={`status ${program.status
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {program.status}
                    </span>

                    {program.registration_deadline &&
                      program.registration_deadline !== "-" && (
                        <span className="registration-deadline">
                          Deadline:{" "}
                          {program.registration_deadline}
                        </span>
                      )}

                  </div>

                </div>

              </article>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}