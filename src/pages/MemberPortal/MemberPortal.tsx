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

interface GrowthRecord {
  id: string;
  profile_id: string;
  record_type: string;
  title: string;
  activity_date: string;
  what_i_did: string;
  what_i_learned: string | null;
  how_i_grew: string | null;
  impact: string | null;
  next_goal: string | null;
  status: string;
  points: number;
  admin_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface Achievement {
  id: string;
  profile_id: string;
  title: string;
  category: string;
  achievement_date: string;
  description: string;
  what_i_learned: string | null;
  growth_reflection: string | null;
  impact: string | null;
  status: string;
  points: number;
  admin_feedback: string | null;
  submitted_at: string;
  reviewed_at: string | null;
}

interface QuarterlyReview {
  id: string;
  profile_id: string;
  year: number;
  quarter: number;
  participation_score: number | null;
  leadership_score: number | null;
  skill_score: number | null;
  community_impact_score: number | null;
  growth_score: number | null;
  overall_score: number | null;
  feedback: string;
  created_at: string;
}

interface Award {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  award_date: string;
}

interface GrowthForm {
  record_type: string;
  title: string;
  activity_date: string;
  what_i_did: string;
  what_i_learned: string;
  how_i_grew: string;
  impact: string;
  next_goal: string;
}

interface AchievementForm {
  title: string;
  category: string;
  achievement_date: string;
  description: string;
  what_i_learned: string;
  growth_reflection: string;
  impact: string;
}

const initialGrowthForm: GrowthForm = {
  record_type: "growth",
  title: "",
  activity_date: "",
  what_i_did: "",
  what_i_learned: "",
  how_i_grew: "",
  impact: "",
  next_goal: "",
};

const initialAchievementForm: AchievementForm = {
  title: "",
  category: "Other",
  achievement_date: "",
  description: "",
  what_i_learned: "",
  growth_reflection: "",
  impact: "",
};

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

  const [growthRecords, setGrowthRecords] =
    useState<GrowthRecord[]>([]);

  const [achievements, setAchievements] =
    useState<Achievement[]>([]);

  const [quarterlyReviews, setQuarterlyReviews] =
    useState<QuarterlyReview[]>([]);

  const [awards, setAwards] =
    useState<Award[]>([]);

  const [growthForm, setGrowthForm] =
    useState<GrowthForm>(initialGrowthForm);

  const [achievementForm, setAchievementForm] =
    useState<AchievementForm>(
      initialAchievementForm
    );

  const [showGrowthForm, setShowGrowthForm] =
    useState(false);

  const [showAchievementForm, setShowAchievementForm] =
    useState(false);

  const [submittingGrowth, setSubmittingGrowth] =
    useState(false);

  const [submittingAchievement, setSubmittingAchievement] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("overview");

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

      if (userError || !user) {
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

      if (data.status === "active") {
        await loadTeenRecords(data.id);
      }
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

  const loadTeenRecords = async (
    profileId: string
  ) => {
    const [
      growthResult,
      achievementResult,
      reviewResult,
      awardResult,
    ] = await Promise.all([
      supabase
        .from("teen_growth_records")
        .select("*")
        .eq("profile_id", profileId)
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("achievements")
        .select("*")
        .eq("profile_id", profileId)
        .order("submitted_at", {
          ascending: false,
        }),

      supabase
        .from("quarterly_reviews")
        .select("*")
        .eq("profile_id", profileId)
        .order("year", {
          ascending: false,
        })
        .order("quarter", {
          ascending: false,
        }),

      supabase
        .from("awards")
        .select("*")
        .eq("profile_id", profileId)
        .order("award_date", {
          ascending: false,
        }),
    ]);

    if (growthResult.error) {
      console.error(
        "GROWTH RECORD LOAD ERROR:",
        growthResult.error
      );
    }

    if (achievementResult.error) {
      console.error(
        "ACHIEVEMENT LOAD ERROR:",
        achievementResult.error
      );
    }

    if (reviewResult.error) {
      console.error(
        "QUARTERLY REVIEW LOAD ERROR:",
        reviewResult.error
      );
    }

    if (awardResult.error) {
      console.error(
        "AWARD LOAD ERROR:",
        awardResult.error
      );
    }

    setGrowthRecords(
      growthResult.data || []
    );

    setAchievements(
      achievementResult.data || []
    );

    setQuarterlyReviews(
      reviewResult.data || []
    );

    setAwards(
      awardResult.data || []
    );
  };

  useEffect(() => {
    loadMember();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
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

  const handleGrowthChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setGrowthForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleAchievementChange = (
    e: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setAchievementForm((previous) => ({
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

  const handleSubmitGrowth = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    setSubmittingGrowth(true);
    setError("");
    setSuccess("");

    try {
      if (
        !growthForm.title.trim() ||
        !growthForm.activity_date.trim() ||
        !growthForm.what_i_did.trim()
      ) {
        throw new Error(
          "Please complete the required growth record fields."
        );
      }

      const {
        error: insertError,
      } = await supabase
        .from("teen_growth_records")
        .insert({
          profile_id: profile.id,

          record_type:
            growthForm.record_type,

          title:
            growthForm.title.trim(),

          activity_date:
            growthForm.activity_date,

          what_i_did:
            growthForm.what_i_did.trim(),

          what_i_learned:
            growthForm.what_i_learned.trim() ||
            null,

          how_i_grew:
            growthForm.how_i_grew.trim() ||
            null,

          impact:
            growthForm.impact.trim() ||
            null,

          next_goal:
            growthForm.next_goal.trim() ||
            null,

          status: "pending",

          points: 0,
        });

      if (insertError) {
        throw insertError;
      }

      setGrowthForm(
        initialGrowthForm
      );

      setShowGrowthForm(false);

      setSuccess(
        "Your growth record has been submitted for review."
      );

      await loadTeenRecords(
        profile.id
      );
    } catch (submitError: any) {
      console.error(
        "GROWTH SUBMISSION ERROR:",
        submitError
      );

      setError(
        submitError?.message ||
          "Unable to submit your growth record."
      );
    } finally {
      setSubmittingGrowth(false);
    }
  };

  const handleSubmitAchievement = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!profile) {
      return;
    }

    setSubmittingAchievement(true);
    setError("");
    setSuccess("");

    try {
      if (
        !achievementForm.title.trim() ||
        !achievementForm.category.trim() ||
        !achievementForm.achievement_date.trim() ||
        !achievementForm.description.trim()
      ) {
        throw new Error(
          "Please complete the required achievement fields."
        );
      }

      const {
        error: insertError,
      } = await supabase
        .from("achievements")
        .insert({
          profile_id: profile.id,

          title:
            achievementForm.title.trim(),

          category:
            achievementForm.category.trim(),

          achievement_date:
            achievementForm.achievement_date,

          description:
            achievementForm.description.trim(),

          what_i_learned:
            achievementForm.what_i_learned.trim() ||
            null,

          growth_reflection:
            achievementForm.growth_reflection.trim() ||
            null,

          impact:
            achievementForm.impact.trim() ||
            null,

          status: "pending",

          points: 0,
        });

      if (insertError) {
        throw insertError;
      }

      setAchievementForm(
        initialAchievementForm
      );

      setShowAchievementForm(false);

      setSuccess(
        "Your achievement has been submitted for review."
      );

      await loadTeenRecords(
        profile.id
      );
    } catch (submitError: any) {
      console.error(
        "ACHIEVEMENT SUBMISSION ERROR:",
        submitError
      );

      setError(
        submitError?.message ||
          "Unable to submit your achievement."
      );
    } finally {
      setSubmittingAchievement(false);
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

  const approvedAchievements =
    achievements.filter(
      (item) =>
        item.status === "approved"
    );

  const approvedGrowthRecords =
    growthRecords.filter(
      (item) =>
        item.status === "approved"
    );

  /*
   * =========================================================
   * TOTAL POINTS
   * =========================================================
   *
   * Only APPROVED records count.
   *
   * Total =
   * Approved Growth Points
   * +
   * Approved Achievement Points
   *
   * Pending and rejected records contribute 0 points.
   */
  const growthPoints =
    approvedGrowthRecords.reduce(
      (total, item) =>
        total + (Number(item.points) || 0),
      0
    );

  const achievementPoints =
    approvedAchievements.reduce(
      (total, item) =>
        total + (Number(item.points) || 0),
      0
    );

  const totalPoints =
    growthPoints +
    achievementPoints;

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

          {isActive && (
            <section className="teen-dashboard-section">

              <div className="teen-dashboard-header">

                <div>
                  <span className="teen-dashboard-label">
                    YOUR TCA JOURNEY
                  </span>

                  <h2>
                    Track Your Growth
                  </h2>

                  <p>
                    Record what you are doing,
                    what you are learning, and
                    how you are growing.
                  </p>
                </div>

              </div>

              <div className="teen-dashboard-nav">

                <button
                  type="button"
                  className={
                    activeSection === "overview"
                      ? "teen-nav-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveSection(
                      "overview"
                    )
                  }
                >
                  Overview
                </button>

                <button
                  type="button"
                  className={
                    activeSection === "records"
                      ? "teen-nav-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveSection(
                      "records"
                    )
                  }
                >
                  My Records
                </button>

                <button
                  type="button"
                  className={
                    activeSection === "achievements"
                      ? "teen-nav-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveSection(
                      "achievements"
                    )
                  }
                >
                  Achievements
                </button>

                <button
                  type="button"
                  className={
                    activeSection === "feedback"
                      ? "teen-nav-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveSection(
                      "feedback"
                    )
                  }
                >
                  Quarterly Feedback
                </button>

                <button
                  type="button"
                  className={
                    activeSection === "awards"
                      ? "teen-nav-active"
                      : ""
                  }
                  onClick={() =>
                    setActiveSection(
                      "awards"
                    )
                  }
                >
                  Awards
                </button>

              </div>

              {activeSection === "overview" && (
                <>

                  <div className="teen-growth-actions">

                    <button
                      type="button"
                      onClick={() => {
                        setShowGrowthForm(
                          !showGrowthForm
                        );

                        setShowAchievementForm(
                          false
                        );
                      }}
                    >
                      + Add Growth Record
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAchievementForm(
                          !showAchievementForm
                        );

                        setShowGrowthForm(
                          false
                        );
                      }}
                    >
                      + Submit Achievement
                    </button>

                  </div>

                  <div className="teen-achievement-panel">

                    <div>

                      <span className="teen-dashboard-label">
                        YOUR PROGRESS
                      </span>

                      <h2>
                        Keep building your journey
                      </h2>

                      <p>
                        Every meaningful experience
                        you record can become part of
                        your TCA growth history.
                        Approved records may contribute
                        to your recognition and awards.
                      </p>

                    </div>

                    <div className="teen-achievement-stats">

                      <div>
                        <strong>
                          {approvedGrowthRecords.length}
                        </strong>

                        <span>
                          Approved Growth Records
                        </span>
                      </div>

                      <div>
                        <strong>
                          {approvedAchievements.length}
                        </strong>

                        <span>
                          Approved Achievements
                        </span>
                      </div>

                      <div>
                        <strong>
                          {totalPoints}
                        </strong>

                        <span>
                          Points Earned
                        </span>
                      </div>

                    </div>

                  </div>

                  <div className="teen-growth-info">

                    <h3>
                      How your growth journey works
                    </h3>

                    <div className="teen-growth-steps">

                      <div>
                        <strong>
                          01
                        </strong>

                        <h4>
                          Participate
                        </h4>

                        <p>
                          Take part in programs,
                          projects, leadership,
                          learning and community
                          activities.
                        </p>
                      </div>

                      <div>
                        <strong>
                          02
                        </strong>

                        <h4>
                          Record
                        </h4>

                        <p>
                          Write about what you did,
                          what you learned and
                          how the experience helped
                          you grow.
                        </p>
                      </div>

                      <div>
                        <strong>
                          03
                        </strong>

                        <h4>
                          Get Reviewed
                        </h4>

                        <p>
                          TCA reviews your submissions
                          and records approved
                          achievements.
                        </p>
                      </div>

                      <div>
                        <strong>
                          04
                        </strong>

                        <h4>
                          Grow & Be Recognized
                        </h4>

                        <p>
                          Your progress is considered
                          during quarterly reviews
                          and award decisions.
                        </p>
                      </div>

                    </div>

                  </div>

                </>
              )}

              {activeSection === "records" && (
                <div className="teen-section-content">

                  <div className="teen-section-title">

                    <div>
                      <span className="teen-dashboard-label">
                        GROWTH JOURNAL
                      </span>

                      <h2>
                        My Growth Records
                      </h2>

                      <p>
                        Keep a record of the experiences
                        that are helping you develop.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowGrowthForm(
                          !showGrowthForm
                        )
                      }
                    >
                      + Add Record
                    </button>

                  </div>

                  {showGrowthForm && (
                    <form
                      className="teen-input-form"
                      onSubmit={
                        handleSubmitGrowth
                      }
                    >

                      <h3>
                        Record a Growth Experience
                      </h3>

                      <p>
                        Write honestly and give enough
                        detail for the TCA team to
                        understand your experience.
                      </p>

                      <div className="teen-form-grid">

                        <div className="teen-form-field">

                          <label>
                            Type of Record
                          </label>

                          <select
                            name="record_type"
                            value={
                              growthForm.record_type
                            }
                            onChange={
                              handleGrowthChange
                            }
                          >

                            <option value="growth">
                              General Growth
                            </option>

                            <option value="skill">
                              Skill Development
                            </option>

                            <option value="training">
                              Training / Course
                            </option>

                            <option value="leadership">
                              Leadership
                            </option>

                            <option value="community_service">
                              Community Service
                            </option>

                            <option value="project">
                              Project
                            </option>

                            <option value="competition">
                              Competition
                            </option>

                            <option value="academic">
                              Academic
                            </option>

                            <option value="other">
                              Other
                            </option>

                          </select>

                        </div>

                        <div className="teen-form-field">

                          <label>
                            Date
                          </label>

                          <input
                            name="activity_date"
                            type="date"
                            value={
                              growthForm.activity_date
                            }
                            onChange={
                              handleGrowthChange
                            }
                            required
                          />

                        </div>

                      </div>

                      <div className="teen-form-field">

                        <label>
                          Title
                        </label>

                        <input
                          name="title"
                          value={
                            growthForm.title
                          }
                          onChange={
                            handleGrowthChange
                          }
                          placeholder="e.g. Completed my first coding project"
                          required
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          What did you do?
                        </label>

                        <textarea
                          name="what_i_did"
                          value={
                            growthForm.what_i_did
                          }
                          onChange={
                            handleGrowthChange
                          }
                          rows={7}
                          placeholder="Write about the experience in detail..."
                          required
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          What did you learn?
                        </label>

                        <textarea
                          name="what_i_learned"
                          value={
                            growthForm.what_i_learned
                          }
                          onChange={
                            handleGrowthChange
                          }
                          rows={6}
                          placeholder="What knowledge, skills or lessons did you gain?"
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          How did this help you grow?
                        </label>

                        <textarea
                          name="how_i_grew"
                          value={
                            growthForm.how_i_grew
                          }
                          onChange={
                            handleGrowthChange
                          }
                          rows={6}
                          placeholder="Explain how this experience changed or improved you."
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          What impact did you make?
                        </label>

                        <textarea
                          name="impact"
                          value={
                            growthForm.impact
                          }
                          onChange={
                            handleGrowthChange
                          }
                          rows={6}
                          placeholder="Tell us about the impact you made on others, your school, team or community."
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          What is your next goal?
                        </label>

                        <textarea
                          name="next_goal"
                          value={
                            growthForm.next_goal
                          }
                          onChange={
                            handleGrowthChange
                          }
                          rows={5}
                          placeholder="What do you want to accomplish next?"
                        />

                      </div>

                      <div className="teen-form-actions">

                        <button
                          type="submit"
                          disabled={
                            submittingGrowth
                          }
                        >
                          {submittingGrowth
                            ? "Submitting..."
                            : "Submit Growth Record"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setShowGrowthForm(
                              false
                            )
                          }
                          disabled={
                            submittingGrowth
                          }
                        >
                          Cancel
                        </button>

                      </div>

                    </form>
                  )}

                  {growthRecords.length === 0 ? (

                    <div className="teen-empty-state">

                      <h3>
                        Your growth journal is empty
                      </h3>

                      <p>
                        Start recording your experiences,
                        learning and development.
                      </p>

                    </div>

                  ) : (

                    <div className="teen-record-list">

                      {growthRecords.map(
                        (record) => (

                          <article
                            className="teen-record-card"
                            key={record.id}
                          >

                            <div className="teen-record-top">

                              <div>

                                <span className="teen-record-type">
                                  {record.record_type
                                    .replace(
                                      /_/g,
                                      " "
                                    )}
                                </span>

                                <h3>
                                  {record.title}
                                </h3>

                              </div>

                              <span
                                className={`teen-status ${record.status}`}
                              >
                                {record.status}
                              </span>

                            </div>

                            <p className="teen-record-date">
                              {new Date(
                                record.activity_date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>

                            <div className="teen-record-writeup">

                              <h4>
                                What I did
                              </h4>

                              <p>
                                {record.what_i_did}
                              </p>

                              {record.what_i_learned && (
                                <>
                                  <h4>
                                    What I learned
                                  </h4>

                                  <p>
                                    {record.what_i_learned}
                                  </p>
                                </>
                              )}

                              {record.how_i_grew && (
                                <>
                                  <h4>
                                    How I grew
                                  </h4>

                                  <p>
                                    {record.how_i_grew}
                                  </p>
                                </>
                              )}

                              {record.impact && (
                                <>
                                  <h4>
                                    My impact
                                  </h4>

                                  <p>
                                    {record.impact}
                                  </p>
                                </>
                              )}

                              {record.next_goal && (
                                <>
                                  <h4>
                                    My next goal
                                  </h4>

                                  <p>
                                    {record.next_goal}
                                  </p>
                                </>
                              )}

                            </div>

                            {record.status ===
                              "approved" &&
                              record.points > 0 && (
                                <div className="teen-record-points">
                                  +{record.points} points
                                </div>
                            )}

                            {record.admin_feedback && (
                              <div className="teen-admin-feedback">

                                <strong>
                                  TCA Feedback
                                </strong>

                                <p>
                                  {record.admin_feedback}
                                </p>

                              </div>
                            )}

                          </article>

                        )
                      )}

                    </div>

                  )}

                </div>
              )}

              {activeSection === "achievements" && (
                <div className="teen-section-content">

                  <div className="teen-section-title">

                    <div>

                      <span className="teen-dashboard-label">
                        ACHIEVEMENTS
                      </span>

                      <h2>
                        My Achievements
                      </h2>

                      <p>
                        Submit meaningful achievements
                        and keep building your record.
                      </p>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setShowAchievementForm(
                          !showAchievementForm
                        )
                      }
                    >
                      + Submit Achievement
                    </button>

                  </div>

                  {showAchievementForm && (
                    <form
                      className="teen-input-form"
                      onSubmit={
                        handleSubmitAchievement
                      }
                    >

                      <h3>
                        Submit an Achievement
                      </h3>

                      <p>
                        Tell TCA what you achieved
                        and why it matters to your
                        personal growth.
                      </p>

                      <div className="teen-form-grid">

                        <div className="teen-form-field">

                          <label>
                            Achievement Title
                          </label>

                          <input
                            name="title"
                            value={
                              achievementForm.title
                            }
                            onChange={
                              handleAchievementChange
                            }
                            placeholder="e.g. Completed a leadership training"
                            required
                          />

                        </div>

                        <div className="teen-form-field">

                          <label>
                            Category
                          </label>

                          <select
                            name="category"
                            value={
                              achievementForm.category
                            }
                            onChange={
                              handleAchievementChange
                            }
                          >

                            <option>
                              Academic
                            </option>

                            <option>
                              Leadership
                            </option>

                            <option>
                              Technology
                            </option>

                            <option>
                              Community Impact
                            </option>

                            <option>
                              Skill Development
                            </option>

                            <option>
                              Competition
                            </option>

                            <option>
                              Training
                            </option>

                            <option>
                              Volunteer Work
                            </option>

                            <option>
                              Other
                            </option>

                          </select>

                        </div>

                      </div>

                      <div className="teen-form-field">

                        <label>
                          Date
                        </label>

                        <input
                          name="achievement_date"
                          type="date"
                          value={
                            achievementForm.achievement_date
                          }
                          onChange={
                            handleAchievementChange
                          }
                          required
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          Tell us about the achievement
                        </label>

                        <textarea
                          name="description"
                          value={
                            achievementForm.description
                          }
                          onChange={
                            handleAchievementChange
                          }
                          rows={8}
                          placeholder="Write a detailed account of what you achieved..."
                          required
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          What did you learn?
                        </label>

                        <textarea
                          name="what_i_learned"
                          value={
                            achievementForm.what_i_learned
                          }
                          onChange={
                            handleAchievementChange
                          }
                          rows={6}
                          placeholder="Explain what you learned from achieving this."
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          How did this contribute to your growth?
                        </label>

                        <textarea
                          name="growth_reflection"
                          value={
                            achievementForm.growth_reflection
                          }
                          onChange={
                            handleAchievementChange
                          }
                          rows={7}
                          placeholder="Reflect on how this achievement has helped you develop."
                        />

                      </div>

                      <div className="teen-form-field">

                        <label>
                          What impact did it have?
                        </label>

                        <textarea
                          name="impact"
                          value={
                            achievementForm.impact
                          }
                          onChange={
                            handleAchievementChange
                          }
                          rows={6}
                          placeholder="Describe the impact of your achievement."
                        />

                      </div>

                      <div className="teen-form-actions">

                        <button
                          type="submit"
                          disabled={
                            submittingAchievement
                          }
                        >
                          {submittingAchievement
                            ? "Submitting..."
                            : "Submit Achievement"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setShowAchievementForm(
                              false
                            )
                          }
                          disabled={
                            submittingAchievement
                          }
                        >
                          Cancel
                        </button>

                      </div>

                    </form>
                  )}

                  {achievements.length === 0 ? (

                    <div className="teen-empty-state">

                      <h3>
                        No achievements submitted yet
                      </h3>

                      <p>
                        Your achievements will appear
                        here after you submit them.
                      </p>

                    </div>

                  ) : (

                    <div className="teen-record-list">

                      {achievements.map(
                        (achievement) => (

                          <article
                            className="teen-record-card"
                            key={achievement.id}
                          >

                            <div className="teen-record-top">

                              <div>

                                <span className="teen-record-type">
                                  {achievement.category}
                                </span>

                                <h3>
                                  {achievement.title}
                                </h3>

                              </div>

                              <span
                                className={`teen-status ${achievement.status}`}
                              >
                                {achievement.status}
                              </span>

                            </div>

                            <p className="teen-record-date">
                              {new Date(
                                achievement.achievement_date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>

                            <div className="teen-record-writeup">

                              <h4>
                                Achievement
                              </h4>

                              <p>
                                {achievement.description}
                              </p>

                              {achievement.what_i_learned && (
                                <>
                                  <h4>
                                    What I learned
                                  </h4>

                                  <p>
                                    {achievement.what_i_learned}
                                  </p>
                                </>
                              )}

                              {achievement.growth_reflection && (
                                <>
                                  <h4>
                                    My growth
                                  </h4>

                                  <p>
                                    {achievement.growth_reflection}
                                  </p>
                                </>
                              )}

                              {achievement.impact && (
                                <>
                                  <h4>
                                    My impact
                                  </h4>

                                  <p>
                                    {achievement.impact}
                                  </p>
                                </>
                              )}

                            </div>

                            {achievement.status ===
                              "approved" &&
                              achievement.points > 0 && (
                                <div className="teen-record-points">
                                  +{achievement.points} points
                                </div>
                            )}

                            {achievement.admin_feedback && (
                              <div className="teen-admin-feedback">

                                <strong>
                                  TCA Feedback
                                </strong>

                                <p>
                                  {achievement.admin_feedback}
                                </p>

                              </div>
                            )}

                          </article>

                        )
                      )}

                    </div>

                  )}

                </div>
              )}

              {activeSection === "feedback" && (
                <div className="teen-section-content">

                  <div className="teen-section-title">

                    <div>

                      <span className="teen-dashboard-label">
                        QUARTERLY REVIEW
                      </span>

                      <h2>
                        My Growth Feedback
                      </h2>

                      <p>
                        TCA's quarterly reviews help
                        you understand where you are
                        growing and where you can improve.
                      </p>

                    </div>

                  </div>

                  {quarterlyReviews.length === 0 ? (

                    <div className="teen-empty-state">

                      <h3>
                        No quarterly review yet
                      </h3>

                      <p>
                        Your TCA quarterly feedback
                        will appear here when the
                        team completes your review.
                      </p>

                    </div>

                  ) : (

                    <div className="teen-review-list">

                      {quarterlyReviews.map(
                        (review) => (

                          <article
                            className="teen-review-card"
                            key={review.id}
                          >

                            <div className="teen-review-header">

                              <div>

                                <span>
                                  {review.year}
                                </span>

                                <h3>
                                  Quarter{" "}
                                  {review.quarter}
                                </h3>

                              </div>

                              {review.overall_score !==
                                null && (
                                <div className="teen-review-score">

                                  <strong>
                                    {review.overall_score}
                                  </strong>

                                  <span>
                                    Overall
                                  </span>

                                </div>
                              )}

                            </div>

                            <div className="teen-review-scores">

                              <div>
                                <span>
                                  Participation
                                </span>

                                <strong>
                                  {review.participation_score ??
                                    "—"}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Leadership
                                </span>

                                <strong>
                                  {review.leadership_score ??
                                    "—"}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Skills
                                </span>

                                <strong>
                                  {review.skill_score ??
                                    "—"}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Community Impact
                                </span>

                                <strong>
                                  {review.community_impact_score ??
                                    "—"}
                                </strong>
                              </div>

                              <div>
                                <span>
                                  Growth
                                </span>

                                <strong>
                                  {review.growth_score ??
                                    "—"}
                                </strong>
                              </div>

                            </div>

                            <div className="teen-review-feedback">

                              <h4>
                                TCA Feedback
                              </h4>

                              <p>
                                {review.feedback}
                              </p>

                            </div>

                          </article>

                        )
                      )}

                    </div>

                  )}

                </div>
              )}

              {activeSection === "awards" && (
                <div className="teen-section-content">

                  <div className="teen-section-title">

                    <div>

                      <span className="teen-dashboard-label">
                        RECOGNITION
                      </span>

                      <h2>
                        My Awards
                      </h2>

                      <p>
                        Recognition given to you by
                        Teens Connect Africa.
                      </p>

                    </div>

                  </div>

                  {awards.length === 0 ? (

                    <div className="teen-empty-state">

                      <h3>
                        No awards yet
                      </h3>

                      <p>
                        Keep participating, growing,
                        contributing and recording your
                        journey. Awards are decided by
                        the TCA team.
                      </p>

                    </div>

                  ) : (

                    <div className="teen-award-grid">

                      {awards.map(
                        (award) => (

                          <article
                            className="teen-award-card"
                            key={award.id}
                          >

                            <div className="teen-award-icon">
                              ★
                            </div>

                            <h3>
                              {award.title}
                            </h3>

                            {award.description && (
                              <p>
                                {award.description}
                              </p>
                            )}

                            <span>
                              {new Date(
                                award.award_date
                              ).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>

                          </article>

                        )
                      )}

                    </div>

                  )}

                </div>
              )}

            </section>
          )}

        </div>

      </section>

    </main>
  );
};

export default MemberPortal;