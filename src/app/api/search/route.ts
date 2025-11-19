import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { fetchAerodromeTopPools, fetchTrendingTokens, getProjectDirectory } from "@/lib/apis";
import { callGemini } from "@/lib/gemini";
import { detectProhibitedRequest, fallbackNoData } from "@/lib/guardrails";
import { detectIntent } from "@/lib/intent";
import { buildSearchPrompt } from "@/lib/prompt";
import { rateLimit } from "@/lib/rate-limit";
import { buildFallbackSummary } from "@/lib/summary";
import type { SearchContext, SearchResultPayload, SourceLink } from "@/lib/types";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "global";

  if (!rateLimit(`search:${ip}`)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const query = (body?.query ?? "").trim();

  if (!query) {
    return NextResponse.json({ error: "Query required" }, { status: 400 });
  }

  const guardrail = detectProhibitedRequest(query);
  if (guardrail.blocked) {
    const payload: SearchResultPayload = {
      query,
      intent: "general",
      summary: guardrail.reason ?? fallbackNoData(),
      insights: [],
      sources: [],
      risks: [],
      raw: {},
      guardrail
    };
    return NextResponse.json(payload, { status: 200 });
  }

  const intent = detectIntent(query);
  const originUrl = env.appUrl || req.nextUrl.origin;

  const [trendingTokens, aerodromePools] = await Promise.all([
    fetchTrendingTokens(),
    fetchAerodromeTopPools()
  ]);

  const projects = getProjectDirectory();

  const context: SearchContext = {
    intent,
    query,
    trendingTokens,
    aerodromePools,
    projects
  };

  const prompt = buildSearchPrompt(query, context);
  const aiSummary = await callGemini(prompt);
  const fallbackSummary = buildFallbackSummary(context);
  const summary = aiSummary?.trim() ? aiSummary : fallbackSummary;
  const topTokenInsights = (trendingTokens ?? [])
    .slice(0, 3)
    .map((token) => {
      const numericPrice = Number(token?.priceUsd);
      const price = Number.isFinite(numericPrice) ? `$${numericPrice.toFixed(4)}` : "n/a";
      return `${token?.symbol ?? token?.name ?? "Token"} · harga ${price}`;
    });

  const sources: SourceLink[] = [];
  if (trendingTokens?.length) {
    sources.push({ label: "DexScreener Base", url: "https://dexscreener.com/base" });
  }
  if (aerodromePools?.length) {
    sources.push({ label: "Aerodrome Pools", url: "https://aerodrome.finance" });
  }
  sources.push({ label: "Curated Projects", url: `${originUrl}/api/projects` });

  const payload: SearchResultPayload = {
    query,
    intent,
    summary,
    insights: topTokenInsights,
    sources,
    risks: [],
    raw: context,
    guardrail: { blocked: false }
  };

  return NextResponse.json(payload, { status: 200 });
}
