import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { fetchTrendingTokens, getProjectDirectory } from "@/lib/apis";
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

  const trendingTokens = await fetchTrendingTokens();

  const projects = getProjectDirectory();

  const context: SearchContext = {
    intent,
    query,
    trendingTokens,
    projects
  };

  console.log(
    "[search] context",
    JSON.stringify(
      {
        intent,
        trendingCount: trendingTokens?.length ?? 0,
        aerodromeCount: 0,
        projectCount: projects.length
      },
      null,
      2
    )
  );

  const prompt = buildSearchPrompt(query, context);
  const aiSummary = await callGemini(prompt);
  const fallbackSummary = buildFallbackSummary(context);
  const summary = aiSummary?.trim() ? aiSummary : fallbackSummary;

  if (!aiSummary?.trim()) {
    console.warn("[search] falling back to data summary", { query });
  }
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
