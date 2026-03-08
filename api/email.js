export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const {
    EJS1_SERVICE_ID, EJS1_TEMPLATE_INVITE, EJS1_TEMPLATE_NOTIF, EJS1_PUBLIC_KEY,
    EJS2_SERVICE_ID, EJS2_TEMPLATE_WELCOME, EJS2_TEMPLATE_RESET, EJS2_TEMPLATE_INVITE, EJS2_PUBLIC_KEY,
  } = process.env;

  const { type, toEmail, toName, fromName, appLink, deadlineTitle, daysLeft, dueDate, code } = req.body;

  let serviceId, templateId, publicKey, params;

  if (type === "welcome") {
    serviceId = EJS2_SERVICE_ID; templateId = EJS2_TEMPLATE_WELCOME; publicKey = EJS2_PUBLIC_KEY;
    params = { to_email: toEmail, to_name: toName, app_link: appLink };
  } else if (type === "reset") {
    serviceId = EJS2_SERVICE_ID; templateId = EJS2_TEMPLATE_RESET; publicKey = EJS2_PUBLIC_KEY;
    params = { to_email: toEmail, to_name: toName, reset_code: code };
  } else if (type === "invite") {
    serviceId = EJS2_SERVICE_ID; templateId = EJS2_TEMPLATE_INVITE; publicKey = EJS2_PUBLIC_KEY;
    params = { to_email: toEmail, to_name: toName, from_name: fromName, app_link: appLink };
  } else if (type === "deadline") {
    serviceId = EJS1_SERVICE_ID; templateId = EJS1_TEMPLATE_NOTIF; publicKey = EJS1_PUBLIC_KEY;
    params = { to_email: toEmail, to_name: toName, title: deadlineTitle, days_left: daysLeft, due_date: dueDate };
  } else {
    return res.status(400).json({ error: "Unknown email type" });
  }

  try {
    const ejsRes = await fetch(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: params,
        }),
      }
    );
    const text = await ejsRes.text();
    return res.status(ejsRes.status).json({ result: text });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
