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
  const sections: string[] = [];

  if (context.trendingTokens?.length) {
    const items = context.trendingTokens.slice(0, 3).map((token) => {
      const name = token.symbol ?? token.name ?? "Token";
      return `- ${name}: ${formatUsd(token.priceUsd)} (24h volume ${formatUsd(token.volume24hUsd)})`;
    });
    sections.push(["Trending tokens on Base:", ...items].join("\n"));
  }

  if (context.aerodromePools?.length) {
    const pools = context.aerodromePools.slice(0, 5).map((pool: any) => {
      const name = pool.name ?? pool.symbol ?? "Pool";
      return `- ${name}: liquidity ${formatUsd(pool.reserveUsd)} · 24h volume ${formatUsd(pool.volume24hUsd)}`;
    });
    sections.push(["Top Aerodrome pools:", ...pools].join("\n"));
  }

  if (context.projects?.length && context.intent === "project") {
    const projects = context.projects.slice(0, 3).map((project) => `- ${project.name} (${project.category})`);
    sections.push(["Curated Base projects:", ...projects].join("\n"));
  }

  return sections.length ? sections.join("\n\n") : "No data found from the available sources.";
}
