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
        profile.role === "admin" &&
        profile.status === "active";

      if (active) setState(isAdmin ? "authorized" : "denied");
    };

    void checkAdmin();

    // Sign out when this admin page is no longer visible, so returning
    // to the tab requires a fresh login.
    const lockAdminSession = async () => {
      try {
        await supabase.auth.signOut();
      } finally {
        if (active) setState("denied");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        void lockAdminSession();
      }
    };

    const handlePageHide = () => {
      void lockAdminSession();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session?.user) {
        if (active) setState("denied");
      }
    });

    return () => {
      active = false;
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
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
