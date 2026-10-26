import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./ResetPassword.css";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;
      if (event === "PASSWORD_RECOVERY" && session) {
        setReady(true);
        setError("");
        setChecking(false);
      }
    });
    const checkSession = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (!mounted) return;
      if (session && !sessionError) setReady(true);
      else setError("This reset link is invalid or has expired. Please request a new reset email.");
      setChecking(false);
    };
    void checkSession();
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(""); setMessage("");
    if (password.length < 10) { setError("Use a password with at least 10 characters."); return; }
    if (password !== confirmPassword) { setError("The passwords do not match."); return; }
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Your recovery session expired. Please request a new reset link.");
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await supabase.auth.signOut();
      setReady(false);
      setMessage("Your password has been updated. Please sign in with your new password.");
      window.setTimeout(() => navigate("/login", { replace: true }), 1200);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unable to update your password.");
    } finally { setLoading(false); }
  };

  return <main className="reset-password-page"><section className="reset-password-card">
    <h1>Set a new password</h1><p>Choose a new password for your Teens Connect Africa account.</p>
    {checking && <p role="status">Verifying your reset link…</p>}
    {error && <p className="reset-password-error" role="alert">{error}</p>}
    {message && <p className="reset-password-success" role="status">{message}</p>}
    {!checking && ready && <form onSubmit={handleSubmit}>
      <label htmlFor="new-password">New password</label>
      <input id="new-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" minLength={10} required disabled={loading} placeholder="At least 10 characters" />
      <label htmlFor="confirm-password">Confirm new password</label>
      <input id="confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} autoComplete="new-password" minLength={10} required disabled={loading} placeholder="Enter it again" />
      <button type="submit" disabled={loading}>{loading ? "Updating…" : "Update password"}</button>
    </form>}
    {!checking && !ready && <button type="button" onClick={() => navigate("/login", { replace: true })}>Return to login</button>}
  </section></main>;
};
export default ResetPassword;
