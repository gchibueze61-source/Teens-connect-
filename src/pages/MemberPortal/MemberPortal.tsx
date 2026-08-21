import React, {
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./MemberPortal.css";

interface Profile {
  id: string;
  auth_user_id?: string | null;

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
  updated_at?: string | null;
}

const MemberPortal: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const loadMember = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      /*
       * Find profile by auth_user_id.
       */
      const {
        data,
        error,
      } = await supabase
        .from("profiles")
        .select("*")
        .eq(
          "auth_user_id",
          user.id
        )
        .maybeSingle();

      if (error) {
        console.error(
          "PROFILE LOAD ERROR:",
          error
        );

        return;
      }

      if (!data) {
        console.error(
          "No profile found for authenticated user."
        );

        return;
      }

      /*
       * BOTH pending and active members
       * are allowed into the portal.
       */
      if (
        data.status !== "pending" &&
        data.status !== "active"
      ) {
        await supabase.auth.signOut();

        navigate("/login", {
          replace: true,
        });

        return;
      }

      setProfile(
        data as Profile
      );

    } catch (error) {
      console.error(
        "Unable to load member profile:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember(true);

    /*
     * Listen for Auth changes.
     */
    const {
      data: authListener,
    } =
      supabase.auth.onAuthStateChange(
        async (event) => {
          if (
            event ===
              "SIGNED_OUT"
          ) {
            navigate("/login", {
              replace: true,
            });

            return;
          }

          if (
            event ===
            "SIGNED_IN"
          ) {
            await loadMember(false);
          }
        }
      );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  /*
   * ------------------------------------------------
   * REFRESH PROFILE
   *
   * Useful when admin changes pending -> active.
   * ------------------------------------------------
   */

  const handleRefresh = async () => {
    setRefreshing(true);

    await loadMember(false);

    setRefreshing(false);
  };

  /*
   * ------------------------------------------------
   * LOGOUT
   * ------------------------------------------------
   */

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * ------------------------------------------------
   * LOADING
   * ------------------------------------------------
   */

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
    return (
      <main className="member-loading">
        <div className="member-loading-box">
          <p>
            We could not find your member profile.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/login")
            }
          >
            Return to Login
          </button>
        </div>
      </main>
    );
  }

  const memberSince =
    new Date(
      profile.created_at
    ).toLocaleDateString(
      "en-US",
      {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    );

  const formattedLocation = [
    profile.community,
    profile.city,
    profile.lga,
    profile.state,
    profile.country,
  ]
    .filter(Boolean)
    .join(", ");

  const isActive =
    profile.status ===
    "active";

  return (
    <main className="member-portal">

      {/* HEADER */}

      <header className="member-header">

        <div className="member-header-inner">

          <button
            type="button"
            className="member-brand"
            onClick={() =>
              navigate("/")
            }
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
            onClick={
              handleLogout
            }
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
                Welcome,{" "}
                {profile.full_name}
              </h1>

              <p>
                Your Teens Connect Africa
                membership dashboard.
              </p>

            </div>

            {/* STATUS */}

            <div
              className={
                isActive
                  ? "active-badge"
                  : "active-badge pending-badge"
              }
            >

              <span className="active-dot"></span>

              {isActive
                ? "ACTIVE MEMBER"
                : "PENDING APPROVAL"}

            </div>

          </div>

          {/* PENDING NOTICE */}

          {!isActive && (
            <div className="member-location-summary">

              <span>
                Membership Status
              </span>

              <strong>
                Your registration has been
                received and is currently
                awaiting admin approval.
                You can remain in your portal
                while your membership is being
                reviewed.
              </strong>

              <button
                type="button"
                onClick={
                  handleRefresh
                }
                disabled={
                  refreshing
                }
                style={{
                  marginTop:
                    "12px",
                  padding:
                    "10px 16px",
                  cursor:
                    refreshing
                      ? "wait"
                      : "pointer",
                }}
              >
                {refreshing
                  ? "Checking..."
                  : "Check Approval Status"}
              </button>

            </div>
          )}

          {/* PROFILE CARD */}

          <div className="member-profile-card">

            <div className="member-profile-top">

              <div className="member-avatar">

                {profile.profile_image_url ? (
                  <img
                    src={
                      profile.profile_image_url
                    }
                    alt={
                      profile.full_name
                    }
                  />
                ) : (
                  <span>
                    {profile.full_name
                      ?.charAt(
                        0
                      )
                      .toUpperCase() ||
                      "M"}
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
                  {profile.role ===
                  "member"
                    ? "TCA Member"
                    : profile.role}
                </span>

              </div>

            </div>

            {/* DETAILS */}

            <div className="member-details">

              <div className="member-detail">
                <span>
                  Phone
                </span>

                <strong>
                  {profile.phone ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  Country
                </span>

                <strong>
                  {profile.country ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  State / Region
                </span>

                <strong>
                  {profile.state ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  LGA / District
                </span>

                <strong>
                  {profile.lga ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  City / Town
                </span>

                <strong>
                  {profile.city ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  Community
                </span>

                <strong>
                  {profile.community ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  School
                </span>

                <strong>
                  {profile.school ||
                    "Not provided"}
                </strong>
              </div>

              <div className="member-detail">
                <span>
                  Member Since
                </span>

                <strong>
                  {memberSince}
                </strong>
              </div>

            </div>

            {/* LOCATION */}

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

          {/* COMMUNITY */}

          <div className="member-section-heading">

            <h2>
              Your Community
            </h2>

            <p>
              Explore what is available to
              you as a TCA member.
            </p>

          </div>

          <div className="member-actions">

            <button
              type="button"
              className="member-action-card"
              onClick={() =>
                navigate("/programs")
              }
            >

              <div className="member-action-icon"></div>

              <div>

                <h3>
                  Programs
                </h3>

                <p>
                  Explore mentorship,
                  skills and development
                  programs.
                </p>

              </div>

              <span className="member-arrow">
                →
              </span>

            </button>

            <button
              type="button"
              className="member-action-card"
              onClick={() =>
                navigate("/events")
              }
            >

              <div className="member-action-icon"></div>

              <div>

                <h3>
                  Events
                </h3>

                <p>
                  Discover upcoming TCA
                  events and activities.
                </p>

              </div>

              <span className="member-arrow">
                →
              </span>

            </button>

            <button
              type="button"
              className="member-action-card"
              onClick={() =>
                navigate("/")
              }
            >

              <div className="member-action-icon"></div>

              <div>

                <h3>
                  TCA Website
                </h3>

                <p>
                  Return to the Teens
                  Connect Africa website.
                </p>

              </div>

              <span className="member-arrow">
                →
              </span>

            </button>

          </div>

          {/* INTERESTS / BIO */}

          {(profile.interests ||
            profile.bio) && (

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
          ©{" "}
          {new Date().getFullYear()}{" "}
          Teens Connect Africa.
          All rights reserved.
        </p>

      </footer>

    </main>
  );
};

export default MemberPortal;