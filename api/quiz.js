export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const { messages, max_tokens } = req.body;
  const userMessage = messages?.[0];
  let parts = [];

  if (userMessage?.content && Array.isArray(userMessage.content)) {
    // Handle PDF + text (multipart)
    for (const part of userMessage.content) {
      if (part.type === "text") {
        parts.push({ text: part.text });
      } else if (part.type === "document") {
        parts.push({
          inline_data: {
            mime_type: part.source.media_type,
            data: part.source.data,
          }
        });
      }
    }
  } else if (typeof userMessage?.content === "string") {
    parts.push({ text: userMessage.content });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: {
            maxOutputTokens: max_tokens || 2000,
            temperature: 0.7,
          },
        }),
      }
    );

    const data = await geminiRes.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Return in Anthropic-compatible format so app code stays unchanged
    return res.status(200).json({
      content: [{ type: "text", text }]
    });
  } catch (err) {
    return res.status(500).json({ error: "Request failed", detail: err.message });
  }
}
