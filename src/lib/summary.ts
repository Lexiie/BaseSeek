import type { SearchContext } from "./types";

function formatUsd(value?: number) {
  if (typeof value !== "number") return "n/a";
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }
  return `$${value.toFixed(4)}`;
}

export function buildFallbackSummary(context: SearchContext): string {
  const segments: string[] = [];

  if (context.trendingTokens?.length) {
    const items = context.trendingTokens.slice(0, 3).map((token) => {
      const name = token.symbol ?? token.name ?? "Token";
      return `${name} (${formatUsd(token.priceUsd)} · 24h vol ${formatUsd(token.volume24hUsd)})`;
    });
    segments.push(`Trending tokens on Base: ${items.join(", " )}.`);
  }

  if (context.aerodromePools?.length) {
    const pools = context.aerodromePools.slice(0, 2).map((pool: any) => pool.name ?? pool.symbol ?? "Pool");
    segments.push(`Notable Aerodrome pools: ${pools.join(", " )}.`);
  }

  if (context.projects?.length && context.intent === "project") {
    const projects = context.projects.slice(0, 3).map((project) => project.name);
    segments.push(`Projects from the curated directory: ${projects.join(", " )}.`);
  }

  return segments.length ? segments.join(" ") : "No data found from the available sources.";
}
