import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";

type AdminState = "checking" | "authorized" | "denied";

export default function AdminGuard() {
  const location = useLocation();
  const [state, setState] = useState<AdminState>("checking");

  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        if (active) setState("denied");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("auth_user_id, role, status")
        .eq("auth_user_id", user.id)
        .maybeSingle();

      const isAdmin =
        !profileError &&
        profile?.auth_user_id === user.id &&
        profile?.role === "admin" &&
        profile?.status === "active";

      if (active) setState(isAdmin ? "authorized" : "denied");
    };

    checkAdmin();

    // End the admin session after 15 minutes without activity.
    let idleTimer: ReturnType<typeof setTimeout> | undefined;
    const resetIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(async () => {
        await supabase.auth.signOut();
        if (active) setState("denied");
      }, 15 * 60 * 1000);
    };
    const activityEvents: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "scroll", "touchstart"];
    activityEvents.forEach((eventName) => window.addEventListener(eventName, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        setState("denied");
      }
    });

    return () => {
      active = false;
      if (idleTimer) clearTimeout(idleTimer);
      activityEvents.forEach((eventName) => window.removeEventListener(eventName, resetIdleTimer));
      subscription.unsubscribe();
    };
  }, []);

  if (state === "checking") {
    return (
      <main className="dashboard-loading">
        <p>Checking admin access...</p>
      </main>
    );
  }

  if (state === "denied") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}
