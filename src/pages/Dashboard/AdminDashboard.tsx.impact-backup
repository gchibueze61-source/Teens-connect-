
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      setCheckingAuth(true);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        navigate("/admin/login", { replace: true });
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      if (
        profileError ||
        !profile ||
        profile.role !== "admin" ||
        profile.status !== "active"
      ) {
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
        return;
      }

      setEmail(user.email ?? "");
      setCheckingAuth(false);
    };

    void checkAdminAccess();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (checkingAuth) {
    return (
      <main className="dashboard-loading">
        <p>Checking admin access...</p>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <span className="dashboard-badge">TCA ADMIN</span>
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {email}</p>
        </div>

        <button
          className="logout-button"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <div className="dashboard-card">
          <span>01</span>
          <h2>Programs</h2>
          <p>Add, edit and manage TCA programs.</p>
          <button type="button" onClick={() => navigate("/admin/programs")}>
            Manage Programs
          </button>
        </div>

        <div className="dashboard-card">
          <span>02</span>
          <h2>Events</h2>
          <p>Create and manage upcoming events.</p>
          <button type="button" onClick={() => navigate("/admin/events")}>
            Manage Events
          </button>
        </div>

        <div className="dashboard-card">
          <span>03</span>
          <h2>Blog</h2>
          <p>Publish and manage blog posts.</p>
          <button type="button" onClick={() => navigate("/admin/blog")}>
            Manage Blog
          </button>
        </div>

        <div className="dashboard-card">
          <span>04</span>
          <h2>Gallery</h2>
          <p>Manage images and gallery content.</p>
          <button type="button" onClick={() => navigate("/admin/gallery")}>
            Manage Gallery
          </button>
        </div>

        <div className="dashboard-card">
          <span>05</span>
          <h2>Membership</h2>
          <p>View and manage registered TCA members.</p>
          <button
            type="button"
            onClick={() => navigate("/admin/membership")}
          >
            Manage Membership
          </button>
        </div>

        <div className="dashboard-card">
          <span>06</span>
          <h2>Teen Growth & Reviews</h2>
          <p>
            Review growth submissions, achievements,
            quarterly reviews and awards.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/teen-records")}
          >
            Manage Growth & Reviews
          </button>
        </div>

        <div className="dashboard-card">
          <span>07</span>
          <h2>Teen Profiles & Progress</h2>
          <p>
            View individual teen profiles and their progress history,
            and manage submissions.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/teen-profiles")}
          >
            View Teen Profiles
          </button>
        </div>

        <div className="dashboard-card">
          <span>08</span>
          <h2>Board Members</h2>
          <p>
            Add, edit and publish board member profiles on the public website.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/board-members")}
          >
            Manage Board Members
          </button>
        </div>

        <div className="dashboard-card">
          <span>09</span>
          <h2>Team Members</h2>
          <p>
            Add, edit, organise and publish executive team member profiles
            on the public website.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/team-members")}
          >
            Manage Team Members
          </button>
        </div>

    
        <div className="dashboard-card">
          <span>10</span>
          <h2>Teen Executive Committee</h2>
          <p>
            Add, edit, organise and publish Teen Executive Committee member
            profiles on the public website.
          </p>
          <button
            type="button"
            onClick={() => navigate("/admin/teen-executive-committee")}
          >
            Manage Teen Committee
          </button>
        </div>

      </section>
    </main>
  );
};

export default AdminDashboard;
