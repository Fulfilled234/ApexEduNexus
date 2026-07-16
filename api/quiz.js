import { GoogleGenerativeAI }from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Daily cap on requests that use YOUR shared key (i.e. no personal key supplied).
// Anyone with their own key (X-Gemini-Key header) skips this entirely — that's
// the "unlimited" promise made in the UI.
const DAILY_FREE_LIMIT = 5;

function getSupabaseAdmin() {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) return null;
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}

// SECURITY: the old version trusted a client-supplied `X-User-Id` header as the
// rate-limit bucket key. That header is just JS on the client — anyone could
// open devtools, set it to a fresh random value on every request, and get
// unlimited "platform" generations, defeating the whole quota. The only way to
// know who's actually calling is to verify their Supabase session token
// server-side. Requests without a valid session fall back to IP-based
// bucketing (still enforced, just coarser) instead of being trusted blindly.
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

async function checkAndBumpRateLimit(supabaseAdmin, bucketKey) {
  if (!supabaseAdmin) return { allowed: true };
  try {
    const today = new Date().toISOString().slice(0, 10);
    const bucketId = `${bucketKey}_${today}`;

    const { data: existing } = await supabaseAdmin
      .from("edu_api_usage").select("count").eq("id", bucketId).single();
    const currentCount = existing?.count || 0;

    if (currentCount >= DAILY_FREE_LIMIT) {
      return { allowed: false, count: currentCount };
    }

    await supabaseAdmin.from("edu_api_usage").upsert({ id: bucketId, count: currentCount + 1, day: today });
    return { allowed: true, count: currentCount + 1 };
  } catch (e) {
    console.warn("Rate limit check failed (allowing request):", e.message);
    return { allowed: true };
  }
}

// Best-effort audit log for the admin analytics dashboard. Never throws —
// a logging failure must never block or fail an actual quiz generation.
async function logAiEvent(supabaseAdmin, { userId, feature, keyType, status, errorMessage }) {
  if (!supabaseAdmin) return;
  try {
    await supabaseAdmin.from("edu_ai_events").insert([{
      user_id: userId || null,
      feature: feature || "unknown",
      key_type: keyType,
      status,
      error_message: errorMessage ? String(errorMessage).slice(0, 500) : null,
    }]);
  } catch (e) {
    console.warn("AI event logging failed:", e.message);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const supabaseAdmin = getSupabaseAdmin();
  const verifiedUserId = await verifyUser(req, supabaseAdmin);
  const feature = req.body?.feature === "quiz" ? "quiz" : "flashcards";

  const personalKey = req.headers["x-gemini-key"];
  const apiKey = personalKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  if (!personalKey) {
    // Bucket by verified account id when we have one; otherwise fall back to
    // IP. Never trust a client-supplied user id for this.
    const bucketKey = verifiedUserId ? `user_${verifiedUserId}` : `ip_${getClientIp(req)}`;
    const { allowed } = await checkAndBumpRateLimit(supabaseAdmin, bucketKey);
    if (!allowed) {
      await logAiEvent(supabaseAdmin, { userId: verifiedUserId, feature, keyType: "platform", status: "rate_limited" });
      return res.status(429).json({
        error: `Daily free generation limit reached (${DAILY_FREE_LIMIT}/day) on the shared key. Add your own free Gemini key in Settings for unlimited generations.`,
      });
    }
  }

  const { messages } = req.body;
  const userMessage = messages?.[0];

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: "You are a quiz generator. Always respond with ONLY a valid JSON array. No explanations, no markdown, no extra text, no clarifying questions — never ask the user which chapter or section to use, scan the whole document yourself and pick the content. Start directly with [ and end with ].",
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        maxOutputTokens: 8000,
      },
    });

    let result;

    if (Array.isArray(userMessage?.content)) {
      const textPart = userMessage.content.find(p => p.type === "text");
      const docPart  = userMessage.content.find(p => p.type === "document");
      const prompt   = textPart?.text || "";

      if (docPart?.source?.data) {
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: "application/pdf",
              data: docPart.source.data,
            },
          },
        ]);
      } else {
        return res.status(400).json({ error: "No document data received by the server." });
      }
    } else {
      result = await model.generateContent(userMessage?.content || "");
    }

    const text = result.response.text();
    console.log("Gemini response preview:", text.slice(0, 200));

    if (!text.trim().startsWith("[")) {
      console.warn("Gemini did not return JSON, returned:", text.slice(0, 300));
      await logAiEvent(supabaseAdmin, {
        userId: verifiedUserId, feature, keyType: personalKey ? "personal" : "platform",
        status: "error", errorMessage: "Non-JSON response from model",
      });
      return res.status(502).json({ error: "AI did not return quiz data — it may not have received the document content. Try re-uploading the PDF." });
    }

    await logAiEvent(supabaseAdmin, {
      userId: verifiedUserId, feature, keyType: personalKey ? "personal" : "platform", status: "success",
    });

    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("Quiz error:", err.message);
    await logAiEvent(supabaseAdmin, {
      userId: verifiedUserId, feature, keyType: personalKey ? "personal" : "platform",
      status: "error", errorMessage: err.message,
    });
    return res.status(500).json({ error: err.message });
  }
}
