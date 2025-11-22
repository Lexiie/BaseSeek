import { env } from "./env";
import { sanitizeLLMResponse } from "./prompt";

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

async function invokeModel(prompt: string, model: string): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const response = await fetch(`${endpoint}?key=${env.geminiApiKey}`, {
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
    console.error("Gemini error", model, await response.text());
    throw new Error(`Model ${model} unavailable`);
  }

  const payload = (await response.json()) as GeminiResponse;
  const text = payload.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return sanitizeLLMResponse(text);
}

export async function callGemini(prompt: string): Promise<string> {
  if (!env.geminiApiKey) {
    return "GEMINI_API_KEY is not configured on the server.";
  }

  const primaryModel = env.geminiModel ?? "gemini-2.5-flash";
  const fallbackModel = env.geminiFallbackModel && env.geminiFallbackModel !== primaryModel
    ? env.geminiFallbackModel
    : undefined;
  const modelsToTry = fallbackModel ? [primaryModel, fallbackModel] : [primaryModel];

  for (const model of modelsToTry) {
    try {
      return await invokeModel(prompt, model);
    } catch (error) {
      console.error(`[LLM] Failed using ${model}`, error);
    }
  }

  return "The LLM endpoint is unavailable right now.";
}
