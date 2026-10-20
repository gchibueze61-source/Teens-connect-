import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./Login.css";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getActiveMemberAndContinue = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      throw new Error("Your session could not be verified. Please login again.");
    }

    // Securely link an admin-pre-created member profile to this Auth account
    // when the profile email matches the authenticated email.
    const { error: claimError } = await supabase.rpc(
      "claim_my_pending_profile"
    );

    if (claimError) {
      console.error("Profile claim check failed:", claimError);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Member profile lookup failed:", profileError);
      throw new Error("We could not load your member profile. Please try again.");
    }

    if (!profile) {
      throw new Error(
        "Your account exists, but no TCA member profile is linked to it. Please contact Teens Connect Africa."
      );
    }

    if (profile.role !== "member") {
      await supabase.auth.signOut();
      throw new Error("This login is for TCA members only.");
    }

    if (profile.status === "pending") {
      await supabase.auth.signOut();
      throw new Error("Your registration is still awaiting admin approval.");
    }

    if (profile.status === "rejected") {
      await supabase.auth.signOut();
      throw new Error("Your membership application was not approved.");
    }

    if (profile.status === "suspended") {
      await supabase.auth.signOut();
      throw new Error(
        "Your membership has been temporarily suspended. Please contact Teens Connect Africa."
      );
    }

    if (profile.status !== "active") {
      await supabase.auth.signOut();
      throw new Error("Your account is not currently active.");
    }

    navigate("/member-portal");
  };

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw new Error("Invalid email or password. Please try again.");
      }

      if (!data.user) {
        throw new Error("Unable to sign in. Please try again.");
      }

      await getActiveMemberAndContinue();
    } catch (err: any) {
      console.error("Member login error:", err);
      setError(
        err?.message || "Unable to login. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${window.location.origin}/reset-password`,
        });

      if (resetError) {
        throw resetError;
      }

      alert("Password reset instructions have been sent to your email.");
    } catch (err: any) {
      setError(
        err?.message || "Unable to send password reset instructions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <img
                src="/logo/bobdaddy%202%201580.jpg"
                alt="Teens Connect Africa"
              />
            </div>
            <h1>Welcome Back</h1>
            <p>Login to your Teens Connect Africa account</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            <div className="login-options">
              <label className="remember-me">
                <input type="checkbox" disabled={loading} />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="login-register">
            <span>Don't have an account?</span>
            <button
              type="button"
              onClick={() => navigate("/register")}
              disabled={loading}
            >
              Join the Community
            </button>
          </div>

          <button
            type="button"
            className="login-home"
            onClick={() => navigate("/")}
            disabled={loading}
          >
            ← Back to website
          </button>
        </div>
      </div>
    </main>
  );
};

export default Login;
