import { GoogleGenerativeAI }from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Daily cap on requests that use YOUR shared key (i.e. no personal key supplied).
// Anyone with their own key (X-Gemini-Key header) skips this entirely — that's
// the "unlimited" promise made in the UI.
const DAILY_FREE_LIMIT = 5;

async function checkAndBumpRateLimit(req) {
  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("Rate limiting skipped: SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not set.");
    return { allowed: true };
  }
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
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
    console.warn("Rate limit check failed (allowing request):", e.message);
    return { allowed: true };
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const personalKey = req.headers["x-gemini-key"];
  const apiKey = personalKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

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
      return res.status(502).json({ error: "AI did not return quiz data — it may not have received the document content. Try re-uploading the PDF." });
    }

    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("Quiz error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
