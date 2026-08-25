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

  age?: number | null;
  phone?: string | null;

  location?: string | null;
  address?: string | null;

  country?: string | null;
  state?: string | null;
  lga?: string | null;
  city?: string | null;

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
  age: string;
  phone: string;
  location: string;
  address: string;
  country: string;
  state: string;
  lga: string;
  city: string;
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
      age: "",
      phone: "",
      location: "",
      address: "",
      country: "",
      state: "",
      lga: "",
      city: "",
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
        setError(
          "We could not find your member profile."
        );

        return;
      }

      setProfile(data);

      setForm({
        full_name:
          data.full_name || "",

        age:
          data.age !== null &&
          data.age !== undefined
            ? String(data.age)
            : "",

        phone:
          data.phone || "",

        location:
          data.location || "",

        address:
          data.address || "",

        country:
          data.country || "",

        state:
          data.state || "",

        lga:
          data.lga || "",

        city:
          data.city || "",

        school:
          data.school || "",

        interests:
          data.interests || "",

        bio:
          data.bio || "",
      });

    } catch (loadError: any) {
      console.error(
        "MEMBER LOAD ERROR:",
        loadError
      );

      setError(
        loadError?.message ||
          "Unable to load your profile."
      );
    } finally {
      if (showLoader) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadMember();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStartEditing = () => {
    if (!profile) {
      return;
    }

    setForm({
      full_name:
        profile.full_name || "",

      age:
        profile.age !== null &&
        profile.age !== undefined
          ? String(profile.age)
          : "",

      phone:
        profile.phone || "",

      location:
        profile.location || "",

      address:
        profile.address || "",

      country:
        profile.country || "",

      state:
        profile.state || "",

      lga:
        profile.lga || "",

      city:
        profile.city || "",

      school:
        profile.school || "",

      interests:
        profile.interests || "",

      bio:
        profile.bio || "",
    });

    setError("");
    setSuccess("");
    setEditing(true);
  };

  const handleSaveProfile = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const age =
        Number(form.age);

      if (
        !Number.isInteger(age) ||
        age < 10 ||
        age > 100
      ) {
        throw new Error(
          "Please enter a valid age."
        );
      }

      if (!form.phone.trim()) {
        throw new Error(
          "Please enter your phone number."
        );
      }

      if (!form.location.trim()) {
        throw new Error(
          "Please enter your present location."
        );
      }

      if (!form.address.trim()) {
        throw new Error(
          "Please enter your residential address."
        );
      }

      const {
        data: updatedProfile,
        error: updateError,
      } = await supabase
        .from("profiles")
        .update({
          full_name:
            form.full_name.trim(),

          age,

          phone:
            form.phone.trim(),

          location:
            form.location.trim(),

          address:
            form.address.trim(),

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
          "id",
          profile.id
        )
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(
        updatedProfile
      );

      setEditing(false);

      setSuccess(
        "Your profile was updated successfully."
      );

    } catch (saveError: any) {
      console.error(
        "PROFILE UPDATE ERROR:",
        saveError
      );

      setError(
        saveError?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    setSuccess("");

    await loadMember(false);

    setRefreshing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    navigate("/login", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <main className="member-portal">
        <div className="member-container">
          <div className="member-location-summary">
            Loading your member portal...
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="member-portal">
        <div className="member-container">

          <div className="member-location-summary">
            <strong>
              {error ||
                "We could not find your member profile."}
            </strong>
          </div>

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

  const isActive =
    profile.status === "active";

  return (
    <main className="member-portal">

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

      <section className="member-main">

        <div className="member-container">

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

            {editing ? (

              <form
                onSubmit={
                  handleSaveProfile
                }
                style={{
                  marginTop: "25px",
                }}
              >

                <div className="member-field">
                  <label>
                    Full Name
                  </label>

                  <input
                    name="full_name"
                    value={
                      form.full_name
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="member-field">
                  <label>
                    Age
                  </label>

                  <input
                    name="age"
                    type="number"
                    min="10"
                    max="100"
                    value={
                      form.age
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="member-field">
                  <label>
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    type="tel"
                    value={
                      form.phone
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="member-field">
                  <label>
                    Present Location
                  </label>

                  <input
                    name="location"
                    value={
                      form.location
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Where you currently live"
                    required
                  />
                </div>

                <div className="member-field">
                  <label>
                    Residential Address
                  </label>

                  <input
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    required
                  />
                </div>

                <div className="member-field">
                  <label>
                    Country
                  </label>

                  <input
                    name="country"
                    value={
                      form.country
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="member-field">
                  <label>
                    State / Region
                  </label>

                  <input
                    name="state"
                    value={
                      form.state
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="member-field">
                  <label>
                    LGA / District
                  </label>

                  <input
                    name="lga"
                    value={
                      form.lga
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="member-field">
                  <label>
                    City / Town
                  </label>

                  <input
                    name="city"
                    value={
                      form.city
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="member-field">
                  <label>
                    School
                  </label>

                  <input
                    name="school"
                    value={
                      form.school
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="member-field">
                  <label>
                    Interests
                  </label>

                  <input
                    name="interests"
                    value={
                      form.interests
                    }
                    onChange={
                      handleChange
                    }
                  />
                </div>

                <div className="member-field">
                  <label>
                    Bio
                  </label>

                  <textarea
                    name="bio"
                    value={
                      form.bio
                    }
                    onChange={
                      handleChange
                    }
                    rows={4}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    marginTop: "20px",
                  }}
                >

                  <button
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEditing(false)
                    }
                    disabled={saving}
                  >
                    Cancel
                  </button>

                </div>

              </form>

            ) : (

              <div className="member-details">

                <div>
                  <span>
                    Age
                  </span>

                  <strong>
                    {profile.age ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    Phone Number
                  </span>

                  <strong>
                    {profile.phone ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    Present Location
                  </span>

                  <strong>
                    {profile.location ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    Residential Address
                  </span>

                  <strong>
                    {profile.address ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    School
                  </span>

                  <strong>
                    {profile.school ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    Role
                  </span>

                  <strong>
                    {profile.role}
                  </strong>
                </div>

                <div className="member-detail-full">
                  <span>
                    Interests
                  </span>

                  <strong>
                    {profile.interests ||
                      "Not provided"}
                  </strong>
                </div>

                <div className="member-detail-full">
                  <span>
                    Bio
                  </span>

                  <strong>
                    {profile.bio ||
                      "Not provided"}
                  </strong>
                </div>

                <div>
                  <span>
                    Member Since
                  </span>

                  <strong>
                    {memberSince}
                  </strong>
                </div>

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  );
};

export default MemberPortal;