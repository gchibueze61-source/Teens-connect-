import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import "./TeenRecords.css";

type Tab =
  | "growth"
  | "achievements"
  | "reviews"
  | "awards";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  status: string | null;
  school: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  community: string | null;
};

type GrowthRecord = {
  id: string;
  profile_id: string;
  record_type: string;
  title: string;
  activity_date: string | null;
  what_i_did: string;
  what_i_learned: string | null;
  how_i_grew: string | null;
  impact: string | null;
  next_goal: string | null;
  status: string;
  points: number | null;
  admin_feedback: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type Achievement = {
  id: string;
  profile_id: string;
  title: string;
  category: string | null;
  achievement_date: string | null;
  description: string;
  what_i_learned: string | null;
  growth_reflection: string | null;
  impact: string | null;
  status: string;
  points: number | null;
  admin_feedback: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type QuarterlyReview = {
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
  feedback: string | null;
  reviewed_by: string | null;
  created_at: string;
};

type Award = {
  id: string;
  profile_id: string;
  title: string;
  description: string | null;
  award_date: string | null;
  created_at: string;
};

type ReviewTarget = {
  type: "growth" | "achievement";
  id: string;
  title: string;
};

const TeenRecords: React.FC = () => {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [quarterlyReviews, setQuarterlyReviews] = useState<
    QuarterlyReview[]
  >([]);
  const [awards, setAwards] = useState<Award[]>([]);

  const [activeTab, setActiveTab] =
    useState<Tab>("growth");

  const [selectedProfileId, setSelectedProfileId] =
    useState<string>("all");

  const [searchTerm, setSearchTerm] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedRecord, setSelectedRecord] =
    useState<GrowthRecord | null>(null);

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const [reviewTarget, setReviewTarget] =
    useState<ReviewTarget | null>(null);

  const [reviewStatus, setReviewStatus] =
    useState("approved");

  const [reviewPoints, setReviewPoints] =
    useState("0");

  const [reviewFeedback, setReviewFeedback] =
    useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        profilesResult,
        growthResult,
        achievementResult,
        reviewResult,
        awardResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(
            `
            id,
            full_name,
            email,
            status,
            school,
            country,
            state,
            city,
            community
          `
          )
          .order("full_name", {
            ascending: true,
          }),

        supabase
          .from("teen_growth_records")
          .select("*")
          .order("created_at", {
            ascending: false,
          }),

        supabase
          .from("achievements")
          .select("*")
          .order("submitted_at", {
            ascending: false,
          }),

        supabase
          .from("quarterly_reviews")
          .select("*")
          .order("year", {
            ascending: false,
          })
          .order("quarter", {
            ascending: false,
          }),

        supabase
          .from("awards")
          .select("*")
          .order("award_date", {
            ascending: false,
          }),
      ]);

      if (profilesResult.error) {
        throw profilesResult.error;
      }

      if (growthResult.error) {
        throw growthResult.error;
      }

      if (achievementResult.error) {
        throw achievementResult.error;
      }

      if (reviewResult.error) {
        throw reviewResult.error;
      }

      if (awardResult.error) {
        throw awardResult.error;
      }

      setProfiles(
        (profilesResult.data ?? []) as Profile[]
      );

      setGrowthRecords(
        (growthResult.data ?? []) as GrowthRecord[]
      );

      setAchievements(
        (achievementResult.data ??
          []) as Achievement[]
      );

      setQuarterlyReviews(
        (reviewResult.data ??
          []) as QuarterlyReview[]
      );

      setAwards(
        (awardResult.data ?? []) as Award[]
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load teen records."
      );
    } finally {
      setLoading(false);
    }
  };

  const profileMap = useMemo(() => {
    return profiles.reduce<Record<string, Profile>>(
      (map, profile) => {
        map[profile.id] = profile;
        return map;
      },
      {}
    );
  }, [profiles]);

  const getProfileName = (profileId: string) => {
    return (
      profileMap[profileId]?.full_name ||
      "Unknown Teen"
    );
  };

  const getProfileEmail = (profileId: string) => {
    return profileMap[profileId]?.email || "";
  };

  const matchesFilters = (
    profileId: string,
    status: string
  ) => {
    const profile = profileMap[profileId];

    if (!profile) {
      return false;
    }

    const search = searchTerm
      .trim()
      .toLowerCase();

    const matchesSearch =
      !search ||
      (profile.full_name ?? "")
        .toLowerCase()
        .includes(search) ||
      (profile.email ?? "")
        .toLowerCase()
        .includes(search);

    const matchesProfile =
      selectedProfileId === "all" ||
      profileId === selectedProfileId;

    const matchesStatus =
      statusFilter === "all" ||
      status === statusFilter;

    return (
      matchesSearch &&
      matchesProfile &&
      matchesStatus
    );
  };

  const filteredGrowthRecords = useMemo(() => {
    return growthRecords.filter((record) =>
      matchesFilters(
        record.profile_id,
        record.status
      )
    );
  }, [
    growthRecords,
    searchTerm,
    selectedProfileId,
    statusFilter,
    profileMap,
  ]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) =>
      matchesFilters(
        achievement.profile_id,
        achievement.status
      )
    );
  }, [
    achievements,
    searchTerm,
    selectedProfileId,
    statusFilter,
    profileMap,
  ]);

  const filteredReviews = useMemo(() => {
    return quarterlyReviews.filter((review) => {
      const profile = profileMap[review.profile_id];

      if (!profile) {
        return false;
      }

      const search = searchTerm
        .trim()
        .toLowerCase();

      const matchesSearch =
        !search ||
        (profile.full_name ?? "")
          .toLowerCase()
          .includes(search) ||
        (profile.email ?? "")
          .toLowerCase()
          .includes(search);

      const matchesProfile =
        selectedProfileId === "all" ||
        review.profile_id === selectedProfileId;

      return matchesSearch && matchesProfile;
    });
  }, [
    quarterlyReviews,
    searchTerm,
    selectedProfileId,
    profileMap,
  ]);

  const filteredAwards = useMemo(() => {
    return awards.filter((award) => {
      const profile = profileMap[award.profile_id];

      if (!profile) {
        return false;
      }

      const search = searchTerm
        .trim()
        .toLowerCase();

      const matchesSearch =
        !search ||
        (profile.full_name ?? "")
          .toLowerCase()
          .includes(search) ||
        (profile.email ?? "")
          .toLowerCase()
          .includes(search);

      const matchesProfile =
        selectedProfileId === "all" ||
        award.profile_id === selectedProfileId;

      return matchesSearch && matchesProfile;
    });
  }, [
    awards,
    searchTerm,
    selectedProfileId,
    profileMap,
  ]);

  const activeTeens = profiles.filter(
    (profile) => profile.status === "active"
  ).length;

  const pendingGrowthRecords =
    growthRecords.filter(
      (record) => record.status === "pending"
    ).length;

  const pendingAchievements =
    achievements.filter(
      (achievement) =>
        achievement.status === "pending"
    ).length;

  const approvedAchievements =
    achievements.filter(
      (achievement) =>
        achievement.status === "approved"
    ).length;

  const openReview = (
    type: "growth" | "achievement",
    id: string,
    title: string,
    currentPoints: number | null,
    currentFeedback: string | null,
    currentStatus: string
  ) => {
    setReviewTarget({
      type,
      id,
      title,
    });

    setReviewStatus(
      currentStatus === "rejected"
        ? "rejected"
        : "approved"
    );

    setReviewPoints(
      String(currentPoints ?? 0)
    );

    setReviewFeedback(
      currentFeedback ?? ""
    );

    setSuccess("");
  };

  const closeReview = () => {
    if (saving) {
      return;
    }

    setReviewTarget(null);
    setReviewFeedback("");
    setReviewPoints("0");
    setReviewStatus("approved");
  };

  const submitReview = async () => {
    if (!reviewTarget) {
      return;
    }

    const points = Number(reviewPoints);

    if (
      !Number.isFinite(points) ||
      points < 0
    ) {
      setError(
        "Points must be a valid number greater than or equal to 0."
      );
      return;
    }

    if (
      reviewStatus !== "approved" &&
      reviewStatus !== "rejected"
    ) {
      setError("Please select a valid review status.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const {
        data: authData,
      } = await supabase.auth.getUser();

      const reviewedBy =
        authData.user?.id ?? null;

      const updatePayload = {
        status: reviewStatus,
        points:
          reviewStatus === "approved"
            ? points
            : 0,
        admin_feedback:
          reviewFeedback.trim() || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: reviewedBy,
      };

      if (reviewTarget.type === "growth") {
        const { error: updateError } =
          await supabase
            .from("teen_growth_records")
            .update(updatePayload)
            .eq("id", reviewTarget.id);

        if (updateError) {
          throw updateError;
        }

        setGrowthRecords((current) =>
          current.map((record) =>
            record.id === reviewTarget.id
              ? {
                  ...record,
                  status: reviewStatus,
                  points:
                    reviewStatus === "approved"
                      ? points
                      : 0,
                  admin_feedback:
                    reviewFeedback.trim() || null,
                  reviewed_at:
                    new Date().toISOString(),
                  reviewed_by: reviewedBy,
                }
              : record
          )
        );
      } else {
        const { error: updateError } =
          await supabase
            .from("achievements")
            .update(updatePayload)
            .eq("id", reviewTarget.id);

        if (updateError) {
          throw updateError;
        }

        setAchievements((current) =>
          current.map((achievement) =>
            achievement.id === reviewTarget.id
              ? {
                  ...achievement,
                  status: reviewStatus,
                  points:
                    reviewStatus === "approved"
                      ? points
                      : 0,
                  admin_feedback:
                    reviewFeedback.trim() || null,
                  reviewed_at:
                    new Date().toISOString(),
                  reviewed_by: reviewedBy,
                }
              : achievement
          )
        );
      }

      setSuccess(
        reviewStatus === "approved"
          ? "Submission approved successfully."
          : "Submission rejected successfully."
      );

      closeReview();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save the review."
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (
    date: string | null
  ) => {
    if (!date) {
      return "Not provided";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not provided";
    }

    return parsedDate.toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getQuarterLabel = (quarter: number) => {
    return `Q${quarter}`;
  };

  const getStatusClass = (status: string) => {
    if (status === "approved") {
      return "status-approved";
    }

    if (status === "rejected") {
      return "status-rejected";
    }

    return "status-pending";
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedProfileId("all");
    setStatusFilter("all");
  };

  return (
    <main className="teen-records-page">
      <header className="teen-records-header">
        <div>
          <span className="teen-records-badge">
            TCA ADMIN
          </span>

          <h1>Teen Growth & Reviews</h1>

          <p>
            Review the work, achievements and
            development progress submitted by TCA
            teenagers.
          </p>
        </div>

        <div className="teen-records-header-actions">
          <button
            type="button"
            className="secondary-admin-button"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            Back to Dashboard
          </button>

          <button
            type="button"
            className="primary-admin-button"
            onClick={loadData}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <div className="admin-alert admin-alert-error">
          <strong>Something went wrong</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="admin-alert admin-alert-success">
          <strong>Success</strong>
          <span>{success}</span>
        </div>
      )}

      <section className="teen-stats-grid">
        <div className="teen-stat-card">
          <span>Active Teens</span>
          <strong>{activeTeens}</strong>
          <small>
            Members currently active
          </small>
        </div>

        <div className="teen-stat-card">
          <span>Pending Records</span>
          <strong>{pendingGrowthRecords}</strong>
          <small>
            Growth records awaiting review
          </small>
        </div>

        <div className="teen-stat-card">
          <span>Pending Achievements</span>
          <strong>{pendingAchievements}</strong>
          <small>
            Achievements awaiting review
          </small>
        </div>

        <div className="teen-stat-card">
          <span>Approved Achievements</span>
          <strong>{approvedAchievements}</strong>
          <small>
            Approved submissions
          </small>
        </div>
      </section>

      <section className="teen-records-controls">
        <div className="search-control">
          <label htmlFor="teen-search">
            Search teenager
          </label>

          <input
            id="teen-search"
            type="search"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
        </div>

        <div className="filter-control">
          <label htmlFor="teen-profile">
            Teenager
          </label>

          <select
            id="teen-profile"
            value={selectedProfileId}
            onChange={(event) =>
              setSelectedProfileId(
                event.target.value
              )
            }
          >
            <option value="all">
              All Teenagers
            </option>

            {profiles.map((profile) => (
              <option
                key={profile.id}
                value={profile.id}
              >
                {profile.full_name ||
                  profile.email ||
                  "Unnamed Teen"}
              </option>
            ))}
          </select>
        </div>

        {activeTab === "growth" ||
        activeTab === "achievements" ? (
          <div className="filter-control">
            <label htmlFor="record-status">
              Status
            </label>

            <select
              id="record-status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
            >
              <option value="all">
                All Statuses
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="approved">
                Approved
              </option>
              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        ) : null}

        <button
          type="button"
          className="clear-filter-button"
          onClick={clearFilters}
        >
          Clear Filters
        </button>
      </section>

      <nav className="teen-records-tabs">
        <button
          type="button"
          className={
            activeTab === "growth"
              ? "teen-tab active"
              : "teen-tab"
          }
          onClick={() => {
            setActiveTab("growth");
            setSelectedRecord(null);
            setSelectedAchievement(null);
          }}
        >
          Growth Records
          <span>{growthRecords.length}</span>
        </button>

        <button
          type="button"
          className={
            activeTab === "achievements"
              ? "teen-tab active"
              : "teen-tab"
          }
          onClick={() => {
            setActiveTab("achievements");
            setSelectedRecord(null);
            setSelectedAchievement(null);
          }}
        >
          Achievements
          <span>{achievements.length}</span>
        </button>

        <button
          type="button"
          className={
            activeTab === "reviews"
              ? "teen-tab active"
              : "teen-tab"
          }
          onClick={() => {
            setActiveTab("reviews");
            setSelectedRecord(null);
            setSelectedAchievement(null);
          }}
        >
          Quarterly Reviews
          <span>{quarterlyReviews.length}</span>
        </button>

        <button
          type="button"
          className={
            activeTab === "awards"
              ? "teen-tab active"
              : "teen-tab"
          }
          onClick={() => {
            setActiveTab("awards");
            setSelectedRecord(null);
            setSelectedAchievement(null);
          }}
        >
          Awards
          <span>{awards.length}</span>
        </button>
      </nav>

      {loading ? (
        <section className="teen-records-loading">
          <div className="loading-spinner" />
          <p>
            Loading teen development records...
          </p>
        </section>
      ) : (
        <section className="teen-records-content">
          {activeTab === "growth" && (
            <div className="records-section">
              <div className="section-heading">
                <div>
                  <h2>Growth Records</h2>
                  <p>
                    Review what each teenager has
                    done, learned and achieved through
                    their TCA journey.
                  </p>
                </div>

                <strong>
                  {filteredGrowthRecords.length}{" "}
                  record
                  {filteredGrowthRecords.length !== 1
                    ? "s"
                    : ""}
                </strong>
              </div>

              {filteredGrowthRecords.length ===
              0 ? (
                <div className="empty-state">
                  <h3>No growth records found</h3>
                  <p>
                    There are no records matching the
                    current filters.
                  </p>
                </div>
              ) : (
                <div className="records-list">
                  {filteredGrowthRecords.map(
                    (record) => (
                      <article
                        key={record.id}
                        className="record-card"
                      >
                        <div className="record-card-top">
                          <div>
                            <span className="record-type">
                              {record.record_type.replace(
                                /_/g,
                                " "
                              )}
                            </span>

                            <h3>
                              {record.title}
                            </h3>

                            <p className="teen-name">
                              {getProfileName(
                                record.profile_id
                              )}
                            </p>
                          </div>

                          <span
                            className={`status-badge ${getStatusClass(
                              record.status
                            )}`}
                          >
                            {record.status}
                          </span>
                        </div>

                        <div className="record-meta">
                          <span>
                            Activity:{" "}
                            {formatDate(
                              record.activity_date
                            )}
                          </span>

                          <span>
                            Submitted:{" "}
                            {formatDate(
                              record.created_at
                            )}
                          </span>

                          <span>
                            Points:{" "}
                            {record.points ?? 0}
                          </span>
                        </div>

                        <div className="record-preview">
                          <strong>
                            What they did
                          </strong>

                          <p>
                            {record.what_i_did}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="view-record-button"
                          onClick={() =>
                            setSelectedRecord(record)
                          }
                        >
                          View Full Record
                        </button>
                      </article>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="records-section">
              <div className="section-heading">
                <div>
                  <h2>Achievements</h2>
                  <p>
                    Review achievements submitted by
                    teenagers and award points where
                    appropriate.
                  </p>
                </div>

                <strong>
                  {filteredAchievements.length}{" "}
                  achievement
                  {filteredAchievements.length !== 1
                    ? "s"
                    : ""}
                </strong>
              </div>

              {filteredAchievements.length ===
              0 ? (
                <div className="empty-state">
                  <h3>
                    No achievements found
                  </h3>
                  <p>
                    There are no achievements matching
                    the current filters.
                  </p>
                </div>
              ) : (
                <div className="records-list">
                  {filteredAchievements.map(
                    (achievement) => (
                      <article
                        key={achievement.id}
                        className="record-card"
                      >
                        <div className="record-card-top">
                          <div>
                            <span className="record-type">
                              {achievement.category ||
                                "Achievement"}
                            </span>

                            <h3>
                              {achievement.title}
                            </h3>

                            <p className="teen-name">
                              {getProfileName(
                                achievement.profile_id
                              )}
                            </p>
                          </div>

                          <span
                            className={`status-badge ${getStatusClass(
                              achievement.status
                            )}`}
                          >
                            {achievement.status}
                          </span>
                        </div>

                        <div className="record-meta">
                          <span>
                            Date:{" "}
                            {formatDate(
                              achievement.achievement_date
                            )}
                          </span>

                          <span>
                            Submitted:{" "}
                            {formatDate(
                              achievement.submitted_at ||
                                achievement.created_at
                            )}
                          </span>

                          <span>
                            Points:{" "}
                            {achievement.points ?? 0}
                          </span>
                        </div>

                        <div className="record-preview">
                          <strong>
                            Description
                          </strong>

                          <p>
                            {achievement.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          className="view-record-button"
                          onClick={() =>
                            setSelectedAchievement(
                              achievement
                            )
                          }
                        >
                          View Full Achievement
                        </button>
                      </article>
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="records-section">
              <div className="section-heading">
                <div>
                  <h2>Quarterly Reviews</h2>
                  <p>
                    View the developmental assessment
                    and feedback given to each teen.
                  </p>
                </div>

                <strong>
                  {filteredReviews.length} review
                  {filteredReviews.length !== 1
                    ? "s"
                    : ""}
                </strong>
              </div>

              {filteredReviews.length === 0 ? (
                <div className="empty-state">
                  <h3>
                    No quarterly reviews found
                  </h3>
                  <p>
                    Quarterly reviews will appear here
                    when administrators create them.
                  </p>
                </div>
              ) : (
                <div className="reviews-grid">
                  {filteredReviews.map((review) => (
                    <article
                      key={review.id}
                      className="quarterly-review-card"
                    >
                      <div className="review-card-heading">
                        <div>
                          <span>
                            {getQuarterLabel(
                              review.quarter
                            )}{" "}
                            {review.year}
                          </span>

                          <h3>
                            {getProfileName(
                              review.profile_id
                            )}
                          </h3>

                          <p>
                            {getProfileEmail(
                              review.profile_id
                            )}
                          </p>
                        </div>

                        <strong>
                          {review.overall_score ??
                            0}
                          /100
                        </strong>
                      </div>

                      <div className="review-score-grid">
                        <div>
                          <span>
                            Participation
                          </span>
                          <strong>
                            {review.participation_score ??
                              0}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Leadership
                          </span>
                          <strong>
                            {review.leadership_score ??
                              0}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Skills
                          </span>
                          <strong>
                            {review.skill_score ?? 0}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Community Impact
                          </span>
                          <strong>
                            {review.community_impact_score ??
                              0}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Growth
                          </span>
                          <strong>
                            {review.growth_score ?? 0}
                          </strong>
                        </div>
                      </div>

                      <div className="review-feedback">
                        <strong>
                          Admin Feedback
                        </strong>

                        <p>
                          {review.feedback ||
                            "No feedback provided yet."}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "awards" && (
            <div className="records-section">
              <div className="section-heading">
                <div>
                  <h2>Awards</h2>
                  <p>
                    View awards that have been given to
                    TCA teenagers.
                  </p>
                </div>

                <strong>
                  {filteredAwards.length} award
                  {filteredAwards.length !== 1
                    ? "s"
                    : ""}
                </strong>
              </div>

              {filteredAwards.length === 0 ? (
                <div className="empty-state">
                  <h3>No awards found</h3>
                  <p>
                    Awards will appear here after an
                    administrator assigns them.
                  </p>
                </div>
              ) : (
                <div className="awards-grid">
                  {filteredAwards.map((award) => (
                    <article
                      key={award.id}
                      className="award-card"
                    >
                      <div className="award-icon">
                        ★
                      </div>

                      <div>
                        <span>
                          {formatDate(
                            award.award_date
                          )}
                        </span>

                        <h3>{award.title}</h3>

                        <p className="teen-name">
                          {getProfileName(
                            award.profile_id
                          )}
                        </p>

                        <p>
                          {award.description ||
                            "No award description provided."}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {selectedRecord && (
        <div
          className="record-modal-overlay"
          onMouseDown={() =>
            setSelectedRecord(null)
          }
        >
          <div
            className="record-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="record-type">
                  {selectedRecord.record_type.replace(
                    /_/g,
                    " "
                  )}
                </span>

                <h2>
                  {selectedRecord.title}
                </h2>

                <p>
                  {getProfileName(
                    selectedRecord.profile_id
                  )}{" "}
                  ·{" "}
                  {getProfileEmail(
                    selectedRecord.profile_id
                  )}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-meta">
                <span>
                  Activity Date:{" "}
                  {formatDate(
                    selectedRecord.activity_date
                  )}
                </span>

                <span>
                  Status:{" "}
                  {selectedRecord.status}
                </span>

                <span>
                  Points:{" "}
                  {selectedRecord.points ?? 0}
                </span>
              </div>

              <div className="submission-answer">
                <h3>What did they do?</h3>
                <p>
                  {selectedRecord.what_i_did}
                </p>
              </div>

              <div className="submission-answer">
                <h3>What did they learn?</h3>
                <p>
                  {selectedRecord.what_i_learned ||
                    "No response provided."}
                </p>
              </div>

              <div className="submission-answer">
                <h3>
                  How did this help them grow?
                </h3>
                <p>
                  {selectedRecord.how_i_grew ||
                    "No response provided."}
                </p>
              </div>

              <div className="submission-answer">
                <h3>What impact did they make?</h3>
                <p>
                  {selectedRecord.impact ||
                    "No response provided."}
                </p>
              </div>

              <div className="submission-answer">
                <h3>What are they working toward next?</h3>
                <p>
                  {selectedRecord.next_goal ||
                    "No response provided."}
                </p>
              </div>

              {selectedRecord.admin_feedback && (
                <div className="existing-feedback">
                  <strong>
                    Previous Admin Feedback
                  </strong>

                  <p>
                    {selectedRecord.admin_feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-admin-button"
                onClick={() =>
                  setSelectedRecord(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="primary-admin-button"
                onClick={() => {
                  openReview(
                    "growth",
                    selectedRecord.id,
                    selectedRecord.title,
                    selectedRecord.points,
                    selectedRecord.admin_feedback,
                    selectedRecord.status
                  );

                  setSelectedRecord(null);
                }}
              >
                Review Record
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedAchievement && (
        <div
          className="record-modal-overlay"
          onMouseDown={() =>
            setSelectedAchievement(null)
          }
        >
          <div
            className="record-modal"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="record-type">
                  {selectedAchievement.category ||
                    "Achievement"}
                </span>

                <h2>
                  {selectedAchievement.title}
                </h2>

                <p>
                  {getProfileName(
                    selectedAchievement.profile_id
                  )}{" "}
                  ·{" "}
                  {getProfileEmail(
                    selectedAchievement.profile_id
                  )}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={() =>
                  setSelectedAchievement(null)
                }
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-meta">
                <span>
                  Achievement Date:{" "}
                  {formatDate(
                    selectedAchievement.achievement_date
                  )}
                </span>

                <span>
                  Status:{" "}
                  {selectedAchievement.status}
                </span>

                <span>
                  Points:{" "}
                  {selectedAchievement.points ?? 0}
                </span>
              </div>

              <div className="submission-answer">
                <h3>Description</h3>
                <p>
                  {selectedAchievement.description}
                </p>
              </div>

              <div className="submission-answer">
                <h3>What did they learn?</h3>
                <p>
                  {selectedAchievement.what_i_learned ||
                    "No response provided."}
                </p>
              </div>

              <div className="submission-answer">
                <h3>
                  How did this achievement help them grow?
                </h3>
                <p>
                  {selectedAchievement.growth_reflection ||
                    "No response provided."}
                </p>
              </div>

              <div className="submission-answer">
                <h3>What impact did they make?</h3>
                <p>
                  {selectedAchievement.impact ||
                    "No response provided."}
                </p>
              </div>

              {selectedAchievement.admin_feedback && (
                <div className="existing-feedback">
                  <strong>
                    Previous Admin Feedback
                  </strong>

                  <p>
                    {selectedAchievement.admin_feedback}
                  </p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-admin-button"
                onClick={() =>
                  setSelectedAchievement(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="primary-admin-button"
                onClick={() => {
                  openReview(
                    "achievement",
                    selectedAchievement.id,
                    selectedAchievement.title,
                    selectedAchievement.points,
                    selectedAchievement.admin_feedback,
                    selectedAchievement.status
                  );

                  setSelectedAchievement(null);
                }}
              >
                Review Achievement
              </button>
            </div>
          </div>
        </div>
      )}

      {reviewTarget && (
        <div className="record-modal-overlay">
          <div className="review-modal">
            <div className="modal-header">
              <div>
                <span className="record-type">
                  Admin Review
                </span>

                <h2>
                  {reviewTarget.title}
                </h2>

                <p>
                  {reviewTarget.type === "growth"
                    ? "Growth Record"
                    : "Achievement"}
                </p>
              </div>

              <button
                type="button"
                className="modal-close-button"
                onClick={closeReview}
                disabled={saving}
              >
                ×
              </button>
            </div>

            <div className="review-form">
              <div className="form-group">
                <label htmlFor="review-status">
                  Decision
                </label>

                <select
                  id="review-status"
                  value={reviewStatus}
                  onChange={(event) =>
                    setReviewStatus(
                      event.target.value
                    )
                  }
                  disabled={saving}
                >
                  <option value="approved">
                    Approve
                  </option>

                  <option value="rejected">
                    Reject
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="review-points">
                  Points
                </label>

                <input
                  id="review-points"
                  type="number"
                  min="0"
                  step="1"
                  value={reviewPoints}
                  onChange={(event) =>
                    setReviewPoints(
                      event.target.value
                    )
                  }
                  disabled={
                    saving ||
                    reviewStatus === "rejected"
                  }
                />

                <small>
                  Points are awarded only when the
                  submission is approved.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="review-feedback">
                  Admin Feedback
                </label>

                <textarea
                  id="review-feedback"
                  rows={7}
                  placeholder="Write useful feedback for the teenager..."
                  value={reviewFeedback}
                  onChange={(event) =>
                    setReviewFeedback(
                      event.target.value
                    )
                  }
                  disabled={saving}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-admin-button"
                onClick={closeReview}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-admin-button"
                onClick={submitReview}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TeenRecords;