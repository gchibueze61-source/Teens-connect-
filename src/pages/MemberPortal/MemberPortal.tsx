import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./MemberPortal.css";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  location?: string | null;

  country?: string | null;
  state?: string | null;
  lga?: string | null;
  city?: string | null;
  community?: string | null;
  address?: string | null;

  school?: string | null;
  interests?: string | null;
  bio?: string | null;
  profile_image_url?: string | null;

  role: string;
  status: string;
  created_at: string;
}

const MemberPortal: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMember = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/login");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("PROFILE LOAD ERROR:", error);
          navigate("/login");
          return;
        }

        if (!data) {
          navigate("/login");
          return;
        }

        if (data.status !== "active") {
          await supabase.auth.signOut();
          navigate("/login");
          return;
        }

        setProfile(data as Profile);
      } catch (error) {
        console.error(
          "Unable to load member profile:",
          error
        );

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    loadMember();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <main className="member-loading">
        <div className="member-loading-box">
          <div className="member-spinner"></div>

          <p>
            Loading your member portal...
          </p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const memberSince = new Date(
    profile.created_at
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedLocation = [
    profile.community,
    profile.city,
    profile.lga,
    profile.state,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="member-portal">

      {/* HEADER */}

      <header className="member-header">
        <div className="member-header-inner">

          <button
            type="button"
            className="member-brand"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo/bobdaddy%202%201580.jpg"
              alt="Teens Connect Africa"
            />

            <span>
              Teens Connect Africa
            </span>
          </button>

          <button
            type="button"
            className="member-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>
      </header>

      {/* MAIN */}

      <section className="member-main">

        <div className="member-container">

          {/* WELCOME */}

          <div className="member-welcome">

            <div>
              <span className="member-welcome-label">
                MEMBER PORTAL
              </span>

              <h1>
                Welcome, {profile.full_name}
              </h1>

              <p>
                Your Teens Connect Africa membership dashboard.
              </p>
            </div>

            <div className="active-badge">
              <span className="active-dot"></span>
              ACTIVE MEMBER
            </div>

          </div>

          {/* PROFILE CARD */}

          <div className="member-profile-card">

            <div className="member-profile-top">

              <div className="member-avatar">

                {profile.profile_image_url ? (
                  <img
                    src={profile.profile_image_url}
                    alt={profile.full_name}
                  />
                ) : (
                  <span>
                    {profile.full_name
                      ?.charAt(0)
                      .toUpperCase() || "M"}
                  </span>
                )}

              </div>

              <div className="member-profile-name">

                <h2>
                  {profile.full_name}
                </h2>

                <p>
                  {profile.email}
                </p>

                <span className="member-role">
                  {profile.role === "member"
                    ? "TCA Member"
                    : profile.role}
                </span>

              </div>

            </div>

            {/* MEMBER DETAILS */}

            <div className="member-details">

              <div className="member-detail">
                <span>Phone</span>

                <strong>
                  {profile.phone || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>Country</span>

                <strong>
                  {profile.country || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>State / Region</span>

                <strong>
                  {profile.state || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>LGA / District</span>

                <strong>
                  {profile.lga || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>City / Town</span>

                <strong>
                  {profile.city || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>Community</span>

                <strong>
                  {profile.community || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>School</span>

                <strong>
                  {profile.school || "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>Member Since</span>

                <strong>
                  {memberSince}
                </strong>
              </div>

            </div>

            {/* FULL LOCATION */}

            {formattedLocation && (
              <div className="member-location-summary">

                <span>
                  Full Location
                </span>

                <strong>
                  {formattedLocation}
                </strong>

              </div>
            )}

            {/* ADDRESS */}

            {profile.address && (
              <div className="member-location-summary">

                <span>
                  Address
                </span>

                <strong>
                  {profile.address}
                </strong>

              </div>
            )}

          </div>

          {/* QUICK ACTIONS */}

          <div className="member-section-heading">

            <h2>
              Your Community
            </h2>

            <p>
              Explore what is available to you as a TCA member.
            </p>

          </div>

          <div className="member-actions">

            <button
              type="button"
              className="member-action-card"
              onClick={() => navigate("/programs")}
            >

              <div className="member-action-icon">
                 
              </div>

              <div>
                <h3>
                  Programs
                </h3>

                <p>
                  Explore mentorship, skills and development programs.
                </p>
              </div>

              <span className="member-arrow">
                →
              </span>

            </button>

            <button
              type="button"
              className="member-action-card"
              onClick={() => navigate("/events")}
            >

              <div className="member-action-icon">
                
              </div>

              <div>
                <h3>
                  Events
                </h3>

                <p>
                  Discover upcoming TCA events and activities.
                </p>
              </div>

              <span className="member-arrow">
                →
              </span>

            </button>

            <button
              type="button"
              className="member-action-card"
              onClick={() => navigate("/")}
            >

              <div className="member-action-icon">
                
              </div>

              <div>
                <h3>
                  TCA Website
                </h3>

                <p>
                  Return to the Teens Connect Africa website.
                </p>
              </div>

              <span className="member-arrow">
                →
              </span>

            </button>

          </div>

          {/* INTERESTS AND BIO */}

          {(profile.interests || profile.bio) && (
            <div className="member-about">

              {profile.interests && (
                <div className="member-about-box">

                  <h3>
                    My Interests
                  </h3>

                  <p>
                    {profile.interests}
                  </p>

                </div>
              )}

              {profile.bio && (
                <div className="member-about-box">

                  <h3>
                    About Me
                  </h3>

                  <p>
                    {profile.bio}
                  </p>

                </div>
              )}

            </div>
          )}

        </div>

      </section>

      {/* FOOTER */}

      <footer className="member-footer">

        <p>
          © {new Date().getFullYear()} Teens Connect Africa.
          All rights reserved.
        </p>

      </footer>

    </main>
  );
};

export default MemberPortal;