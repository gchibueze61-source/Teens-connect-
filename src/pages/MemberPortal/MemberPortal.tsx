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

interface ProfileForm {
  full_name: string;
  phone: string;
  country: string;
  state: string;
  lga: string;
  city: string;
  community: string;
  address: string;
  school: string;
  interests: string;
  bio: string;
}

const MemberPortal: React.FC = () => {
  const navigate = useNavigate();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [editing, setEditing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [form, setForm] =
    useState<ProfileForm>({
      full_name: "",
      phone: "",
      country: "",
      state: "",
      lga: "",
      city: "",
      community: "",
      address: "",
      school: "",
      interests: "",
      bio: "",
    });

  const loadMember = async (
    showLoader = true
  ) => {
    try {
      if (showLoader) {
        setLoading(true);
      }

      setError("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

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

        setError(error.message);

        return;
      }

      if (!data) {
        console.error(
          "No profile found for authenticated user."
        );

        setError(
          "We could not find your member profile."
        );

        return;
      }

      /*
       * Both pending and active members
       * can access the portal.
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

      /*
       * Keep the edit form synchronized
       * with the latest database values.
       */
      setForm({
        full_name:
          data.full_name || "",

        phone:
          data.phone || "",

        country:
          data.country || "",

        state:
          data.state || "",

        lga:
          data.lga || "",

        city:
          data.city || "",

        community:
          data.community || "",

        address:
          data.address || "",

        school:
          data.school || "",

        interests:
          data.interests || "",

        bio:
          data.bio || "",
      });

    } catch (error) {
      console.error(
        "Unable to load member profile:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load your profile."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMember(true);

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
   * Update a form field.
   */
  const handleFormChange = (
    field: keyof ProfileForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  /*
   * Start editing.
   */
  const handleStartEditing = () => {
    if (!profile) return;

    setError("");
    setSuccess("");

    setForm({
      full_name:
        profile.full_name || "",

      phone:
        profile.phone || "",

      country:
        profile.country || "",

      state:
        profile.state || "",

      lga:
        profile.lga || "",

      city:
        profile.city || "",

      community:
        profile.community || "",

      address:
        profile.address || "",

      school:
        profile.school || "",

      interests:
        profile.interests || "",

      bio:
        profile.bio || "",
    });

    setEditing(true);
  };

  /*
   * Cancel editing.
   */
  const handleCancelEditing = () => {
    if (!profile) return;

    setForm({
      full_name:
        profile.full_name || "",

      phone:
        profile.phone || "",

      country:
        profile.country || "",

      state:
        profile.state || "",

      lga:
        profile.lga || "",

      city:
        profile.city || "",

      community:
        profile.community || "",

      address:
        profile.address || "",

      school:
        profile.school || "",

      interests:
        profile.interests || "",

      bio:
        profile.bio || "",
    });

    setEditing(false);
    setError("");
  };

  /*
   * Save profile changes.
   */
  const handleSaveProfile = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!profile) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      if (!form.full_name.trim()) {
        throw new Error(
          "Full name is required."
        );
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        throw new Error(
          "Your login session has expired. Please log in again."
        );
      }

      /*
       * Update only the member's own profile.
       *
       * We identify the profile using
       * auth_user_id rather than the profile id.
       */
      const {
        data,
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          full_name:
            form.full_name.trim(),

          phone:
            form.phone.trim() ||
            null,

          country:
            form.country.trim() ||
            null,

          state:
            form.state.trim() ||
            null,

          lga:
            form.lga.trim() ||
            null,

          city:
            form.city.trim() ||
            null,

          community:
            form.community.trim() ||
            null,

          address:
            form.address.trim() ||
            null,

          school:
            form.school.trim() ||
            null,

          interests:
            form.interests.trim() ||
            null,

          bio:
            form.bio.trim() ||
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "auth_user_id",
          user.id
        )
        .select()
        .single();

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }

      setProfile(
        data as Profile
      );

      setForm({
        full_name:
          data.full_name || "",

        phone:
          data.phone || "",

        country:
          data.country || "",

        state:
          data.state || "",

        lga:
          data.lga || "",

        city:
          data.city || "",

        community:
          data.community || "",

        address:
          data.address || "",

        school:
          data.school || "",

        interests:
          data.interests || "",

        bio:
          data.bio || "",
      });

      setEditing(false);

      setSuccess(
        "Your profile has been updated successfully."
      );

    } catch (error) {
      console.error(
        "PROFILE UPDATE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Refresh profile.
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    setSuccess("");

    await loadMember(false);

    setRefreshing(false);
  };

  /*
   * Logout.
   */
  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/login", {
      replace: true,
    });
  };

  /*
   * Loading.
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
            {error ||
              "We could not find your member profile."}
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

          {/* MESSAGES */}

          {success && (
            <div
              className="member-location-summary"
              style={{
                marginBottom: "20px",
              }}
            >
              <strong>
                {success}
              </strong>
            </div>
          )}

          {error && (
            <div
              className="member-location-summary"
              style={{
                marginBottom: "20px",
              }}
            >
              <strong>
                {error}
              </strong>
            </div>
          )}

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
                  marginTop: "12px",
                  padding: "10px 16px",
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
                      ?.charAt(0)
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

            {/* EDIT BUTTON */}

            {!editing && (
              <div
                style={{
                  marginTop: "20px",
                }}
              >

                <button
                  type="button"
                  onClick={
                    handleStartEditing
                  }
                  style={{
                    padding:
                      "12px 20px",
                    borderRadius:
                      "8px",
                    border: "none",
                    cursor:
                      "pointer",
                    fontWeight: 600,
                  }}
                >
                  Edit Profile
                </button>

              </div>
            )}

            {/* EDIT FORM */}

            {editing ? (

              <form
                onSubmit={
                  handleSaveProfile
                }
                style={{
                  marginTop: "25px",
                }}
              >

                <div className="member-details">

                  <div className="member-detail">

                    <span>
                      Full Name
                    </span>

                    <input
                      type="text"
                      value={
                        form.full_name
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "full_name",
                          event.target.value
                        )
                      }
                      required
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      Email
                    </span>

                    <strong>
                      {profile.email}
                    </strong>

                  </div>

                  <div className="member-detail">

                    <span>
                      Phone
                    </span>

                    <input
                      type="text"
                      value={
                        form.phone
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "phone",
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      Country
                    </span>

                    <input
                      type="text"
                      value={
                        form.country
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "country",
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      State / Region
                    </span>

                    <input
                      type="text"
                      value={
                        form.state
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "state",
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      LGA / District
                    </span>

                    <input
                      type="text"
                      value={
                        form.lga
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "lga",
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      City / Town
                    </span>

                    <input
                      type="text"
                      value={
                        form.city
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "city",
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      Community
                    </span>

                    <input
                      type="text"
                      value={
                        form.community
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "community",
                          event.target.value
                        )
                      }
                    />

                  </div>

                  <div className="member-detail">

                    <span>
                      School
                    </span>

                    <input
                      type="text"
                      value={
                        form.school
                      }
                      onChange={(event) =>
                        handleFormChange(
                          "school",
                          event.target.value
                        )
                      }
                    />

                  </div>

                </div>

                {/* ADDRESS */}

                <div
                  className="member-location-summary"
                  style={{
                    marginTop: "20px",
                  }}
                >

                  <span>
                    Address
                  </span>

                  <textarea
                    value={
                      form.address
                    }
                    onChange={(event) =>
                      handleFormChange(
                        "address",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Enter your address"
                  />

                </div>

                {/* INTERESTS */}

                <div
                  className="member-location-summary"
                  style={{
                    marginTop: "20px",
                  }}
                >

                  <span>
                    My Interests
                  </span>

                  <textarea
                    value={
                      form.interests
                    }
                    onChange={(event) =>
                      handleFormChange(
                        "interests",
                        event.target.value
                      )
                    }
                    rows={3}
                    placeholder="Tell us about your interests"
                  />

                </div>

                {/* BIO */}

                <div
                  className="member-location-summary"
                  style={{
                    marginTop: "20px",
                  }}
                >

                  <span>
                    About Me
                  </span>

                  <textarea
                    value={
                      form.bio
                    }
                    onChange={(event) =>
                      handleFormChange(
                        "bio",
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Tell us a little about yourself"
                  />

                </div>

                {/* ACTIONS */}

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                    flexWrap: "wrap",
                  }}
                >

                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding:
                        "12px 22px",
                      borderRadius:
                        "8px",
                      border: "none",
                      cursor:
                        saving
                          ? "wait"
                          : "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelEditing
                    }
                    disabled={saving}
                    style={{
                      padding:
                        "12px 22px",
                      borderRadius:
                        "8px",
                      cursor:
                        saving
                          ? "not-allowed"
                          : "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <>
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

              </>
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

          {!editing &&
            (profile.interests ||
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