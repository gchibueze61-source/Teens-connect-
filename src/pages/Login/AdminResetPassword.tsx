import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminLogin.css";

function AdminResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [recoveryReady, setRecoveryReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const prepareRecovery = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session) {
        setRecoveryReady(true);
        setChecking(false);
        return;
      }

      const { data: listener } = supabase.auth.onAuthStateChange(
        (event, sessionFromEvent) => {
          if (!mounted) return;

          if (event === "PASSWORD_RECOVERY" && sessionFromEvent) {
            setRecoveryReady(true);
          }
          setChecking(false);
        }
      );

      setTimeout(async () => {
        if (!mounted) return;

        const {
          data: { session: refreshedSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (refreshedSession) {
          setRecoveryReady(true);
        } else {
          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );
        }

        setChecking(false);
      }, 500);

      return () => listener.subscription.unsubscribe();
    };

    const cleanupPromise = prepareRecovery();

    return () => {
      mounted = false;
      void cleanupPromise;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password.length < 10) {
      setError("Your new password must be at least 10 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        throw updateError;
      }

      await supabase.auth.signOut();

      setMessage(
        "Your password has been changed. Please sign in again using your new password and your administrator authenticator code."
      );

      setRecoveryReady(false);

      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 1500);
    } catch (err: any) {
      console.error("Admin password update error:", err);
      setError(err?.message || "Unable to update your password.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <span className="admin-badge">TCA ADMIN</span>
            <h1>Checking Reset Link</h1>
            <p>Please wait while we verify your password reset request.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <span className="admin-badge">TCA ADMIN</span>
          <h1>Create New Password</h1>
          <p>Choose a private password for your administrator account.</p>
        </div>

        {error && <div className="admin-login-error">{error}</div>}
        {message && <div className="admin-login-success">{message}</div>}

        {recoveryReady && (
          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                required
                disabled={loading}
                placeholder="At least 10 characters"
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                minLength={10}
                required
                disabled={loading}
                placeholder="Enter the password again"
              />
            </div>

            <button
              type="submit"
              className="admin-login-button"
              disabled={loading}
            >
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}

        <p className="admin-login-note">
          Your password is private. TCA administrators should never share it.
        </p>
      </div>
    </main>
  );
}

export default AdminResetPassword;
