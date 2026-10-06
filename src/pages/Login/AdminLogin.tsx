import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

    if (loginError || !data.user) {
      setLoading(false);
      setError("Invalid email or password. Please try again.");
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("auth_user_id, role, status")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

    const isAdmin =
      !profileError &&
      profile?.auth_user_id === data.user.id &&
      profile?.role === "admin" &&
      profile?.status === "active";

    if (!isAdmin) {
      await supabase.auth.signOut();
      setLoading(false);
      setError("This account is not authorized to access the admin portal.");
      return;
    }

    try {
      await supabase.functions.invoke("admin-security-alert", {
        body: {
          event: "successful_admin_login",
          email: data.user.email ?? email.trim().toLowerCase(),
          occurred_at: new Date().toISOString(),
        },
      });
    } catch (alertError) {
      console.warn("Admin security alert failed:", alertError);
    }

    setLoading(false);
    navigate("/admin/dashboard", { replace: true });
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-badge">TCA ADMIN</span>
          <h1>Welcome Back</h1>
          <p>Sign in to manage Teens Connect Africa.</p>
        </div>

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
            />
          </div>

          {error && <div className="admin-login-error">{error}</div>}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="admin-login-note">Authorized administrators only.</p>
      </div>
    </main>
  );
}

export default AdminLogin;
