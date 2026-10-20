
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/sections/Footer/Footer";
import "./Team.css";

interface TeamMember {
  id: string;
  full_name: string;
  position: string;
  profile_image_url: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  display_order: number;
}

const leadershipLinks = [
  {
    number: "01",
    title: "Our Story",
    description: "Learn about our mission, vision and impact.",
    href: "/about",
  },
  {
    number: "02",
    title: "Board Members",
    description: "Meet the people providing organisational oversight.",
    href: "/board-members",
  },
  {
    number: "03",
    title: "Teen Executive Committee",
    description: "Discover the young leaders representing our community.",
    href: "/teen-executive-committee",
  },
];

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchTeamMembers = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("team_members")
        .select(
          "id, full_name, position, profile_image_url, short_bio, linkedin_url, website_url, display_order"
        )
        .eq("status", "active")
        .eq("public_profile", true)
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (!isMounted) return;

      if (fetchError) {
        console.error("Unable to load executive team:", fetchError);
        setError("We could not load the Executive Team at this time.");
        setMembers([]);
      } else {
        setMembers(data ?? []);
      }

      setLoading(false);
    };

    void fetchTeamMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="team-page">
        <section className="team-hero">
          <div className="team-container">
            <nav className="team-breadcrumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <a href="/about">About</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Executive Team</span>
            </nav>

            <p className="team-eyebrow">THE PEOPLE BEHIND OUR WORK</p>

            <h1>Our Executive Team</h1>

            <p className="team-intro">
              Meet the people working together to advance the mission of
              Teens Connect Africa and create opportunities for young people.
            </p>

            <a className="team-hero-link" href="#team-members">
              Meet the team
              <span aria-hidden="true">↓</span>
            </a>
          </div>
        </section>

        <section className="team-section" id="team-members">
          <div className="team-container">
            <div className="team-section-heading">
              <p className="team-eyebrow">LEADERSHIP AND COLLABORATION</p>

              <h2>Meet Our Team</h2>

              <p>
                Our executive team helps coordinate our programmes,
                communications, community engagement and organisational work.
                Together, we work towards a future where young people can learn,
                lead and make a difference.
              </p>
            </div>

            {loading && (
              <p className="team-message" role="status">
                Loading executive team...
              </p>
            )}

            {!loading && error && (
              <div className="team-message team-error" role="alert">
                <p>{error}</p>
                <button
                  type="button"
                  className="team-retry-button"
                  onClick={() => {
                    setError("");
                    setLoading(true);

                    void (async () => {
                      const { data, error: fetchError } = await supabase
                        .from("team_members")
                        .select(
                          "id, full_name, position, profile_image_url, short_bio, linkedin_url, website_url, display_order"
                        )
                        .eq("status", "active")
                        .eq("public_profile", true)
                        .order("display_order", { ascending: true })
                        .order("created_at", { ascending: true });

                      if (fetchError) {
                        console.error(
                          "Unable to reload executive team:",
                          fetchError
                        );
                        setError(
                          "We could not load the Executive Team at this time. Please try again."
                        );
                        setMembers([]);
                      } else {
                        setMembers(data ?? []);
                        setError("");
                      }

                      setLoading(false);
                    })();
                  }}
                >
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && members.length === 0 && (
              <div className="team-message">
                <h3>Our team profiles are coming soon</h3>
                <p>
                  Executive Team profiles will be published here as they
                  become available.
                </p>
              </div>
            )}

            {!loading && !error && members.length > 0 && (
              <div className="team-grid">
                {members.map((member) => {
                  const initials = member.full_name
                    .trim()
                    .split(/\s+/)
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("")
                    .toUpperCase();

                  return (
                    <article className="team-card" key={member.id}>
                      <div className="team-photo-wrap">
                        {member.profile_image_url ? (
                          <img
                            className="team-photo"
                            src={member.profile_image_url}
                            alt={`Portrait of ${member.full_name}`}
                            loading="lazy"
                          />
                        ) : (
                          <div
                            className="team-photo-placeholder"
                            role="img"
                            aria-label={`No profile photo available for ${member.full_name}`}
                          >
                            {initials || "TCA"}
                          </div>
                        )}
                      </div>

                      <div className="team-card-content">
                        <h3>{member.full_name}</h3>

                        <p className="team-position">{member.position}</p>

                        {member.short_bio && (
                          <p className="team-bio">{member.short_bio}</p>
                        )}

                        {(member.linkedin_url || member.website_url) && (
                          <div className="team-links">
                            {member.linkedin_url && (
                              <a
                                href={member.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${member.full_name} on LinkedIn`}
                              >
                                LinkedIn
                                <span aria-hidden="true"> ↗</span>
                              </a>
                            )}

                            {member.website_url && (
                              <a
                                href={member.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Website for ${member.full_name}`}
                              >
                                Website
                                <span aria-hidden="true"> ↗</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section
          className="team-leadership-navigation"
          aria-labelledby="team-leadership-heading"
        >
          <div className="team-container">
            <div className="team-navigation-heading">
              <p className="team-eyebrow">GET TO KNOW US</p>

              <h2 id="team-leadership-heading">
                Discover More About Teens Connect Africa
              </h2>

              <p>
                Explore our story and meet the other people contributing to
                our mission.
              </p>
            </div>

            <div className="team-navigation-grid">
              {leadershipLinks.map((item) => (
                <a
                  className="team-navigation-card"
                  href={item.href}
                  key={item.href}
                >
                  <span className="team-navigation-number">
                    {item.number}
                  </span>

                  <span className="team-navigation-copy">
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </span>

                  <span className="team-navigation-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              ))}
            </div>

            <a className="team-back-link" href="/about">
              <span aria-hidden="true">←</span>
              Back to Our Story
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Team;
