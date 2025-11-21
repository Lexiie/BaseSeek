"use client";

import { useCallback, useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { RiskBadge } from "@/components/RiskBadge";
import { SourceList } from "@/components/SourceList";
import type { SearchResultPayload } from "@/lib/types";

const exampleQueries = [
  "What tokens are trending on Base this week?",
  "Explain how Aerodrome supports Base liquidity.",
  "Which Base dapps have notable activity today?"
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
    "flex-1 rounded-2xl border border-white/15 bg-slate-950/50 px-5 py-4 text-base text-white placeholder-slate-500 transition focus:border-base-300 focus:outline-none";
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

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
              <p>Search Base</p>
              <p className="text-[10px] text-slate-500">AI safe mode</p>
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
                className="rounded-2xl bg-gradient-to-r from-base-500 to-sky-400 px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {isLoading ? <LoadingDots /> : "Search"}
              </button>
            </form>
          </div>
          <div className="flex flex-wrap gap-2 text-xs text-slate-300">
            {exampleQueries.map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="rounded-full border border-white/10 px-4 py-1.5 transition hover:border-white/40"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <section className="glass-panel p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Response</p>
            <h2 className="text-2xl font-semibold">Reasoned answer</h2>
          </div>
          {result && (
            <button
              onClick={requestMore}
              className="text-sm text-base-300 underline-offset-4 transition hover:text-white hover:underline"
            >
              Explain more
            </button>
          )}
        </div>
        <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          {isLoading ? (
            <p className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-base-300">BaseSeek</span>
              <LoadingDots />
            </p>
          ) : result ? (
            <article className="space-y-5 break-words text-sm leading-relaxed text-slate-100">
              <div className="space-y-2">
                {formatSummary(result.summary).map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
              {result.insights?.length > 0 && (
                <ul className="list-disc space-y-1 pl-5 text-slate-200">
                  {result.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              )}
              {result.guardrail?.blocked && (
                <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-amber-200">
                  {result.guardrail.reason}
                </p>
              )}
              <SourceList sources={result.sources} />
            </article>
          ) : (
            <p className="text-sm text-slate-400">
              Ask a question such as “What tokens are trending on Base this week?” to get started.
            </p>
          )}
        </div>

        {topTokenInsights.length > 0 && (
          <div className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-200 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Top tokens</p>
              <ul className="mt-2 space-y-2">
                {topTokenInsights.map((item) => (
                  <li key={item} className="rounded-2xl border border-white/5 px-3 py-2 text-xs text-slate-300">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {result?.risks?.length ? (
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Risk flags</p>
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
            <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Risk flags</p>
            <div className="grid gap-3 md:grid-cols-2">
              {result.risks.map((flag) => (
                <RiskBadge key={flag.id} flag={flag} />
              ))}
            </div>
          </div>
        ) : null}

        {result?.raw ? (
          <details className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-slate-300">
            <summary className="cursor-pointer text-sm font-semibold">Raw Context</summary>
            <pre className="mt-3 overflow-x-auto text-[11px] text-slate-400">
              {JSON.stringify(result.raw, null, 2)}
            </pre>
          </details>
        ) : null}
      </section>
    </div>
  );
}
