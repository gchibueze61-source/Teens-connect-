import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminDashboard.css";

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setEmail(data.user.email ?? "");
      setCheckingAuth(false);
    };

    checkUser();
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
          <span className="dashboard-badge">
            TCA ADMIN
          </span>

          <h1>Admin Dashboard</h1>

          <p>
            Welcome back, {email}
          </p>
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

        {/* PROGRAMS */}
        <div className="dashboard-card">
          <span>01</span>

          <h2>Programs</h2>

          <p>
            Add, edit and manage TCA programs.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/programs")
            }
          >
            Manage Programs
          </button>
        </div>

        {/* EVENTS */}
        <div className="dashboard-card">
          <span>02</span>

          <h2>Events</h2>

          <p>
            Create and manage upcoming events.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/events")
            }
          >
            Manage Events
          </button>
        </div>

        {/* BLOG */}
        <div className="dashboard-card">
          <span>03</span>

          <h2>Blog</h2>

          <p>
            Publish and manage blog posts.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/blog")
            }
          >
            Manage Blog
          </button>
        </div>

        {/* GALLERY */}
        <div className="dashboard-card">
          <span>04</span>

          <h2>Gallery</h2>

          <p>
            Manage images and gallery content.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/gallery")
            }
          >
            Manage Gallery
          </button>
        </div>

        {/* MEMBERSHIP */}
        <div className="dashboard-card">
          <span>05</span>

          <h2>Membership</h2>

          <p>
            View and manage registered TCA members.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/admin/membership")
            }
          >
            Manage Membership
          </button>
        </div>

      </section>

    </main>
  );
};

export default AdminDashboard;