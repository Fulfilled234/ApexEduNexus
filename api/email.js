import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { RESEND_API_KEY, RESEND_FROM } = process.env;
  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "RESEND_API_KEY not configured" });
  }

  const { type, toEmail, toName, fromName, deadlineTitle, daysLeft, dueDate, appLink } = req.body;
  if (!toEmail) return res.status(400).json({ error: "toEmail is required" });

  const resend = new Resend(RESEND_API_KEY);
  const fromAddress = RESEND_FROM || "ApexEduNexus <onboarding@resend.dev>";

  let subject, html;

  if (type === "welcome") {
    subject = "Welcome to ApexEduNexus";
    html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#111827;">Welcome, ${toName || "there"}!</h2>
        <p style="color:#374151; font-size:14px; line-height:1.6;">
          Your workspace is ready. Track deadlines, calculate your CGPA, manage tasks, and
          build a study streak — all in one place.
        </p>
        ${appLink ? `<p><a href="${appLink}" style="color:#7c3aed; font-weight:bold;">Open your dashboard →</a></p>` : ""}
        <p style="color:#6b7280; font-size:12px;">Sent by ApexEduNexus</p>
      </div>
    `;
  } else if (type === "invite") {
    subject = `${fromName || "A classmate"} invited you to ApexEduNexus`;
    html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#111827;">Hi ${toName || "there"},</h2>
        <p style="color:#374151; font-size:14px; line-height:1.6;">
          <strong>${fromName || "A classmate"}</strong> invited you to join them on ApexEduNexus —
          track deadlines, calculate CGPA, and build study streaks together.
        </p>
        ${appLink ? `<p><a href="${appLink}" style="color:#7c3aed; font-weight:bold;">Join now →</a></p>` : ""}
        <p style="color:#6b7280; font-size:12px;">Sent by ApexEduNexus</p>
      </div>
    `;
  } else if (type === "deadline") {
    const urgent = Number(daysLeft) <= 1;
    subject = urgent
      ? `Due ${Number(daysLeft) <= 0 ? "today" : "tomorrow"}: ${deadlineTitle}`
      : `Reminder: ${deadlineTitle} is due in ${daysLeft} days`;
    html = `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color:#111827;">Hi ${toName || "there"},</h2>
        <p style="color:#374151; font-size:14px; line-height:1.6;">
          This is a reminder that <strong>${deadlineTitle}</strong> is due
          ${dueDate ? `on <strong>${dueDate}</strong>` : "soon"}
          ${daysLeft != null ? ` (${Number(daysLeft) <= 0 ? "today" : `${daysLeft} day(s) left`})` : ""}.
        </p>
        <p style="color:#6b7280; font-size:12px;">Sent by ApexEduNexus</p>
      </div>
    `;
  } else {
    return res.status(400).json({ error: "Unknown email type" });
  }

  try {
    const { data, error } = await resend.emails.send({ from: fromAddress, to: toEmail, subject, html });
    if (error) return res.status(500).json({ error: error.message || String(error) });
    return res.status(200).json({ result: data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
