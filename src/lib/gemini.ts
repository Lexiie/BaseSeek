import { env } from "./env";
import { sanitizeLLMResponse } from "./prompt";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

export async function callGemini(prompt: string): Promise<string> {
  if (!env.geminiApiKey) {
    return "GEMINI_API_KEY is not configured on the server.";
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${env.geminiModel}:generateContent`;

  const response = await fetch(endpoint + `?key=${env.geminiApiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    })
  });

  if (!response.ok) {
    console.error("Gemini error", await response.text());
    return "The LLM endpoint is unavailable right now.";
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return sanitizeLLMResponse(text);
}
