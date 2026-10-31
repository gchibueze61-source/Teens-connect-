import { createClient } from "@supabase/supabase-js";

const allowedOrigins = new Set(
  (Deno.env.get("ADMIN_ALLOWED_ORIGINS") ||
    "https://www.teensconnectafrica.org,https://teensconnectafrica.org,https://teens-connect-opal.vercel.app")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

function getCorsHeaders(origin: string | null): Record<string, string> {
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

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("Origin");
  const headers = getCorsHeaders(origin);

  if (origin && !allowedOrigins.has(origin)) {
    return jsonResponse(
      { success: false, message: "Origin not allowed." },
      403,
      headers,
    );
  }

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { success: false, message: "Method not allowed." },
      405,
      headers,
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseKey) {
      return jsonResponse(
        { success: false, message: "Supabase environment variables are missing." },
        500,
        headers,
      );
    }

    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
      return jsonResponse(
        { success: false, message: "Missing authorization." },
        401,
        headers,
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return jsonResponse(
        { success: false, message: "Invalid login session." },
        401,
        headers,
      );
    }

    return jsonResponse(
      {
        success: true,
        message: "TCA Admin OTP function is working.",
        user_id: user.id,
      },
      200,
      headers,
    );
  } catch (error) {
    console.error("Function error:", error);

    return jsonResponse(
      { success: false, message: "Server error." },
      500,
      headers,
    );
  }
});
