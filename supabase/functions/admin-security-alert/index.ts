import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_ALERT_EMAIL = Deno.env.get("ADMIN_ALERT_EMAIL");
const ALERT_FROM_EMAIL =
  Deno.env.get("ALERT_FROM_EMAIL") || "onboarding@resend.dev";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    if (!RESEND_API_KEY || !ADMIN_ALERT_EMAIL) {
      throw new Error("Security email secrets are not configured.");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication." }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("auth_user_id, role, status")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (
      profileError ||
      !profile ||
      profile.auth_user_id !== user.id ||
      profile.role !== "admin" ||
      profile.status !== "active"
    ) {
      return new Response(
        JSON.stringify({ error: "Admin authorization required." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json().catch(() => ({}));

    if (body.event !== "successful_admin_login") {
      return new Response(
        JSON.stringify({ error: "Unsupported security event." }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const loginEmail = String(body.email || user.email || "Unknown");
    const occurredAt = String(body.occurred_at || new Date().toISOString());

    await supabase.from("admin_security_events").insert({
      event_type: "successful_admin_login",
      actor_user_id: user.id,
      actor_email: loginEmail,
      metadata: {
        occurred_at: occurredAt,
      },
    });

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: ALERT_FROM_EMAIL,
        to: [ADMIN_ALERT_EMAIL],
        subject: "TCA Admin Login Alert",
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6">
            <h2>🔐 Teens Connect Africa Admin Login</h2>
            <p>A successful administrator login was detected.</p>
            <p><strong>Admin email:</strong> ${loginEmail}</p>
            <p><strong>Time:</strong> ${occurredAt}</p>
            <p>If you did not perform this login, secure the administrator account immediately.</p>
          </div>
        `,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      throw new Error(
        resendData?.message || "Email provider rejected the request."
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("ADMIN SECURITY ALERT ERROR:", error);

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Unable to send security alert.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
