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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // Login through Supabase Authentication
      const { data, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (loginError) {
        throw loginError;
      }

      if (!data.user) {
        throw new Error("Unable to sign in. Please try again.");
      }

      // Get the member's profile
      const { data: profile, error: profileError } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

      if (profileError) {
        await supabase.auth.signOut();

        throw new Error(
          "Your account exists, but your member profile could not be found."
        );
      }

      // Check membership status
      if (profile.status === "pending") {
        await supabase.auth.signOut();

        setError(
          "Your registration is still awaiting admin approval."
        );

        return;
      }

      if (profile.status === "rejected") {
        await supabase.auth.signOut();

        setError(
          "Your membership application was not approved."
        );

        return;
      }

      if (profile.status === "suspended") {
        await supabase.auth.signOut();

        setError(
          "Your membership has been temporarily suspended. Please contact Teens Connect Africa."
        );

        return;
      }

      if (profile.status !== "active") {
        await supabase.auth.signOut();

        setError(
          "Your account is not currently active."
        );

        return;
      }

      // Successful active member
      navigate("/member-portal");

    } catch (err: any) {
      console.error("Login error:", err);

      setError(
        err?.message ||
        "Unable to login. Please check your email and password."
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
      const { error } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (error) {
        throw error;
      }

      alert(
        "Password reset instructions have been sent to your email."
      );
    } catch (err: any) {
      setError(
        err?.message ||
        "Unable to send password reset instructions."
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

            <p>
              Login to your Teens Connect Africa account
            </p>

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            <div className="login-field">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

            </div>

            <div className="login-field">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

            </div>

            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                  disabled={loading}
                />

                <span>
                  Remember me
                </span>

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

            <span>
              Don't have an account?
            </span>

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