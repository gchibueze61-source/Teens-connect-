import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Admin.css";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(
        "Invalid email or password. Please check your details and try again."
      );
      return;
    }

    navigate("/admin/dashboard");
  };

  return (
    <main className="admin-page">
      <div className="admin-login-card">

        <div className="admin-login-header">
          <span className="admin-badge">
            TCA ADMIN
          </span>

          <h1>Welcome Back</h1>

          <p>
            Sign in to manage Teens Connect Africa.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="admin-login-form"
        >

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
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="admin-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
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