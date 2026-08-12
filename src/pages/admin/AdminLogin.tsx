import React, { useState } from "react";
import "./Admin.css";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    console.log("Admin login:", {
      email,
      password,
    });
  };

  return (
    <main className="admin-page">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <span className="admin-badge">TCA ADMIN</span>

          <h1>Welcome Back</h1>

          <p>
            Sign in to manage Teens Connect Africa.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">

          <div className="admin-form-group">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">
              Password
            </label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="admin-login-button"
          >
            Sign In
          </button>

        </form>

        <p className="admin-login-note">
          Admin access only.
        </p>

      </div>
    </main>
  );
};

export default AdminLogin;