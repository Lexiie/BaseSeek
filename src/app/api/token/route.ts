import { NextRequest, NextResponse } from "next/server";
import { fetchBaseScanToken, fetchDexScreenerToken } from "@/lib/apis";
import { callGemini } from "@/lib/gemini";
import { buildNoContextPrompt, buildSearchPrompt } from "@/lib/prompt";
import { fallbackNoData, tokenRiskFlags } from "@/lib/guardrails";
import type { TokenApiResponse, TokenMetrics } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const address = (searchParams.get("address") ?? "").toLowerCase();

  if (!address) {
    return NextResponse.json({ error: "address parameter required" }, { status: 400 });
  }

  const [dexToken, baseScanToken] = await Promise.all([
    fetchDexScreenerToken(address),
    fetchBaseScanToken(address)
  ]);

  const token: TokenMetrics = {
    address,
    name: dexToken?.name ?? baseScanToken?.name,
    symbol: dexToken?.symbol ?? baseScanToken?.symbol,
    priceUsd: dexToken?.priceUsd ?? baseScanToken?.priceUsd,
    fdv: dexToken?.fdv ?? baseScanToken?.fdv,
    liquidityUsd: dexToken?.liquidityUsd,
    volume24hUsd: dexToken?.volume24hUsd,
    holders: baseScanToken?.holders,
    pairs: dexToken?.pairs
  };

  const prompt = buildSearchPrompt(`Provide a neutral token analysis for ${token.symbol ?? token.name ?? address}`, {
    token,
    dexToken,
    baseScanToken
  });

  let aiSummary = await callGemini(prompt);
  if (!aiSummary?.trim() || aiSummary.trim() === fallbackNoData()) {
    aiSummary = await callGemini(
      buildNoContextPrompt(
        `Token analysis request for ${token.symbol ?? token.name ?? address}. Explain general due diligence steps for Base tokens when live market data is unavailable.`
      )
    );
  }
  const risks = tokenRiskFlags(token);

  const response: TokenApiResponse = {
    token,
    risks,
    sources: [
      { label: "DexScreener", url: `https://dexscreener.com/base/${address}` },
      { label: "BaseScan", url: `https://basescan.org/token/${address}` }
    ],
    aiSummary
  };

  return NextResponse.json(response, { status: 200 });
}
