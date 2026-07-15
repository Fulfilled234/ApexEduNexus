import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Daily cap on requests that use YOUR shared key (i.e. no personal key supplied).
// Anyone with their own key (X-Gemini-Key header) skips this entirely — that's
// the "unlimited" promise made in the UI.
const DAILY_FREE_LIMIT = 5;

async function checkAndBumpRateLimit(req) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    // No DB configured for this — fail open rather than blocking generation entirely.
    console.warn("Rate limiting skipped: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set.");
    return { allowed: true };
  }
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    // Prefer the logged-in user's id — stable per person regardless of network.
    // IP is only a fallback (e.g. if the request somehow arrives logged out),
    // since many students share one IP on campus wifi / cyber cafes and an
    // IP-only bucket would wrongly throttle everyone on that network together.
    const userId = req.headers["x-user-id"];
    const ip = (req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
      .toString().split(",")[0].trim();
    const bucketKey = userId ? `user_${userId}` : `ip_${ip}`;
    const today = new Date().toISOString().slice(0, 10);
    const bucketId = `${bucketKey}_${today}`;

    const { data: existing } = await supabase
      .from("edu_api_usage").select("count").eq("id", bucketId).single();
    const currentCount = existing?.count || 0;

    if (currentCount >= DAILY_FREE_LIMIT) {
      return { allowed: false };
    }

    await supabase.from("edu_api_usage").upsert({ id: bucketId, count: currentCount + 1, day: today });
    return { allowed: true };
  } catch (e) {
    // Table missing / transient DB issue — don't let rate limiting itself take down generation.
    console.warn("Rate limit check failed (allowing request):", e.message);
    return { allowed: true };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // A user-supplied personal key (sent via X-Gemini-Key) takes priority over the
  // shared server key. Previously this header was sent by the frontend but never
  // read here, so "use my own key" silently did nothing.
  const personalKey = req.headers["x-gemini-key"];
  const apiKey = personalKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  // Only rate-limit people riding on the shared server key. Personal keys are unlimited.
  if (!personalKey) {
    const { allowed } = await checkAndBumpRateLimit(req);
    if (!allowed) {
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
      // gemini-2.0-flash was shut down by Google on June 1, 2026 — every request to
      // it has been returning a 404 since then. This is a very likely cause of the
      // "AI not generating real questions" symptom: the request was failing outright
      // and silently dropping to the local mock fallback. Pinned to a live, stable
      // model instead. Note: gemini-2.5-flash itself is scheduled to retire around
      // October 16, 2026 — when that approaches, check
      // https://ai.google.dev/gemini-api/docs/models for the current recommended
      // stable model and update this string (avoid "-latest" aliases; Google has
      // deprecated those out from under people too).
      model: "gemini-2.5-flash",
      systemInstruction: "You are a quiz generator. Always respond with ONLY a valid JSON array. No explanations, no markdown, no extra text, no clarifying questions — never ask the user which chapter or section to use, scan the whole document yourself and pick the content. Start directly with [ and end with ].",
      generationConfig: {
        // Higher temperature + topP so repeated generations on the same file
        // don't return the same (or near-identical) set of questions.
        temperature: 1,
        topP: 0.95,
        // Raised from 4000 to comfortably cover the new higher question-volume
        // options (up to 30) without truncating the JSON mid-array.
        maxOutputTokens: 8000,
      },
    });

    let result;

    if (Array.isArray(userMessage?.content)) {
      // Has PDF + text
      const textPart = userMessage.content.find(p => p.type === "text");
      const docPart  = userMessage.content.find(p => p.type === "document");
      const prompt   = textPart?.text || "";

      if (docPart?.source?.data) {
        // Send PDF as inline data via SDK
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
        // No document actually made it here — this is exactly the situation that
        // makes Gemini reply with a "which chapter?" style clarifying question
        // instead of real content. Fail loudly instead of silently asking Gemini
        // to guess.
        return res.status(400).json({ error: "No document data received by the server." });
      }
    } else {
      // Plain text
      result = await model.generateContent(userMessage?.content || "");
    }

    const text = result.response.text();
    console.log("Gemini response preview:", text.slice(0, 200));

    // If Gemini ignored the system instruction and asked a clarifying question
    // instead of returning quiz JSON, surface that as an error so the frontend
    // shows the real problem instead of quietly displaying it as a "question".
    if (!text.trim().startsWith("[")) {
      console.warn("Gemini did not return JSON, returned:", text.slice(0, 300));
      return res.status(502).json({ error: "AI did not return quiz data — it may not have received the document content. Try re-uploading the PDF." });
    }

    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("Quiz error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
