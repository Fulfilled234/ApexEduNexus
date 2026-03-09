export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "GEMINI_API_KEY not configured" });
  }

  const { messages } = req.body;
  const userMessage = messages?.[0];
  let parts = [];

  try {
    if (Array.isArray(userMessage?.content)) {
      for (const part of userMessage.content) {
        if (part.type === "text") {
          parts.push({ text: part.text });
        } else if (part.type === "document" && part.source?.data) {
          // Step 1: Upload PDF to Gemini File API first
          const pdfBuffer = Buffer.from(part.source.data, "base64");
          
          // Upload to Files API
          const uploadRes = await fetch(
            `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/pdf",
                "X-Goog-Upload-Command": "upload, finalize",
                "X-Goog-Upload-Header-Content-Length": pdfBuffer.length,
                "X-Goog-Upload-Header-Content-Type": "application/pdf",
              },
              body: pdfBuffer,
            }
          );

          if (!uploadRes.ok) {
            const errData = await uploadRes.json();
            console.error("File upload error:", JSON.stringify(errData));
            // Fallback: send as inline if upload fails
            parts.push({
              inlineData: {
                mimeType: "application/pdf",
                data: part.source.data
              }
            });
          } else {
            const fileData = await uploadRes.json();
            const fileUri = fileData?.file?.uri;
            console.log("Uploaded file URI:", fileUri);
            // Step 2: Reference the uploaded file by URI
            parts.push({
              fileData: {
                mimeType: "application/pdf",
                fileUri: fileUri,
              }
            });
          }
        }
      }
    } else if (typeof userMessage?.content === "string") {
      parts.push({ text: userMessage.content });
    }

    if (parts.length === 0) {
      return res.status(400).json({ error: "No content provided" });
    }

    // Step 3: Generate content with Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.5,
          },
          systemInstruction: {
            parts: [{
              text: "You are a quiz generator. Always respond with ONLY a valid JSON array. No explanations, no markdown code blocks, no extra text. Start directly with [ and end with ]."
            }]
          }
        }),
      }
    );

    const data = await geminiRes.json();
    console.log("Gemini status:", geminiRes.status);

    if (!geminiRes.ok) {
      console.error("Gemini error:", JSON.stringify(data));
      return res.status(geminiRes.status).json({
        error: data?.error?.message || "Gemini API error"
      });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    console.log("Response preview:", text.slice(0, 200));
    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("Handler error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
