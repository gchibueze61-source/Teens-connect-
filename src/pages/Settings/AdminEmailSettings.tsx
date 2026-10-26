import { FormEvent, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import "./AdminEmailSettings.css";

export default function AdminEmailSettings() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user?.email) {
        setMessage("Your session could not be verified. Please sign in again.");
        setMessageType("error");
        return;
      }
      setCurrentEmail(data.user.email);
    });
    return () => { active = false; };
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");

    const normalizedEmail = newEmail.trim().toLowerCase();
    if (!currentEmail || !currentPassword || !normalizedEmail) {
      setMessage("Complete all fields before continuing.");
      setMessageType("error");
      return;
    }
    if (normalizedEmail === currentEmail.toLowerCase()) {
      setMessage("Enter an email address different from your current one.");
      setMessageType("error");
      return;
    }

    setBusy(true);
    try {
      // Reauthenticate the current admin before allowing a sensitive change.
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: currentEmail,
        password: currentPassword,
      });
      if (reauthError) {
        setMessage("We couldn't verify your credentials. Check your current email and password, then try again.");
        setMessageType("error");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser(
        { email: normalizedEmail },
        { emailRedirectTo: `${window.location.origin}/admin/login` }
      );

      if (updateError) {
        setMessage("We couldn't start the email change. Check the new address and try again later.");
        setMessageType("error");
        return;
      }

      setMessage("Email change requested. Check the verification messages sent by the authentication system and follow the instructions. Your login email may remain unchanged until the required verification is complete.");
      setMessageType("success");
      setCurrentPassword("");
      setNewEmail("");
    } catch {
      setMessage("We couldn't complete this request. Please try again.");
      setMessageType("error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-email-settings">
      <section className="admin-email-card">
        <Link to="/admin/dashboard" className="admin-email-back">← Back to dashboard</Link>
        <p className="admin-email-eyebrow">ACCOUNT SECURITY</p>
        <h1>Change admin login email</h1>
        <p className="admin-email-intro">Only use an email address you control. Verification is required before the new address can be used to sign in.</p>
        <div className="admin-email-current">
          <span>Current login email</span>
          <strong>{currentEmail || "Loading..."}</strong>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="current-password">Current password</label>
          <input id="current-password" type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          <label htmlFor="new-admin-email">New login email</label>
          <input id="new-admin-email" type="email" autoComplete="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
          {message && <p role="status" className={`admin-email-message ${messageType}`}>{message}</p>}
          <button type="submit" disabled={busy || !currentEmail}>{busy ? "Submitting..." : "Request email change"}</button>
        </form>
        <p className="admin-email-note">Never share your password or verification links. If you did not request this change, do not approve it.</p>
      </section>
    </main>
  );
}
