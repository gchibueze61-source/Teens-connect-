import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminTeenRecords.css";

type RecordStatus =
  | "pending"
  | "approved"
  | "rejected";

interface Teen {
  id: string;
  full_name: string;
  email: string;
  profile_image_url: string | null;
  status: string;

  age: number | null;
  phone: string | null;

  location: string | null;
  address: string | null;

  country: string | null;
  state: string | null;
  lga: string | null;
  city: string | null;

  school: string | null;
  interests: string | null;
  bio: string | null;

  role: string;

  created_at: string;
  updated_at: string | null;
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
  status: RecordStatus;
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
  status: RecordStatus;
  points: number;
  admin_feedback: string | null;
  reviewed_at: string | null;
  submitted_at: string;
}

type ActiveSection =
  | "growth"
  | "achievements";

const AdminTeenRecords: React.FC = () => {
  const navigate = useNavigate();

  const [teens, setTeens] =
    useState<Teen[]>([]);

  const [growthRecords, setGrowthRecords] =
    useState<GrowthRecord[]>([]);

  const [achievements, setAchievements] =
    useState<Achievement[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [activeSection, setActiveSection] =
    useState<ActiveSection>("growth");

  const [selectedTeenId, setSelectedTeenId] =
    useState<string>("");

  const [selectedRecord, setSelectedRecord] =
    useState<GrowthRecord | null>(null);

  const [selectedAchievement, setSelectedAchievement] =
    useState<Achievement | null>(null);

  const [reviewStatus, setReviewStatus] =
    useState<RecordStatus>("approved");

  const [points, setPoints] =
    useState<string>("0");

  const [feedback, setFeedback] =
    useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        profilesResult,
        growthResult,
        achievementsResult,
      ] = await Promise.all([
        supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            email,
            profile_image_url,
            status,
            age,
            phone,
            location,
            address,
            country,
            state,
            lga,
            city,
            school,
            interests,
            bio,
            role,
            created_at,
            updated_at
          `)
          .eq("role", "member")
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
      ]);

      if (profilesResult.error) {
        throw profilesResult.error;
      }

      if (growthResult.error) {
        throw growthResult.error;
      }

      if (achievementsResult.error) {
        throw achievementsResult.error;
      }

      setTeens(
        (profilesResult.data || []) as Teen[]
      );

      setGrowthRecords(
        (growthResult.data || []) as GrowthRecord[]
      );

      setAchievements(
        (achievementsResult.data || []) as Achievement[]
      );
    } catch (loadError: any) {
      console.error(
        "ADMIN TEEN RECORDS LOAD ERROR:",
        loadError
      );

      setError(
        loadError?.message ||
          "Unable to load teen records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /*
   * =========================================================
   * TEEN MAP
   * =========================================================
   */

  const teenMap = useMemo(() => {
    return new Map(
      teens.map((teen) => [
        teen.id,
        teen,
      ])
    );
  }, [teens]);

  /*
   * =========================================================
   * POINT CALCULATION
   *
   * ONLY APPROVED RECORDS COUNT.
   *
   * Total =
   * approved growth points
   * +
   * approved achievement points
   * =========================================================
   */

  const pointsByTeen = useMemo(() => {
    const totals: Record<
      string,
      number
    > = {};

    growthRecords.forEach(
      (record) => {
        if (
          record.status !==
          "approved"
        ) {
          return;
        }

        const current =
          totals[record.profile_id] ||
          0;

        totals[record.profile_id] =
          current +
          (Number(record.points) || 0);
      }
    );

    achievements.forEach(
      (achievement) => {
        if (
          achievement.status !==
          "approved"
        ) {
          return;
        }

        const current =
          totals[
            achievement.profile_id
          ] || 0;

        totals[
          achievement.profile_id
        ] =
          current +
          (Number(
            achievement.points
          ) || 0);
      }
    );

    return totals;
  }, [
    growthRecords,
    achievements,
  ]);

  /*
   * =========================================================
   * SEARCHED TEENS
   * =========================================================
   */

  const filteredTeens = useMemo(() => {
    const value =
      search.trim().toLowerCase();

    if (!value) {
      return [];
    }

    return teens.filter(
      (teen) =>
        teen.full_name
          ?.toLowerCase()
          .includes(value) ||
        teen.email
          ?.toLowerCase()
          .includes(value) ||
        teen.school
          ?.toLowerCase()
          .includes(value) ||
        teen.location
          ?.toLowerCase()
          .includes(value) ||
        teen.state
          ?.toLowerCase()
          .includes(value) ||
        teen.city
          ?.toLowerCase()
          .includes(value)
    );
  }, [
    teens,
    search,
  ]);

  const selectedTeen =
    selectedTeenId
      ? teenMap.get(
          selectedTeenId
        )
      : null;

  /*
   * =========================================================
   * SELECTED TEEN RECORDS
   * =========================================================
   */

  const selectedTeenGrowthRecords =
    useMemo(() => {
      if (!selectedTeenId) {
        return [];
      }

      return growthRecords.filter(
        (record) =>
          record.profile_id ===
          selectedTeenId
      );
    }, [
      growthRecords,
      selectedTeenId,
    ]);

  const selectedTeenAchievements =
    useMemo(() => {
      if (!selectedTeenId) {
        return [];
      }

      return achievements.filter(
        (achievement) =>
          achievement.profile_id ===
          selectedTeenId
      );
    }, [
      achievements,
      selectedTeenId,
    ]);

  /*
   * =========================================================
   * SEARCH RESULTS FOR EXISTING RECORD TABS
   * =========================================================
   */

  const filteredGrowthRecords =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      return growthRecords.filter(
        (record) => {
          const teen =
            teenMap.get(
              record.profile_id
            );

          if (!value) {
            return true;
          }

          return [
            teen?.full_name,
            teen?.email,
            record.title,
            record.record_type,
            record.status,
          ].some((field) =>
            field
              ?.toLowerCase()
              .includes(value)
          );
        }
      );
    }, [
      growthRecords,
      teenMap,
      search,
    ]);

  const filteredAchievements =
    useMemo(() => {
      const value =
        search.trim().toLowerCase();

      return achievements.filter(
        (achievement) => {
          const teen =
            teenMap.get(
              achievement.profile_id
            );

          if (!value) {
            return true;
          }

          return [
            teen?.full_name,
            teen?.email,
            achievement.title,
            achievement.category,
            achievement.status,
          ].some((field) =>
            field
              ?.toLowerCase()
              .includes(value)
          );
        }
      );
    }, [
      achievements,
      teenMap,
      search,
    ]);

  /*
   * =========================================================
   * SUMMARY COUNTS
   * =========================================================
   */

  const pendingGrowthCount =
    growthRecords.filter(
      (record) =>
        record.status ===
        "pending"
    ).length;

  const pendingAchievementCount =
    achievements.filter(
      (achievement) =>
        achievement.status ===
        "pending"
    ).length;

  const approvedGrowthCount =
    growthRecords.filter(
      (record) =>
        record.status ===
        "approved"
    ).length;

  const approvedAchievementCount =
    achievements.filter(
      (achievement) =>
        achievement.status ===
        "approved"
    ).length;

  const totalApprovedPoints =
    Object.values(
      pointsByTeen
    ).reduce(
      (total, value) =>
        total + value,
      0
    );

  /*
   * =========================================================
   * REVIEW FUNCTIONS
   * =========================================================
   */

  const openGrowthReview = (
    record: GrowthRecord
  ) => {
    setSelectedRecord(record);
    setSelectedAchievement(null);

    setReviewStatus(
      record.status === "rejected"
        ? "rejected"
        : "approved"
    );

    setPoints(
      String(record.points || 0)
    );

    setFeedback(
      record.admin_feedback || ""
    );

    setError("");
    setSuccess("");
  };

  const openAchievementReview = (
    achievement: Achievement
  ) => {
    setSelectedAchievement(
      achievement
    );

    setSelectedRecord(null);

    setReviewStatus(
      achievement.status ===
        "rejected"
        ? "rejected"
        : "approved"
    );

    setPoints(
      String(
        achievement.points || 0
      )
    );

    setFeedback(
      achievement.admin_feedback ||
        ""
    );

    setError("");
    setSuccess("");
  };

  const closeReview = () => {
    if (saving) {
      return;
    }

    setSelectedRecord(null);
    setSelectedAchievement(null);
    setPoints("0");
    setFeedback("");
  };

  const saveGrowthReview =
    async () => {
      if (!selectedRecord) {
        return;
      }

      const numericPoints =
        Number(points);

      if (
        !Number.isInteger(
          numericPoints
        ) ||
        numericPoints < 0
      ) {
        setError(
          "Points must be a whole number greater than or equal to 0."
        );

        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      try {
        const {
          data: userData,
        } =
          await supabase.auth.getUser();

        const reviewedAt =
          new Date().toISOString();

        const {
          error: updateError,
        } = await supabase
          .from(
            "teen_growth_records"
          )
          .update({
            status:
              reviewStatus,

            points:
              numericPoints,

            admin_feedback:
              feedback.trim() ||
              null,

            reviewed_at:
              reviewedAt,

            reviewed_by:
              userData.user?.id ||
              null,

            updated_at:
              reviewedAt,
          })
          .eq(
            "id",
            selectedRecord.id
          );

        if (updateError) {
          throw updateError;
        }

        setGrowthRecords(
          (previous) =>
            previous.map(
              (record) =>
                record.id ===
                selectedRecord.id
                  ? {
                      ...record,

                      status:
                        reviewStatus,

                      points:
                        numericPoints,

                      admin_feedback:
                        feedback.trim() ||
                        null,

                      reviewed_at:
                        reviewedAt,
                    }
                  : record
            )
        );

        setSuccess(
          "Growth record reviewed successfully."
        );

        closeReview();
      } catch (reviewError: any) {
        console.error(
          "GROWTH REVIEW ERROR:",
          reviewError
        );

        setError(
          reviewError?.message ||
            "Unable to review this growth record."
        );
      } finally {
        setSaving(false);
      }
    };

  const saveAchievementReview =
    async () => {
      if (!selectedAchievement) {
        return;
      }

      const numericPoints =
        Number(points);

      if (
        !Number.isInteger(
          numericPoints
        ) ||
        numericPoints < 0
      ) {
        setError(
          "Points must be a whole number greater than or equal to 0."
        );

        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      try {
        const {
          data: userData,
        } =
          await supabase.auth.getUser();

        const reviewedAt =
          new Date().toISOString();

        const {
          error: updateError,
        } = await supabase
          .from("achievements")
          .update({
            status:
              reviewStatus,

            points:
              numericPoints,

            admin_feedback:
              feedback.trim() ||
              null,

            reviewed_at:
              reviewedAt,

            reviewed_by:
              userData.user?.id ||
              null,

            updated_at:
              reviewedAt,
          })
          .eq(
            "id",
            selectedAchievement.id
          );

        if (updateError) {
          throw updateError;
        }

        setAchievements(
          (previous) =>
            previous.map(
              (achievement) =>
                achievement.id ===
                selectedAchievement.id
                  ? {
                      ...achievement,

                      status:
                        reviewStatus,

                      points:
                        numericPoints,

                      admin_feedback:
                        feedback.trim() ||
                        null,

                      reviewed_at:
                        reviewedAt,
                    }
                  : achievement
            )
        );

        setSuccess(
          "Achievement reviewed successfully."
        );

        closeReview();
      } catch (reviewError: any) {
        console.error(
          "ACHIEVEMENT REVIEW ERROR:",
          reviewError
        );

        setError(
          reviewError?.message ||
            "Unable to review this achievement."
        );
      } finally {
        setSaving(false);
      }
    };

  /*
   * =========================================================
   * HELPERS
   * =========================================================
   */

  const getStatusClass = (
    status: string
  ) => {
    if (status === "approved") {
      return "approved";
    }

    if (status === "rejected") {
      return "rejected";
    }

    return "pending";
  };

  const formatDate = (
    date: string
  ) => {
    if (!date) {
      return "Not provided";
    }

    return new Date(
      date
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatFullDate = (
    date: string
  ) => {
    if (!date) {
      return "Not provided";
    }

    return new Date(
      date
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const selectTeen = (
    teenId: string
  ) => {
    setSelectedTeenId(
      teenId
    );

    setError("");
    setSuccess("");
  };

  const clearTeenSelection = () => {
    setSelectedTeenId("");
  };

  return (
    <main className="admin-teen-records-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-teen-records-header">

        <div>

          <button
            type="button"
            className="admin-teen-back-button"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            ← Back to Dashboard
          </button>

          <span className="admin-teen-badge">
            TCA ADMIN
          </span>

          <h1>
            Teen Progress & Reviews
          </h1>

          <p>
            Review the work, growth,
            achievements and development
            records submitted by TCA members.
          </p>

        </div>

        <button
          type="button"
          className="admin-teen-refresh-button"
          onClick={loadData}
          disabled={loading}
        >
          {loading
            ? "Refreshing..."
            : "Refresh Records"}
        </button>

      </header>


      {/* =====================================================
          MESSAGES
      ===================================================== */}

      {error && (
        <div className="admin-teen-message error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-teen-message success">
          {success}
        </div>
      )}


      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <section className="admin-teen-summary">

        <div className="admin-teen-summary-card">
          <span>
            Registered Teens
          </span>

          <strong>
            {teens.length}
          </strong>
        </div>


        <div className="admin-teen-summary-card">
          <span>
            Growth Records
          </span>

          <strong>
            {growthRecords.length}
          </strong>
        </div>


        <div className="admin-teen-summary-card">
          <span>
            Pending Growth
          </span>

          <strong>
            {pendingGrowthCount}
          </strong>
        </div>


        <div className="admin-teen-summary-card">
          <span>
            Pending Achievements
          </span>

          <strong>
            {pendingAchievementCount}
          </strong>
        </div>


        <div className="admin-teen-summary-card">
          <span>
            Approved Growth
          </span>

          <strong>
            {approvedGrowthCount}
          </strong>
        </div>


        <div className="admin-teen-summary-card">
          <span>
            Approved Achievements
          </span>

          <strong>
            {approvedAchievementCount}
          </strong>
        </div>


        <div className="admin-teen-summary-card">
          <span>
            Total Approved Points
          </span>

          <strong>
            {totalApprovedPoints}
          </strong>
        </div>

      </section>


      {/* =====================================================
          SEARCH
      ===================================================== */}

      <section className="admin-teen-controls">

        <div className="admin-teen-tabs">

          <button
            type="button"
            className={
              activeSection ===
              "growth"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveSection(
                "growth"
              );
              closeReview();
            }}
          >
            Growth Records

            {pendingGrowthCount >
              0 && (
              <span>
                {pendingGrowthCount}
              </span>
            )}

          </button>


          <button
            type="button"
            className={
              activeSection ===
              "achievements"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveSection(
                "achievements"
              );
              closeReview();
            }}
          >
            Achievements

            {pendingAchievementCount >
              0 && (
              <span>
                {pendingAchievementCount}
              </span>
            )}

          </button>

        </div>


        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(
              event.target.value
            );

            if (
              !event.target.value.trim()
            ) {
              setSelectedTeenId("");
            }
          }}
          placeholder="Search teen by name, email, school..."
          className="admin-teen-search"
        />

      </section>


      {/* =====================================================
          TEEN SEARCH RESULTS
      ===================================================== */}

      {search.trim() && (
        <section
          style={{
            marginBottom:
              "30px",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              gap: "15px",
              marginBottom:
                "15px",
            }}
          >

            <div>

              <h2
                style={{
                  margin:
                    "0 0 5px",
                }}
              >
                Teen Members
              </h2>

              <p
                style={{
                  margin: 0,
                }}
              >
                Search results for
                <strong>
                  {" "}
                  "{search}"
                </strong>
              </p>

            </div>

          </div>


          {filteredTeens.length ===
          0 ? (

            <div
              className="admin-teen-empty"
            >
              <h3>
                No teen member found
              </h3>

              <p>
                Try searching by the
                teen's name, email,
                school or location.
              </p>
            </div>

          ) : (

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "18px",
              }}
            >

              {filteredTeens.map(
                (teen) => {

                  const teenTotal =
                    pointsByTeen[
                      teen.id
                    ] || 0;

                  const isSelected =
                    selectedTeenId ===
                    teen.id;

                  return (
                    <article
                      key={teen.id}
                      style={{
                        border:
                          isSelected
                            ? "2px solid currentColor"
                            : "1px solid rgba(0,0,0,0.12)",
                        borderRadius:
                          "14px",
                        padding:
                          "20px",
                        background:
                          "#fff",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          alignItems:
                            "center",
                          gap:
                            "14px",
                          marginBottom:
                            "16px",
                        }}
                      >

                        <div
                          style={{
                            width:
                              "58px",
                            height:
                              "58px",
                            borderRadius:
                              "50%",
                            overflow:
                              "hidden",
                            display:
                              "flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            background:
                              "#eee",
                            flexShrink:
                              0,
                            fontWeight:
                              700,
                            fontSize:
                              "22px",
                          }}
                        >

                          {teen.profile_image_url ? (
                            <img
                              src={
                                teen.profile_image_url
                              }
                              alt=""
                              style={{
                                width:
                                  "100%",
                                height:
                                  "100%",
                                objectFit:
                                  "cover",
                              }}
                            />
                          ) : (
                            teen.full_name
                              ?.charAt(
                                0
                              )
                              .toUpperCase() ||
                            "T"
                          )}

                        </div>


                        <div>

                          <h3
                            style={{
                              margin:
                                "0 0 4px",
                            }}
                          >
                            {teen.full_name}
                          </h3>

                          <p
                            style={{
                              margin: 0,
                              fontSize:
                                "13px",
                              opacity:
                                0.7,
                            }}
                          >
                            {teen.email}
                          </p>

                        </div>

                      </div>


                      <div
                        style={{
                          display:
                            "grid",
                          gridTemplateColumns:
                            "1fr 1fr",
                          gap:
                            "10px",
                          marginBottom:
                            "16px",
                        }}
                      >

                        <div>
                          <small>
                            Status
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                            }}
                          >
                            {teen.status}
                          </strong>
                        </div>


                        <div>
                          <small>
                            School
                          </small>

                          <strong
                            style={{
                              display:
                                "block",
                            }}
                          >
                            {teen.school ||
                              "Not provided"}
                          </strong>
                        </div>

                      </div>


                      <div
                        style={{
                          padding:
                            "14px",
                          borderRadius:
                            "10px",
                          marginBottom:
                            "15px",
                          background:
                            "rgba(0,0,0,0.04)",
                        }}
                      >

                        <small>
                          Total Approved Points
                        </small>

                        <strong
                          style={{
                            display:
                              "block",
                            fontSize:
                              "28px",
                            marginTop:
                              "4px",
                          }}
                        >
                          {teenTotal}
                        </strong>

                      </div>


                      <button
                        type="button"
                        onClick={() =>
                          selectTeen(
                            teen.id
                          )
                        }
                        style={{
                          width:
                            "100%",
                          padding:
                            "11px 15px",
                          borderRadius:
                            "8px",
                          border:
                            "none",
                          cursor:
                            "pointer",
                          fontWeight:
                            600,
                        }}
                      >
                        {isSelected
                          ? "Teen Details Open"
                          : "View Teen Details"}
                      </button>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>
      )}


      {/* =====================================================
          SELECTED TEEN COMPLETE PROFILE
      ===================================================== */}

      {selectedTeen && (
        <section
          style={{
            marginBottom:
              "35px",
            borderRadius:
              "16px",
            padding:
              "25px",
            background:
              "#fff",
            border:
              "1px solid rgba(0,0,0,0.12)",
          }}
        >

          <div
            style={{
              display:
                "flex",
              justifyContent:
                "space-between",
              alignItems:
                "flex-start",
              gap:
                "20px",
              flexWrap:
                "wrap",
              marginBottom:
                "25px",
            }}
          >

            <div
              style={{
                display:
                  "flex",
                alignItems:
                  "center",
                gap:
                  "18px",
              }}
            >

              <div
                style={{
                  width:
                    "85px",
                  height:
                    "85px",
                  borderRadius:
                    "50%",
                  overflow:
                    "hidden",
                  background:
                    "#eee",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  fontSize:
                    "30px",
                  fontWeight:
                    700,
                }}
              >

                {selectedTeen.profile_image_url ? (
                  <img
                    src={
                      selectedTeen.profile_image_url
                    }
                    alt=""
                    style={{
                      width:
                        "100%",
                      height:
                        "100%",
                      objectFit:
                        "cover",
                    }}
                  />
                ) : (
                  selectedTeen.full_name
                    ?.charAt(
                      0
                    )
                    .toUpperCase() ||
                  "T"
                )}

              </div>


              <div>

                <span
                  style={{
                    fontSize:
                      "12px",
                    fontWeight:
                      700,
                    opacity:
                      0.65,
                  }}
                >
                  TEEN MEMBER
                </span>

                <h2
                  style={{
                    margin:
                      "5px 0",
                  }}
                >
                  {selectedTeen.full_name}
                </h2>

                <p
                  style={{
                    margin: 0,
                  }}
                >
                  {selectedTeen.email}
                </p>

              </div>

            </div>


            <button
              type="button"
              onClick={
                clearTeenSelection
              }
              style={{
                padding:
                  "10px 15px",
                borderRadius:
                  "8px",
                border:
                  "1px solid rgba(0,0,0,0.15)",
                background:
                  "transparent",
                cursor:
                  "pointer",
              }}
            >
              Close Teen Details
            </button>

          </div>


          {/* TOTAL POINTS */}

          <div
            style={{
              padding:
                "20px",
              borderRadius:
                "14px",
              marginBottom:
                "25px",
              background:
                "rgba(0,0,0,0.04)",
            }}
          >

            <span>
              TOTAL APPROVED POINTS
            </span>

            <strong
              style={{
                display:
                  "block",
                fontSize:
                  "40px",
                marginTop:
                  "5px",
              }}
            >
              {pointsByTeen[
                selectedTeen.id
              ] || 0}
            </strong>

            <small>
              Approved growth records
              + approved achievements
            </small>

          </div>


          {/* PROFILE DETAILS */}

          <div
            style={{
              display:
                "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap:
                "18px",
              marginBottom:
                "30px",
            }}
          >

            <ProfileDetail
              label="Full Name"
              value={
                selectedTeen.full_name
              }
            />

            <ProfileDetail
              label="Email"
              value={
                selectedTeen.email
              }
            />

            <ProfileDetail
              label="Age"
              value={
                selectedTeen.age
                  ? String(
                      selectedTeen.age
                    )
                  : "Not provided"
              }
            />

            <ProfileDetail
              label="Phone"
              value={
                selectedTeen.phone ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="Present Location"
              value={
                selectedTeen.location ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="Residential Address"
              value={
                selectedTeen.address ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="Country"
              value={
                selectedTeen.country ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="State / Region"
              value={
                selectedTeen.state ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="LGA / District"
              value={
                selectedTeen.lga ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="City / Town"
              value={
                selectedTeen.city ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="School"
              value={
                selectedTeen.school ||
                "Not provided"
              }
            />

            <ProfileDetail
              label="Status"
              value={
                selectedTeen.status
              }
            />

            <ProfileDetail
              label="Role"
              value={
                selectedTeen.role
              }
            />

            <ProfileDetail
              label="Registered"
              value={formatFullDate(
                selectedTeen.created_at
              )}
            />

            <ProfileDetail
              label="Interests"
              value={
                selectedTeen.interests ||
                "Not provided"
              }
            />

          </div>


          {/* BIO */}

          {selectedTeen.bio && (
            <div
              style={{
                marginBottom:
                  "30px",
              }}
            >

              <h3>
                Bio
              </h3>

              <p
                style={{
                  lineHeight:
                    1.7,
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {selectedTeen.bio}
              </p>

            </div>
          )}


          {/* =================================================
              TEEN GROWTH RECORDS
          ================================================= */}

          <div
            style={{
              marginBottom:
                "30px",
            }}
          >

            <h3>
              Growth Records
            </h3>

            {selectedTeenGrowthRecords.length ===
            0 ? (

              <p>
                No growth records submitted.
              </p>

            ) : (

              <div
                style={{
                  display:
                    "grid",
                  gap:
                    "15px",
                }}
              >

                {selectedTeenGrowthRecords.map(
                  (record) => (
                    <div
                      key={
                        record.id
                      }
                      style={{
                        padding:
                          "18px",
                        border:
                          "1px solid rgba(0,0,0,0.1)",
                        borderRadius:
                          "12px",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          gap:
                            "15px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div>

                          <small>
                            {record.record_type.replace(
                              /_/g,
                              " "
                            )}
                          </small>

                          <h4
                            style={{
                              margin:
                                "5px 0",
                            }}
                          >
                            {record.title}
                          </h4>

                          <p>
                            {formatDate(
                              record.activity_date
                            )}
                          </p>

                        </div>


                        <div
                          style={{
                            textAlign:
                              "right",
                          }}
                        >

                          <strong>
                            {record.points ||
                              0}{" "}
                            points
                          </strong>

                          <span
                            className={`admin-teen-status ${getStatusClass(
                              record.status
                            )}`}
                            style={{
                              display:
                                "block",
                              marginTop:
                                "8px",
                            }}
                          >
                            {record.status}
                          </span>

                        </div>

                      </div>


                      <p
                        style={{
                          lineHeight:
                            1.7,
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {record.what_i_did}
                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          openGrowthReview(
                            record
                          )
                        }
                        style={{
                          padding:
                            "9px 14px",
                          borderRadius:
                            "7px",
                          border:
                            "none",
                          cursor:
                            "pointer",
                          fontWeight:
                            600,
                        }}
                      >
                        Review Record
                      </button>

                    </div>
                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              TEEN ACHIEVEMENTS
          ================================================= */}

          <div>

            <h3>
              Achievements
            </h3>

            {selectedTeenAchievements.length ===
            0 ? (

              <p>
                No achievements submitted.
              </p>

            ) : (

              <div
                style={{
                  display:
                    "grid",
                  gap:
                    "15px",
                }}
              >

                {selectedTeenAchievements.map(
                  (achievement) => (
                    <div
                      key={
                        achievement.id
                      }
                      style={{
                        padding:
                          "18px",
                        border:
                          "1px solid rgba(0,0,0,0.1)",
                        borderRadius:
                          "12px",
                      }}
                    >

                      <div
                        style={{
                          display:
                            "flex",
                          justifyContent:
                            "space-between",
                          gap:
                            "15px",
                          flexWrap:
                            "wrap",
                        }}
                      >

                        <div>

                          <small>
                            {
                              achievement.category
                            }
                          </small>

                          <h4
                            style={{
                              margin:
                                "5px 0",
                            }}
                          >
                            {
                              achievement.title
                            }
                          </h4>

                          <p>
                            {formatDate(
                              achievement.achievement_date
                            )}
                          </p>

                        </div>


                        <div
                          style={{
                            textAlign:
                              "right",
                          }}
                        >

                          <strong>
                            {achievement.points ||
                              0}{" "}
                            points
                          </strong>

                          <span
                            className={`admin-teen-status ${getStatusClass(
                              achievement.status
                            )}`}
                            style={{
                              display:
                                "block",
                              marginTop:
                                "8px",
                            }}
                          >
                            {
                              achievement.status
                            }
                          </span>

                        </div>

                      </div>


                      <p
                        style={{
                          lineHeight:
                            1.7,
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {
                          achievement.description
                        }
                      </p>


                      <button
                        type="button"
                        onClick={() =>
                          openAchievementReview(
                            achievement
                          )
                        }
                        style={{
                          padding:
                            "9px 14px",
                          borderRadius:
                            "7px",
                          border:
                            "none",
                          cursor:
                            "pointer",
                          fontWeight:
                            600,
                        }}
                      >
                        Review Achievement
                      </button>

                    </div>
                  )
                )}

              </div>

            )}

          </div>

        </section>
      )}


      {/* =====================================================
          NORMAL GROWTH RECORD TAB
      ===================================================== */}

      {activeSection ===
        "growth" && (
        <section className="admin-teen-content">

          <div className="admin-teen-section-heading">

            <div>

              <h2>
                Growth Records
              </h2>

              <p>
                Every submission contains
                evidence of what a teen has
                done, learned and contributed.
              </p>

            </div>

            <strong>
              {
                filteredGrowthRecords.length
              }{" "}
              record
              {filteredGrowthRecords.length !==
              1
                ? "s"
                : ""}
            </strong>

          </div>


          {loading ? (

            <div className="admin-teen-empty">
              Loading growth records...
            </div>

          ) : filteredGrowthRecords.length ===
            0 ? (

            <div className="admin-teen-empty">

              <h3>
                No growth records found
              </h3>

              <p>
                Teen submissions will
                appear here.
              </p>

            </div>

          ) : (

            <div className="admin-teen-record-grid">

              {filteredGrowthRecords.map(
                (record) => {

                  const teen =
                    teenMap.get(
                      record.profile_id
                    );

                  return (
                    <article
                      key={record.id}
                      className="admin-teen-record-card"
                    >

                      <div className="admin-teen-record-top">

                        <div className="admin-teen-person">

                          <div className="admin-teen-avatar">

                            {teen?.profile_image_url ? (
                              <img
                                src={
                                  teen.profile_image_url
                                }
                                alt=""
                              />
                            ) : (
                              teen?.full_name
                                ?.charAt(
                                  0
                                )
                                .toUpperCase() ||
                              "T"
                            )}

                          </div>


                          <div>

                            <strong>
                              {teen?.full_name ||
                                "Unknown Teen"}
                            </strong>

                            <small>
                              {teen?.email ||
                                "No email"}
                            </small>

                          </div>

                        </div>


                        <span
                          className={`admin-teen-status ${getStatusClass(
                            record.status
                          )}`}
                        >
                          {record.status}
                        </span>

                      </div>


                      <div className="admin-teen-record-meta">

                        <span>
                          {record.record_type.replace(
                            /_/g,
                            " "
                          )}
                        </span>

                        <span>
                          {formatDate(
                            record.activity_date
                          )}
                        </span>

                      </div>


                      <h3>
                        {record.title}
                      </h3>


                      <div className="admin-teen-preview">

                        <strong>
                          What they did
                        </strong>

                        <p>
                          {record.what_i_did}
                        </p>

                      </div>


                      <div className="admin-teen-record-footer">

                        <span>
                          {record.points || 0}{" "}
                          points
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            openGrowthReview(
                              record
                            )
                          }
                        >
                          Review Record
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>
      )}


      {/* =====================================================
          NORMAL ACHIEVEMENT TAB
      ===================================================== */}

      {activeSection ===
        "achievements" && (
        <section className="admin-teen-content">

          <div className="admin-teen-section-heading">

            <div>

              <h2>
                Achievements
              </h2>

              <p>
                Review achievements,
                reflections and the impact
                claimed by each teen.
              </p>

            </div>

            <strong>
              {
                filteredAchievements.length
              }{" "}
              achievement
              {filteredAchievements.length !==
              1
                ? "s"
                : ""}
            </strong>

          </div>


          {loading ? (

            <div className="admin-teen-empty">
              Loading achievements...
            </div>

          ) : filteredAchievements.length ===
            0 ? (

            <div className="admin-teen-empty">

              <h3>
                No achievements found
              </h3>

              <p>
                Teen achievement
                submissions will appear
                here.
              </p>

            </div>

          ) : (

            <div className="admin-teen-record-grid">

              {filteredAchievements.map(
                (achievement) => {

                  const teen =
                    teenMap.get(
                      achievement.profile_id
                    );

                  return (
                    <article
                      key={
                        achievement.id
                      }
                      className="admin-teen-record-card"
                    >

                      <div className="admin-teen-record-top">

                        <div className="admin-teen-person">

                          <div className="admin-teen-avatar">

                            {teen?.profile_image_url ? (
                              <img
                                src={
                                  teen.profile_image_url
                                }
                                alt=""
                              />
                            ) : (
                              teen?.full_name
                                ?.charAt(
                                  0
                                )
                                .toUpperCase() ||
                              "T"
                            )}

                          </div>


                          <div>

                            <strong>
                              {teen?.full_name ||
                                "Unknown Teen"}
                            </strong>

                            <small>
                              {teen?.email ||
                                "No email"}
                            </small>

                          </div>

                        </div>


                        <span
                          className={`admin-teen-status ${getStatusClass(
                            achievement.status
                          )}`}
                        >
                          {
                            achievement.status
                          }
                        </span>

                      </div>


                      <div className="admin-teen-record-meta">

                        <span>
                          {
                            achievement.category
                          }
                        </span>

                        <span>
                          {formatDate(
                            achievement.achievement_date
                          )}
                        </span>

                      </div>


                      <h3>
                        {
                          achievement.title
                        }
                      </h3>


                      <div className="admin-teen-preview">

                        <strong>
                          Description
                        </strong>

                        <p>
                          {
                            achievement.description
                          }
                        </p>

                      </div>


                      <div className="admin-teen-record-footer">

                        <span>
                          {achievement.points ||
                            0}{" "}
                          points
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            openAchievementReview(
                              achievement
                            )
                          }
                        >
                          Review Achievement
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>
      )}


      {/* =====================================================
          REVIEW MODAL
      ===================================================== */}

      {(selectedRecord ||
        selectedAchievement) && (

        <div className="admin-teen-review-overlay">

          <div className="admin-teen-review-modal">

            <div className="admin-teen-review-header">

              <div>

                <span>
                  ADMIN REVIEW
                </span>

                <h2>
                  {selectedRecord
                    ? selectedRecord.title
                    : selectedAchievement?.title}
                </h2>

              </div>


              <button
                type="button"
                className="admin-teen-close-button"
                onClick={
                  closeReview
                }
                disabled={saving}
              >
                ×
              </button>

            </div>


            {selectedRecord && (

              <div className="admin-teen-full-submission">

                <SubmissionBlock
                  title="What did they do?"
                  content={
                    selectedRecord.what_i_did
                  }
                />

                <SubmissionBlock
                  title="What did they learn?"
                  content={
                    selectedRecord.what_i_learned
                  }
                />

                <SubmissionBlock
                  title="How did this help them grow?"
                  content={
                    selectedRecord.how_i_grew
                  }
                />

                <SubmissionBlock
                  title="What impact did they make?"
                  content={
                    selectedRecord.impact
                  }
                />

                <SubmissionBlock
                  title="What are they working toward next?"
                  content={
                    selectedRecord.next_goal
                  }
                />

              </div>

            )}


            {selectedAchievement && (

              <div className="admin-teen-full-submission">

                <SubmissionBlock
                  title="Achievement description"
                  content={
                    selectedAchievement.description
                  }
                />

                <SubmissionBlock
                  title="What did they learn?"
                  content={
                    selectedAchievement.what_i_learned
                  }
                />

                <SubmissionBlock
                  title="Growth reflection"
                  content={
                    selectedAchievement.growth_reflection
                  }
                />

                <SubmissionBlock
                  title="Impact"
                  content={
                    selectedAchievement.impact
                  }
                />

              </div>

            )}


            <div className="admin-teen-review-form">

              <div className="admin-teen-review-grid">

                <div>

                  <label htmlFor="review-status">
                    Decision
                  </label>

                  <select
                    id="review-status"
                    value={
                      reviewStatus
                    }
                    onChange={(event) =>
                      setReviewStatus(
                        event.target
                          .value as RecordStatus
                      )
                    }
                  >

                    <option value="approved">
                      Approve
                    </option>

                    <option value="rejected">
                      Reject
                    </option>

                    <option value="pending">
                      Keep Pending
                    </option>

                  </select>

                </div>


                <div>

                  <label htmlFor="review-points">
                    Points
                  </label>

                  <input
                    id="review-points"
                    type="number"
                    min="0"
                    step="1"
                    value={
                      points
                    }
                    onChange={(event) =>
                      setPoints(
                        event.target.value
                      )
                    }
                  />

                </div>

              </div>


              <div>

                <label htmlFor="admin-feedback">
                  Feedback for Teen
                </label>

                <textarea
                  id="admin-feedback"
                  value={
                    feedback
                  }
                  onChange={(event) =>
                    setFeedback(
                      event.target.value
                    )
                  }
                  placeholder="Give constructive feedback. Explain what was strong, what can improve, and what the teen should work toward next."
                  rows={6}
                />

              </div>


              <div className="admin-teen-review-actions">

                <button
                  type="button"
                  className="admin-teen-cancel-button"
                  onClick={
                    closeReview
                  }
                  disabled={saving}
                >
                  Cancel
                </button>


                <button
                  type="button"
                  className="admin-teen-save-button"
                  onClick={
                    selectedRecord
                      ? saveGrowthReview
                      : saveAchievementReview
                  }
                  disabled={saving}
                >
                  {saving
                    ? "Saving Review..."
                    : "Save Review"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </main>
  );
};


/* =========================================================
   PROFILE DETAIL COMPONENT
========================================================= */

interface ProfileDetailProps {
  label: string;
  value: string;
}

const ProfileDetail: React.FC<
  ProfileDetailProps
> = ({
  label,
  value,
}) => {
  return (
    <div
      style={{
        padding:
          "14px",
        borderRadius:
          "10px",
        background:
          "rgba(0,0,0,0.035)",
      }}
    >

      <span
        style={{
          display:
            "block",
          fontSize:
            "12px",
          opacity:
            0.65,
          marginBottom:
            "5px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          display:
            "block",
          lineHeight:
            1.5,
          wordBreak:
            "break-word",
        }}
      >
        {value}
      </strong>

    </div>
  );
};


/* =========================================================
   SUBMISSION BLOCK
========================================================= */

interface SubmissionBlockProps {
  title: string;
  content: string | null;
}

const SubmissionBlock: React.FC<
  SubmissionBlockProps
> = ({
  title,
  content,
}) => {
  return (
    <div className="admin-teen-submission-block">

      <h4>
        {title}
      </h4>

      <p>
        {content?.trim()
          ? content
          : "No response provided."}
      </p>

    </div>
  );
};

export default AdminTeenRecords;