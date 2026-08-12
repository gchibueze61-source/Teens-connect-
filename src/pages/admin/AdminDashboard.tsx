import React from "react";
import "./Admin.css";

const AdminDashboard: React.FC = () => {
  return (
    <main className="admin-dashboard">
      <div className="admin-dashboard-container">

        <div className="admin-dashboard-header">
          <div>
            <span className="admin-badge">
              TCA ADMIN
            </span>

            <h1>Dashboard</h1>

            <p>
              Manage Teens Connect Africa from one place.
            </p>
          </div>

          <button className="admin-logout-button">
            Logout
          </button>
        </div>

        <div className="admin-stats-grid">

          <div className="admin-stat-card">
            <span>Programs</span>
            <strong>0</strong>
          </div>

          <div className="admin-stat-card">
            <span>Events</span>
            <strong>0</strong>
          </div>

          <div className="admin-stat-card">
            <span>Blog Posts</span>
            <strong>0</strong>
          </div>

          <div className="admin-stat-card">
            <span>Messages</span>
            <strong>0</strong>
          </div>

        </div>

        <div className="admin-management-grid">

          <div className="admin-management-card">
            <h2>Programs</h2>

            <p>
              Add, edit and manage your programs.
            </p>

            <button>
              Manage Programs
            </button>
          </div>

          <div className="admin-management-card">
            <h2>Events</h2>

            <p>
              Create and manage upcoming events.
            </p>

            <button>
              Manage Events
            </button>
          </div>

          <div className="admin-management-card">
            <h2>Blog</h2>

            <p>
              Create and manage articles.
            </p>

            <button>
              Manage Blog
            </button>
          </div>

          <div className="admin-management-card">
            <h2>Messages</h2>

            <p>
              View messages submitted through the contact form.
            </p>

            <button>
              View Messages
            </button>
          </div>

        </div>

      </div>
    </main>
  );
};

export default AdminDashboard;