import { GoogleGenerativeAI } from "@google/generative-ai";

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

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: "You are a quiz generator. Always respond with ONLY a valid JSON array. No explanations, no markdown, no extra text. Start directly with [ and end with ].",
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
        result = await model.generateContent(prompt);
      }
    } else {
      // Plain text
      result = await model.generateContent(userMessage?.content || "");
    }

    const text = result.response.text();
    console.log("Gemini response preview:", text.slice(0, 200));
    return res.status(200).json({ content: [{ type: "text", text }] });

  } catch (err) {
    console.error("Quiz error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
