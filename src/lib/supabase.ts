import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error("Missing Supabase environment variables.");
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
);

// Capture the recovery event at client initialization so a lazy-loaded
// reset route cannot miss PASSWORD_RECOVERY before it mounts.
supabase.auth.onAuthStateChange((event, session) => {
  if (typeof window === "undefined") return;

  if (event === "PASSWORD_RECOVERY" && session) {
    window.sessionStorage.setItem("tca_admin_password_recovery", "true");
  }

  if (event === "SIGNED_OUT") {
    window.sessionStorage.removeItem("tca_admin_password_recovery");
  }
});
