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
    let recoveryTimeout: ReturnType<typeof setTimeout> | undefined;

    const markRecoveryReady = () => {
      if (!mounted) return;
      if (recoveryTimeout) clearTimeout(recoveryTimeout);
      setRecoveryReady(true);
      setChecking(false);
      setError("");
    };

    // Subscribe before checking the URL/session so a recovery event
    // emitted during the PKCE exchange cannot be missed.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        markRecoveryReady();
      }
    });

    const verifyRecoveryLink = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );

      // Supabase recovery links use either a PKCE code in the query
      // string or a recovery token in the URL hash.
      const hasRecoveryCallback =
        queryParams.has("code") ||
        (hashParams.get("type") === "recovery" &&
          hashParams.has("access_token"));

      const hasVerifiedRecoveryEvent =
        window.sessionStorage.getItem("tca_admin_password_recovery") === "true";

      if (hasVerifiedRecoveryEvent) {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session && !sessionError) {
          markRecoveryReady();
          return;
        }

        window.sessionStorage.removeItem("tca_admin_password_recovery");
      }

      if (hasRecoveryCallback) {
        // The Supabase client-level listener records PASSWORD_RECOVERY
        // before this lazy-loaded route mounts. Wait briefly for the
        // recovery event if the PKCE exchange is still completing.
        recoveryTimeout = setTimeout(() => {
          if (!mounted) return;
          setError(
            "This password reset link is invalid or has expired. Please request a new one."
          );
          setChecking(false);
        }, 10000);

        return;
      }

      // A normal signed-in session is not proof of a password-reset
      // request. Do not allow it to open the password-change form.
      if (!mounted) return;
      setError(
        "Open this page using the password-reset link sent to your email. If the link has expired, request a new one."
      );
      setChecking(false);
    };

    void verifyRecoveryLink().catch((caught: unknown) => {
      if (!mounted) return;
      console.error("Password recovery verification failed:", caught);
      setError("Unable to verify this password reset link. Please request a new one.");
      setChecking(false);
    });

    return () => {
      mounted = false;
      if (recoveryTimeout) clearTimeout(recoveryTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!recoveryReady) {
      setError("Your password reset session could not be verified. Request a new reset link.");
      return;
    }

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

      if (updateError) throw updateError;

      await supabase.auth.signOut();

      setMessage(
        "Your password has been changed. Please sign in again using your new password."
      );
      setRecoveryReady(false);

      setTimeout(() => {
        navigate("/admin/login", { replace: true });
      }, 1500);
    } catch (caught: unknown) {
      console.error("Admin password update error:", caught);
      setError(
        caught instanceof Error
          ? caught.message
          : "Unable to update your password."
      );
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

        {error && <div className="admin-login-error" role="alert">{error}</div>}
        {message && <div className="admin-login-success" role="status">{message}</div>}

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

        {!recoveryReady && !message && (
          <button
            type="button"
            className="admin-login-button"
            onClick={() => navigate("/admin/login", { replace: true })}
          >
            Return to admin login
          </button>
        )}

        <p className="admin-login-note">
          Your password is private. TCA administrators should never share it.
        </p>
      </div>
    </main>
  );
}

export default AdminResetPassword;
