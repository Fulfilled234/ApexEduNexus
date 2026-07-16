import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

async function verifyAdmin(req, supabaseAdmin) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token || !supabaseAdmin) return null;
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user?.id) return null;
    const { data: profile, error: profErr } = await supabaseAdmin
      .from("edu_profiles").select("is_admin").eq("id", data.user.id).single();
    if (profErr || !profile?.is_admin) return null;
    return data.user.id;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseAdmin = getSupabaseAdmin();
  if (!supabaseAdmin) {
    return res.status(500).json({ error: "Supabase not configured on the server." });
  }

  const adminId = await verifyAdmin(req, supabaseAdmin);
  if (!adminId) {
    return res.status(403).json({ error: "Admin access required." });
  }

  try {
    const since14 = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();

    const { data: events, error: evErr } = await supabaseAdmin
      .from("edu_ai_events")
      .select("user_id, feature, key_type, status, error_message, created_at")
      .gte("created_at", since14)
      .order("created_at", { ascending: false })
      .limit(2000);

    if (evErr) throw evErr;

    const rows = events || [];

    const totalRequests = rows.length;
    const platformRequests = rows.filter(r => r.key_type === "platform").length;
    const personalRequests = rows.filter(r => r.key_type === "personal").length;

    const activeUserIds = new Set(rows.filter(r => r.user_id).map(r => r.user_id));
    const platformUserIds = new Set(rows.filter(r => r.key_type === "platform" && r.user_id).map(r => r.user_id));
    const personalUserIds = new Set(rows.filter(r => r.key_type === "personal" && r.user_id).map(r => r.user_id));

    // Daily generation counts, last 14 days, oldest first — ready to plot directly.
    const dayBuckets = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      dayBuckets[d] = 0;
    }
    rows.forEach(r => {
      const d = r.created_at?.slice(0, 10);
      if (d && d in dayBuckets) dayBuckets[d] += 1;
    });
    const dailyGenerations = Object.entries(dayBuckets).map(([day, count]) => ({ day, count }));

    const errorLogs = rows
      .filter(r => r.status === "error" || r.status === "rate_limited")
      .slice(0, 30)
      .map(r => ({
        feature: r.feature,
        keyType: r.key_type,
        status: r.status,
        message: r.error_message,
        createdAt: r.created_at,
      }));

    return res.status(200).json({
      totalRequests,
      platformRequests,
      personalRequests,
      activeUsers: activeUserIds.size,
      usersOnPlatform: platformUserIds.size,
      usersOnPersonal: personalUserIds.size,
      dailyGenerations,
      errorLogs,
      windowDays: 14,
    });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
