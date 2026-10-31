
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError("Enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (loginError || !data.user) {
        throw new Error(
          "Invalid email or password. Please try again."
        );
      }

      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("auth_user_id, role, status")
          .eq("auth_user_id", data.user.id)
          .maybeSingle();

      if (profileError) {
        console.error("Admin profile lookup error:", profileError);
        await supabase.auth.signOut();
        throw new Error(
          "Unable to verify your administrator account."
        );
      }

      const isAdmin =
        profile?.auth_user_id === data.user.id &&
        profile?.role === "admin" &&
        profile?.status === "active";

      if (!isAdmin) {
        await supabase.auth.signOut();
        throw new Error(
          "This account is not authorized to access the admin portal."
        );
      }

      if (rememberMe) {
        localStorage.setItem("tca_admin_remember_me", "true");
      } else {
        localStorage.removeItem("tca_admin_remember_me");
      }

      try {
        const { error: alertError } =
          await supabase.functions.invoke("admin-security-alert", {
            body: {
              event: "successful_admin_login",
              email: data.user.email ?? cleanEmail,
              occurred_at: new Date().toISOString(),
            },
          });

        if (alertError) {
          console.warn("Admin security alert failed:", alertError);
        }
      } catch (alertError) {
        console.warn("Admin security alert failed:", alertError);
      }

      navigate("/admin/dashboard", { replace: true });
    } catch (err: unknown) {
      console.error("Admin login error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError(
        "Enter your admin email address first, then click Forgot password."
      );
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const configuredAdminUrl = import.meta.env.VITE_ADMIN_APP_URL?.trim();
      const adminOrigin = configuredAdminUrl || window.location.origin;
      const resetRedirectUrl = new URL("/reset-password", adminOrigin);

      if (
        resetRedirectUrl.protocol !== "https:" &&
        resetRedirectUrl.hostname !== "localhost"
      ) {
        throw new Error("The administrator reset URL must use HTTPS.");
      }

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: resetRedirectUrl.toString(),
        });

      if (resetError) {
        throw resetError;
      }

      setSuccess(
        "Password reset instructions have been sent to your email."
      );
    } catch (err: unknown) {
      console.error("Password reset error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to send password reset instructions."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccess("");

    requestAnimationFrame(() => {
      document.getElementById("email")?.focus();
    });
  };

  const handleBackToWebsite = async () => {
    if (loading) return;

    setError("");
    setSuccess("");

    await supabase.auth.signOut();
    navigate("/", { replace: true });
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-badge">TCA ADMIN</span>
          <h1>Welcome Back</h1>
          <p>Sign in to manage Teens Connect Africa.</p>
        </div>

        {error && (
          <div className="admin-login-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-login-success" role="status">
            {success}
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              disabled={loading}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <div
            className="admin-login-options"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              marginBottom: "18px",
              flexWrap: "wrap",
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: loading ? "default" : "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
                disabled={loading}
              />
              <span>Remember me</span>
            </label>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={loading}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: loading ? "default" : "pointer",
                textDecoration: "underline",
                font: "inherit",
              }}
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          <button
            type="button"
            onClick={handleChangeEmail}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: loading ? "default" : "pointer",
              textDecoration: "underline",
              font: "inherit",
            }}
          >
            Change email
          </button>
        </div>

        <p className="admin-login-note">
          Authorized administrators only.
        </p>

        <button
          type="button"
          onClick={handleBackToWebsite}
          disabled={loading}
          style={{
            display: "block",
            margin: "12px auto 0",
            background: "none",
            border: "none",
            cursor: loading ? "default" : "pointer",
            font: "inherit",
            textDecoration: "underline",
          }}
        >
          ← Back to website
        </button>
      </div>
    </main>
  );
}

export default AdminLogin;
