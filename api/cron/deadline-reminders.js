import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// Runs once a day (see vercel.json). Reads every user's upcoming deadlines with the
// service role key (bypasses RLS — needed since this isn't a single logged-in user's request),
// emails anyone with an undone deadline due within 3 days, and marks it as reminded so the
// same deadline doesn't trigger a new email every single day.

export default async function handler(req, res) {
  const {
    CRON_SECRET,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY,
    RESEND_FROM,
  } = process.env;

  // Protect this endpoint — only Vercel's scheduler (with the right secret) or you manually
  // testing with the same secret should be able to trigger it.
  const authHeader = req.headers.authorization;
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: "SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not configured" });
  }
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const resend = new Resend(RESEND_API_KEY);
  const fromAddress = RESEND_FROM || "ApexEduNexus <onboarding@resend.dev>";

  try {
    const { data: deadlines, error: dErr } = await supabase
      .from("edu_deadlines")
      .select("id, user_id, title, due, done, reminded")
      .eq("done", false)
      .eq("reminded", false);

    if (dErr) throw dErr;

    const now = new Date();
    const due3 = deadlines.filter(d => {
      const days = Math.ceil((new Date(d.due) - now) / (1000 * 60 * 60 * 24));
      return days <= 3;
    });

    let sent = 0;
    const errors = [];

    for (const d of due3) {
      const days = Math.ceil((new Date(d.due) - now) / (1000 * 60 * 60 * 24));

      const { data: profile } = await supabase
        .from("edu_profiles")
        .select("name, email")
        .eq("id", d.user_id)
        .single();

      if (!profile?.email) continue;

      try {
        await resend.emails.send({
          from: fromAddress,
          to: profile.email,
          subject: days <= 1
            ? `Due ${days <= 0 ? "today" : "tomorrow"}: ${d.title}`
            : `Reminder: ${d.title} is due in ${days} days`,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color:#111827;">Hi ${profile.name || "there"},</h2>
              <p style="color:#374151; font-size:14px; line-height:1.6;">
                This is a reminder that <strong>${d.title}</strong> is due
                on <strong>${new Date(d.due).toLocaleDateString()}</strong>
                (${days <= 0 ? "today" : `${days} day(s) left`}).
              </p>
              <p style="color:#6b7280; font-size:12px;">Sent by ApexEduNexus</p>
            </div>
          `,
        });

        await supabase.from("edu_deadlines").update({ reminded: true }).eq("id", d.id);
        sent++;
      } catch (e) {
        errors.push({ id: d.id, error: e.message });
      }
    }

    return res.status(200).json({ checked: deadlines.length, sent, errors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
