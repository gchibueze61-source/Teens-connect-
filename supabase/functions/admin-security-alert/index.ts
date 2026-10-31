import { createClient } from "npm:@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_ALERT_EMAIL = Deno.env.get("ADMIN_ALERT_EMAIL");
const ALERT_FROM_EMAIL =
  Deno.env.get("ALERT_FROM_EMAIL") || "onboarding@resend.dev";

const allowedOrigins = new Set(
  (Deno.env.get("ADMIN_ALLOWED_ORIGINS") ||
    "https://www.teensconnectafrica.org,https://teensconnectafrica.org,https://teens-connect-opal.vercel.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };

  if (origin && allowedOrigins.has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string>,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin");
  const headers = corsHeaders(origin);

  if (origin && !allowedOrigins.has(origin)) {
    return jsonResponse({ error: "Origin not allowed." }, 403, headers);
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405, headers);
  }

  try {
    if (!RESEND_API_KEY || !ADMIN_ALERT_EMAIL) {
      console.error("Admin security alert email secrets are not configured.");
      return jsonResponse({ error: "Security alert service unavailable." }, 503, headers);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Supabase service configuration is missing.");
      return jsonResponse({ error: "Security alert service unavailable." }, 503, headers);
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return jsonResponse({ error: "Authentication required." }, 401, headers);
    }

    const token = authHeader.slice("Bearer ".length);
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return jsonResponse({ error: "Invalid authentication." }, 401, headers);
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
      return jsonResponse({ error: "Admin authorization required." }, 403, headers);
    }

    const body = await req.json().catch(() => null);
    if (!body || body.event !== "successful_admin_login") {
      return jsonResponse({ error: "Unsupported security event." }, 400, headers);
    }

    // Use identity and time verified by the server, not client-supplied values.
    const loginEmail = user.email || "Unknown";
    const occurredAt = new Date().toISOString();

    const { error: insertError } = await supabase
      .from("admin_security_events")
      .insert({
        event_type: "successful_admin_login",
        actor_user_id: user.id,
        actor_email: loginEmail,
        metadata: { occurred_at: occurredAt },
      });

    if (insertError) {
      console.error("Unable to write admin security event:", insertError);
      return jsonResponse({ error: "Unable to record security event." }, 500, headers);
    }

    const safeEmail = escapeHtml(loginEmail);
    const safeTime = escapeHtml(occurredAt);

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
            <h2>Teens Connect Africa Admin Login</h2>
            <p>A successful administrator login was detected.</p>
            <p><strong>Admin email:</strong> ${safeEmail}</p>
            <p><strong>Time:</strong> ${safeTime}</p>
            <p>If you did not perform this login, secure the administrator account immediately.</p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const providerMessage = await resendResponse.text();
      console.error("Email provider rejected the admin alert:", providerMessage);
      return jsonResponse({ error: "Security alert email could not be sent." }, 502, headers);
    }

    return jsonResponse({ success: true }, 200, headers);
  } catch (error) {
    console.error("ADMIN SECURITY ALERT ERROR:", error);
    return jsonResponse({ error: "Unable to process security alert." }, 500, headers);
  }
});
