import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import Navbar from "../../components/navigation/Navbar";
import Footer from "../../components/sections/Footer/Footer";
import "./TeenExecutiveCommittee.css";

interface CommitteeMember {
  id: string;
  full_name: string;
  position: string;
  profile_image_url: string | null;
  short_bio: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  display_order: number;
}

const TeenExecutiveCommittee: React.FC = () => {
  const [members, setMembers] = useState<CommitteeMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("teen_executive_committee")
        .select(
          "id, full_name, position, profile_image_url, short_bio, linkedin_url, website_url, display_order"
        )
        .eq("status", "active")
        .eq("public_profile", true)
        .order("display_order", { ascending: true })
        .order("full_name", { ascending: true });

      if (!isMounted) return;

      if (fetchError) {
        console.error(
          "Failed to load Teen Executive Committee:",
          fetchError
        );

        setError(
          "We couldn't load the committee members right now. Please try again later."
        );
        setMembers([]);
      } else {
        setMembers(data ?? []);
      }

      setLoading(false);
    };

    void fetchMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <Navbar />

      <main className="teen-executive-page">
        {/* HERO */}
        <section className="teen-executive-hero">
          <div className="teen-executive-hero-inner">
            <p className="teen-executive-eyebrow">
              TEENS CONNECT AFRICA
            </p>

            <h1>Teen Executive Committee</h1>

            <p className="teen-executive-hero-description">
              Meet the young leaders who represent teen voices,
              support youth-led initiatives, and contribute to
              the work of Teens Connect Africa.
            </p>

            <nav
              className="teen-executive-breadcrumb"
              aria-label="Breadcrumb"
            >
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/about">About Us</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">
                Teen Executive Committee
              </span>
            </nav>
          </div>
        </section>

        {/* NAVIGATION BETWEEN ABOUT SECTIONS */}
        <section className="teen-executive-navigation">
          <div className="teen-executive-container">
            <div className="teen-executive-navigation-heading">
              <p className="teen-executive-section-label">
                EXPLORE TEENS CONNECT AFRICA
              </p>

              <h2>Discover Our Leadership</h2>

              <p>
                Learn about our organisation, meet our leadership
                team, and discover the people working together to
                support teenagers across our communities.
              </p>
            </div>

            <div className="teen-executive-navigation-grid">
              <Link
                to="/about"
                className="teen-executive-navigation-card"
              >
                <span className="teen-executive-navigation-number">
                  01
                </span>

                <div className="teen-executive-navigation-copy">
                  <h3>Our Story</h3>
                  <p>
                    Discover our mission, vision, values, and
                    approach to youth development.
                  </p>
                </div>

                <span
                  className="teen-executive-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>

              <Link
                to="/board-members"
                className="teen-executive-navigation-card"
              >
                <span className="teen-executive-navigation-number">
                  02
                </span>

                <div className="teen-executive-navigation-copy">
                  <h3>Board of Directors</h3>
                  <p>
                    Meet the people providing guidance and
                    oversight for our organisation.
                  </p>
                </div>

                <span
                  className="teen-executive-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>

              <Link
                to="/team"
                className="teen-executive-navigation-card"
              >
                <span className="teen-executive-navigation-number">
                  03
                </span>

                <div className="teen-executive-navigation-copy">
                  <h3>Executive Team</h3>
                  <p>
                    Discover the people supporting our programmes,
                    communications, and daily operations.
                  </p>
                </div>

                <span
                  className="teen-executive-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* COMMITTEE MEMBERS */}
        <section
          className="teen-executive-content"
          aria-labelledby="teen-executive-heading"
        >
          <div className="teen-executive-container">
            <div className="teen-executive-heading">
              <p className="teen-executive-section-label">
                YOUNG PEOPLE LEADING CHANGE
              </p>

              <h2 id="teen-executive-heading">
                Meet Our Teen Leaders
              </h2>

              <p>
                Our Teen Executive Committee helps bring young
                people's perspectives into the work of Teens
                Connect Africa.
              </p>
            </div>

            {loading && (
              <div
                className="teen-executive-message"
                role="status"
              >
                Loading committee members...
              </div>
            )}

            {!loading && error && (
              <div
                className="teen-executive-message teen-executive-error"
                role="alert"
              >
                {error}
              </div>
            )}

            {!loading && !error && members.length === 0 && (
              <div className="teen-executive-message">
                <h3>Our teen leaders are coming soon</h3>
                <p>
                  Committee member profiles will appear here once
                  they have been published.
                </p>
              </div>
            )}

            {!loading && !error && members.length > 0 && (
              <div className="teen-executive-grid">
                {members.map((member) => (
                  <article
                    className="teen-executive-card"
                    key={member.id}
                  >
                    {member.profile_image_url ? (
                      <img
                        className="teen-executive-photo"
                        src={member.profile_image_url}
                        alt={`Portrait of ${member.full_name}`}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="teen-executive-photo-placeholder"
                        aria-label="No profile photo available"
                      >
                        {member.full_name
                          .trim()
                          .split(/\s+/)
                          .slice(0, 2)
                          .map((part) =>
                            part.charAt(0).toUpperCase()
                          )
                          .join("")}
                      </div>
                    )}

                    <div className="teen-executive-card-body">
                      <h3>{member.full_name}</h3>

                      <p className="teen-executive-position">
                        {member.position}
                      </p>

                      {member.short_bio && (
                        <p className="teen-executive-bio">
                          {member.short_bio}
                        </p>
                      )}

                      {(member.linkedin_url ||
                        member.website_url) && (
                        <div className="teen-executive-links">
                          {member.linkedin_url && (
                            <a
                              href={member.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              LinkedIn ↗
                            </a>
                          )}

                          {member.website_url && (
                            <a
                              href={member.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Website ↗
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* BOTTOM NAVIGATION */}
            <div className="teen-executive-bottom-navigation">
              <Link
                to="/about"
                className="teen-executive-back"
              >
                ← Learn More About Us
              </Link>

              <Link
                to="/board-members"
                className="teen-executive-bottom-link"
              >
                Board of Directors
              </Link>

              <Link
                to="/team"
                className="teen-executive-bottom-link"
              >
                Executive Team
              </Link>

              <Link
                to="/"
                className="teen-executive-bottom-link"
              >
                Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default TeenExecutiveCommittee;