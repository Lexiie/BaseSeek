import { removeFinancialAdvice } from "./guardrails";
import type { SearchContext } from "./types";

const systemPrompt = `You are BaseSeek, an assistant specialized ONLY in the Base blockchain ecosystem.\nRULES:\n- Only use facts that exist inside <context>.\n- If the data is missing respond exactly with \"No data found from the available sources.\"\n- Never invent contract addresses or numbers.\n- Never provide financial advice or recommend buy/sell decisions.\n- Focus on factual analysis, risk flags, descriptive summaries.`;

export function buildContextBlock(data: Record<string, unknown>): string {
  return `<context>\n${JSON.stringify(data, null, 2)}\n</context>`;
}

export function buildSearchPrompt(query: string, data: SearchContext | Record<string, unknown>): string {
  return [systemPrompt, buildContextBlock(data), `User question: ${query}`].join("\n\n");
}

const fallbackPrompt = `You are BaseSeek, an assistant for the Base ecosystem.
If the <context> does not contain relevant data, switch to FALLBACK-KNOWLEDGE mode:
- Provide a helpful, high-level explanation.
- Do NOT invent numbers, price movements, future returns, or token-specific data.
- Do NOT recommend buying/selling or claim a token will perform well.
- You may explain general concepts such as how returns in DeFi are generated, risk factors, mechanisms on Base, how to analyze yield, token categories, and diligence steps.
- Keep the explanation Base-specific when possible.
- Always include: \"This is general information, not financial advice.\".`;

export function buildNoContextPrompt(query: string): string {
  return `${fallbackPrompt}\n\nUser question: ${query}`;
}

export function sanitizeLLMResponse(text: string): string {
  return removeFinancialAdvice(text)
    .replace(/:+\s*(\n|$)/g, ":\n")
    .trim();
}
