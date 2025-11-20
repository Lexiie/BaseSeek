import { removeFinancialAdvice } from "./guardrails";
import type { SearchContext } from "./types";

const systemPrompt = `You are BaseSeek, an assistant specialized ONLY in the Base blockchain ecosystem.\nRULES:\n- Only use facts that exist inside <context>.\n- If the data is missing respond exactly with \"No data found from the available sources.\"\n- Never invent contract addresses or numbers.\n- Never provide financial advice or recommend buy/sell decisions.\n- Focus on factual analysis, risk flags, descriptive summaries.`;

export function buildContextBlock(data: Record<string, unknown>): string {
  return `<context>\n${JSON.stringify(data, null, 2)}\n</context>`;
}

export function buildSearchPrompt(query: string, data: SearchContext | Record<string, unknown>): string {
  return [systemPrompt, buildContextBlock(data), `User question: ${query}`].join("\n\n");
}

export function buildNoContextPrompt(query: string): string {
  return `You are BaseSeek, an assistant for the Base ecosystem. Real-time data is unavailable. Provide a cautious, qualitative answer for the following question without inventing numbers. Emphasize that live metrics were not retrieved.\n\nUser question: ${query}`;
}

export function sanitizeLLMResponse(text: string): string {
  return removeFinancialAdvice(text)
    .replace(/:+\s*(\n|$)/g, ":\n")
    .trim();
}
