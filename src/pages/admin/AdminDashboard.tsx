import React from "react";

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1>Teens Connect Africa Admin Dashboard</h1>

      <p>
        Welcome to the administration area.
      </p>

      <div>
        <h2>Content Management</h2>

        <button type="button">
          Manage Programs
        </button>

        <button type="button">
          Manage Events
        </button>

        <button type="button">
          Manage Blog
        </button>

        <button type="button">
          View Messages
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;