"use client";

import { useCallback, useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { RiskBadge } from "@/components/RiskBadge";
import { SourceList } from "@/components/SourceList";
import type { SearchResultPayload } from "@/lib/types";

const exampleQueries = [
  "Tracking new Base perps this week",
  "Summarize grants flowing into Base DeFi",
  "Which Base NFT drops are trending?"
];

export function SearchClient() {
  const [searchInput, setSearchInput] = useState(exampleQueries[0]);
  const [result, setResult] = useState<SearchResultPayload | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formatSummary = (text: string) =>
    text
      .split(/\n+/)
      .map((line) => line.replace(/\*\*/g, "").trim())
      .filter(Boolean);

  const fieldStyles =
    "flex-1 rounded-[22px] border border-cyber-500/30 bg-black/50 px-5 py-4 text-base text-cyber-50 placeholder-cyber-300 transition focus:border-cyber-500 focus:outline-none";
  const runSearch = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: prompt })
      });
      if (!response.ok) {
        throw new Error("Search failed. Please try again.");
      }
      const payload: SearchResultPayload = await response.json();
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error, please retry.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await runSearch(searchInput);
  };

  const handleExampleClick = async (example: string) => {
    setSearchInput(example);
    await runSearch(example);
  };

  const requestMore = async () => {
    if (!result) return;
    await runSearch(`${result.query}. Provide additional technical detail.`);
  };

  const topTokenInsights: string[] = Array.isArray((result?.raw as any)?.trendingTokens)
    ? (result?.raw as any).trendingTokens.slice(0, 3).map((token: any) => {
        const numericPrice = Number(token?.priceUsd);
        const price = Number.isFinite(numericPrice) ? `$${numericPrice.toFixed(4)}` : "n/a";
        return `${token?.symbol ?? token?.name ?? "Token"} · price ${price}`;
      })
    : [];

  const describeRawValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return `${value.length} items`;
    }
    if (value && typeof value === "object") {
      return `${Object.keys(value as Record<string, unknown>).length} fields`;
    }
    if (typeof value === "string") {
      return value.length > 40 ? `${value.slice(0, 37)}…` : value;
    }
    if (typeof value === "number") {
      return Number.isFinite(value) ? Number(value).toString() : "n/a";
    }
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return typeof value;
  };

  const rawSummaryEntries =
    result?.raw && typeof result.raw === "object"
      ? Object.entries(result.raw as Record<string, unknown>)
          .slice(0, 3)
          .map(([key, value]) => ({ key, value: describeRawValue(value) }))
      : [];

  const rawFieldCount =
    result?.raw && typeof result.raw === "object"
      ? Object.keys(result.raw as Record<string, unknown>).length
      : 0;

  const filteredSources = result?.sources?.filter((source) => {
    if (!source?.label) return true;
    const label = source.label.toLowerCase();
    const blocked = ["geckoterminal", "aerodrome", "curated project"];
    return !blocked.some((needle) => label.includes(needle));
  });

  return (
    <div className="space-y-6">
      <section className="cyber-panel">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.4em] text-cyber-300">
              <p>Neon query</p>
              <p className="text-cyber-500">Guardian mode</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row">
              <input
                type="text"
                name="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Ask anything about Base..."
                className={fieldStyles}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-[22px] bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500 px-6 py-4 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? <LoadingDots /> : "Pulse"}
              </button>
            </form>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-cyber-200">
            {exampleQueries.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="rounded-full border border-white/10 px-4 py-1.5 transition hover:border-cyan-300 hover:text-cyber-50"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <section className="cyber-panel">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cyber-300">Response</p>
            <h2 className="text-2xl font-semibold text-cyber-50">Synthesized answer</h2>
          </div>
          {result && (
            <button
              onClick={requestMore}
              className="text-sm text-cyber-500 underline-offset-4 transition hover:text-cyber-50 hover:underline"
            >
              Amplify insight
            </button>
          )}
        </div>
        <div className="mt-5 rounded-[28px] border border-white/10 bg-black/60 p-5">
          {isLoading ? (
            <p className="flex items-center gap-3 text-sm text-cyber-200">
              <span className="text-cyber-500">BaseSeek</span>
              <LoadingDots />
            </p>
          ) : result ? (
            <article className="space-y-5 break-words text-sm leading-relaxed text-cyber-50">
              <div className="space-y-2">
                {formatSummary(result.summary).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {result.insights?.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-cyber-200">
                  {result.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              )}
              {result.guardrail?.blocked && (
                <p className="rounded-2xl border border-amber-500/40 bg-amber-500/20 px-3 py-2 text-amber-100">
                  {result.guardrail.reason}
                </p>
              )}
              <SourceList sources={filteredSources ?? []} />
            </article>
          ) : (
            <p className="text-sm text-cyber-200">
              Ask a question such as “Tracking new Base perps this week” to get started.
            </p>
          )}
        </div>

        {topTokenInsights.length > 0 && (
          <div className="mt-6 grid gap-4 rounded-[28px] border border-white/10 bg-black/40 p-4 text-sm text-cyber-100 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyber-300">Top tokens</p>
              <ul className="mt-2 space-y-2">
                {topTokenInsights.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/5 px-3 py-2 text-xs text-cyber-200">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {result?.risks?.length ? (
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-cyber-300">Risk flags</p>
                <div className="mt-3 space-y-2">
                  {result.risks.map((flag) => (
                    <RiskBadge key={flag.id} flag={flag} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {!topTokenInsights.length && result?.risks?.length ? (
          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-cyber-300">Risk flags</p>
            <div className="grid gap-3 md:grid-cols-2">
              {result.risks.map((flag) => (
                <RiskBadge key={flag.id} flag={flag} />
              ))}
            </div>
          </div>
        ) : null}

        {result?.raw ? (
          <section className="mt-6 space-y-3 rounded-[28px] border border-white/10 bg-black/30 p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-cyber-300">Raw context</p>
              <p className="text-sm text-cyber-200">Snapshot of {rawFieldCount} fields fused into the response.</p>
            </div>
            {rawSummaryEntries.length > 0 && (
              <ul className="flex flex-wrap gap-2 text-[11px] text-cyber-200">
                {rawSummaryEntries.map((item) => (
                  <li
                    key={item.key}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-left"
                  >
                    <span className="text-cyber-300">{item.key}:</span> <span className="text-cyber-50">{item.value}</span>
                  </li>
                ))}
              </ul>
            )}
            <details className="rounded-2xl border border-white/10 bg-black/50 p-4 text-xs text-cyber-200">
              <summary className="cursor-pointer text-sm font-semibold text-cyber-50">Open structured detail</summary>
              <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-white/5 bg-black/30 p-3 font-mono text-[11px] text-cyber-200 whitespace-pre-wrap">
                {JSON.stringify(result.raw, null, 2)}
              </div>
            </details>
          </section>
        ) : null}
      </section>
    </div>
  );
}
