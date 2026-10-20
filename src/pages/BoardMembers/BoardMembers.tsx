
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./BoardMembers.css";

interface BoardMember {
  id: string;
  full_name: string;
  position: string;
  short_bio: string | null;
  profile_image_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
}

const BoardMembers: React.FC = () => {
  const navigate = useNavigate();

  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBoardMembers = async () => {
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("board_members")
        .select(
          `
          id,
          full_name,
          position,
          short_bio,
          profile_image_url,
          linkedin_url,
          website_url
          `
        )
        .eq("status", "active")
        .eq("public_profile", true)
        .order("created_at", { ascending: true });

      if (fetchError) {
        console.error("LOAD BOARD MEMBERS ERROR:", fetchError);
        setError("Unable to load board members.");
        setMembers([]);
      } else {
        setMembers(data ?? []);
      }

      setLoading(false);
    };

    void loadBoardMembers();
  }, []);

  return (
    <main className="board-members-page">
      {/* PAGE HERO */}
      <section className="board-members-hero">
        <div className="board-members-hero-content">
          <span className="board-members-eyebrow">
            TEENS CONNECT AFRICA
          </span>

          <h1>Our Board of Directors</h1>

          <p>
            Meet the leaders helping guide Teens Connect Africa,
            strengthen our programmes, and support opportunities for
            teenagers across Africa.
          </p>
        </div>
      </section>

      {/* CONNECTED ABOUT NAVIGATION */}
      <section
        className="tca-about-navigation"
        aria-label="Explore About Teens Connect Africa"
      >
        <div className="tca-about-navigation-inner">
          <div className="tca-about-navigation-heading">
            <span>GET TO KNOW US</span>
            <h2>Explore Teens Connect Africa</h2>
            <p>
              Move between our story and the people who help drive
              our mission.
            </p>
          </div>

          <nav className="tca-about-navigation-links">
            <NavLink
              to="/about"
              end
              className={({ isActive }) =>
                `tca-about-navigation-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="tca-about-link-number">01</span>
              <span>Our Story</span>
              <span className="tca-about-link-arrow">→</span>
            </NavLink>

            <NavLink
              to="/board-members"
              end
              className={({ isActive }) =>
                `tca-about-navigation-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="tca-about-link-number">02</span>
              <span>Board of Directors</span>
              <span className="tca-about-link-arrow">→</span>
            </NavLink>

            <NavLink
              to="/team"
              end
              className={({ isActive }) =>
                `tca-about-navigation-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="tca-about-link-number">03</span>
              <span>Executive Team</span>
              <span className="tca-about-link-arrow">→</span>
            </NavLink>

            <NavLink
              to="/teen-executive-committee"
              end
              className={({ isActive }) =>
                `tca-about-navigation-link ${
                  isActive ? "active" : ""
                }`
              }
            >
              <span className="tca-about-link-number">04</span>
              <span>Teen Executive Committee</span>
              <span className="tca-about-link-arrow">→</span>
            </NavLink>
          </nav>

          <button
            type="button"
            className="tca-back-to-story"
            onClick={() => navigate("/about")}
          >
            <span aria-hidden="true">←</span>
            Back to Our Story
          </button>
        </div>
      </section>

      {/* BOARD MEMBERS */}
      <section className="board-members-section">
        <div className="board-members-container">
          <div className="board-members-heading">
            <span>LEADERSHIP</span>

            <h2>
              Guiding the Future
              <br />
              of Young Africans
            </h2>

            <p>
              Our board provides leadership, guidance and strategic
              support as Teens Connect Africa continues to grow.
            </p>
          </div>

          {loading && (
            <div className="board-members-state">
              <p>Loading board members...</p>
            </div>
          )}

          {!loading && error && (
            <div className="board-members-state error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && members.length === 0 && (
            <div className="board-members-state">
              <p>No board members have been published yet.</p>
            </div>
          )}

          {!loading && !error && members.length > 0 && (
            <div className="board-members-grid">
              {members.map((member) => (
                <article
                  className="board-member-card"
                  key={member.id}
                >
                  <div className="board-member-image-wrapper">
                    {member.profile_image_url ? (
                      <img
                        src={member.profile_image_url}
                        alt={member.full_name}
                        className="board-member-image"
                        loading="lazy"
                      />
                    ) : (
                      <div className="board-member-placeholder">
                        {member.full_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="board-member-content">
                    <span className="board-member-position">
                      {member.position}
                    </span>

                    <h3>{member.full_name}</h3>

                    {member.short_bio && (
                      <p className="board-member-bio">
                        {member.short_bio}
                      </p>
                    )}

                    <div className="board-member-links">
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          LinkedIn
                        </a>
                      )}

                      {member.website_url && (
                        <a
                          href={member.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="board-members-cta">
        <div className="board-members-cta-content">
          <span>TEENS CONNECT AFRICA</span>

          <h2>
            Building a stronger future for
            <br />
            Africa's teenagers.
          </h2>

          <p>
            Together, we connect young people with knowledge,
            opportunities, mentorship and meaningful experiences.
          </p>

          <a href="/volunteer" className="primary-btn">
            Join Our Mission
          </a>
        </div>
      </section>
    </main>
  );
};

export default BoardMembers;
