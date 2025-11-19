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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 md:flex-row">
          <input
            type="text"
            name="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Ask anything about Base..."
            className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-base text-white outline-none transition focus:border-base-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-base-500 px-6 py-4 font-semibold text-white transition hover:bg-base-300 disabled:opacity-60"
          >
            {isLoading ? <LoadingDots /> : "Search"}
          </button>
        </form>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-400">
          {exampleQueries.map((example) => (
            <button
              key={example}
              onClick={() => handleExampleClick(example)}
              className="rounded-full border border-white/10 px-3 py-1 transition hover:border-base-500 hover:text-white"
            >
              {example}
            </button>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-card">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Search Result</h2>
          {result && (
            <button
              onClick={requestMore}
              className="text-sm text-base-300 underline-offset-4 hover:underline"
            >
              Explain more
            </button>
          )}
        </div>
        <div className="mt-4 min-h-[160px] rounded-2xl border border-white/10 bg-slate-950/60 p-4">
          {isLoading ? (
            <p className="flex items-center gap-3 text-sm text-slate-300">
              <span className="text-base-300">BaseSeek</span>
              <LoadingDots />
            </p>
          ) : result ? (
            <article className="space-y-4 text-sm leading-relaxed text-slate-100">
              <p>{result.summary}</p>
              {result.insights?.length > 0 && (
                <ul className="list-disc space-y-1 pl-5">
                  {result.insights.map((insight) => (
                    <li key={insight}>{insight}</li>
                  ))}
                </ul>
              )}
              {result.guardrail?.blocked && (
                <p className="text-amber-300">{result.guardrail.reason}</p>
              )}
              <SourceList sources={result.sources} />
            </article>
          ) : (
            <p className="text-sm text-slate-400">
              Ask a question such as “What tokens are trending on Base this week?” to get started.
            </p>
          )}
        </div>

        {result?.risks?.length ? (
          <div className="mt-6 space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-400">Risk Flags</p>
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
