import { createClient } from "@supabase/supabase-js";

const DAILY_FREE_LIMIT = 5;

function getSupabaseAdmin() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function verifyUser(req, supabaseAdmin) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || !supabaseAdmin) return null;
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

function getClientIp(req) {
  return (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .toString().split(",")[0].trim();
}

function nextUtcMidnightIso() {
  const now = new Date();
  const reset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
  return reset.toISOString();
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // A personal key means unlimited — no need to touch the database at all.
  const hasPersonalKey = req.headers["x-gemini-key-present"] === "1";
  if (hasPersonalKey) {
    return res.status(200).json({
      mode: "personal",
      unlimited: true,
      limit: null,
      used: null,
      remaining: null,
      resetAt: null,
    });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const verifiedUserId = await verifyUser(req, supabaseAdmin);
  const bucketKey = verifiedUserId ? `user_${verifiedUserId}` : `ip_${getClientIp(req)}`;

  let used = 0;
  if (supabaseAdmin) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const bucketId = `${bucketKey}_${today}`;
      const { data } = await supabaseAdmin.from("edu_api_usage").select("count").eq("id", bucketId).single();
      used = data?.count || 0;
    } catch {
      used = 0;
    }
  }

  return res.status(200).json({
    mode: "platform",
    unlimited: false,
    limit: DAILY_FREE_LIMIT,
    used,
    remaining: Math.max(0, DAILY_FREE_LIMIT - used),
    resetAt: nextUtcMidnightIso(),
  });
}
