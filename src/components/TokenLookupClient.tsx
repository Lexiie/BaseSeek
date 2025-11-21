"use client";

import { useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { RiskBadge } from "@/components/RiskBadge";
import type { TokenApiResponse } from "@/lib/types";

const formatNumber = (value?: number | string) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toLocaleString(undefined, { maximumFractionDigits: 4 }) : "-";
};

const formatInteger = (value?: number | string) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric).toLocaleString() : "-";
};

const formatSummary = (text: string) =>
  text
    .split(/\n+/)
    .map((line) => line.replace(/\*\*/g, "").trim())
    .filter(Boolean);

export function TokenLookupClient() {
  const [address, setAddress] = useState("0x4200000000000000000000000000000000000006");
  const [result, setResult] = useState<TokenApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const aiSummaryLines = result ? formatSummary(result.aiSummary) : [];
  const aiSummaryPreview = aiSummaryLines.slice(0, 2);
  const aiSummaryDetails = aiSummaryLines.slice(2);

  const lookup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/token?address=${address}`);
      if (!response.ok) {
        throw new Error("Failed to load token data");
      }
      const payload: TokenApiResponse = await response.json();
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error, please retry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="cyber-panel">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="cyber-chip">Token lookup</p>
          <h2 className="mt-4 text-3xl font-semibold text-cyber-50">Instant diagnostics</h2>
          <p className="mt-3 text-sm text-cyber-200">Stream Base token stats directly into the neon cockpit.</p>
        </div>
        <form onSubmit={lookup} className="flex w-full flex-col gap-3 md:w-1/2">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Token address"
            className="rounded-[22px] border border-cyber-500/30 bg-black/50 px-4 py-3 text-sm text-cyber-50 placeholder-cyber-300 outline-none focus:border-cyber-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-[22px] bg-gradient-to-r from-cyan-400 via-sky-500 to-violet-500 px-4 py-3 text-sm font-semibold text-black disabled:opacity-60"
          >
            {isLoading ? <LoadingDots /> : "Scan token"}
          </button>
        </form>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {result && (
        <div className="mt-10 space-y-8">
          <section className="rounded-[32px] border border-white/15 bg-black/40 p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.4em] text-cyber-300">Token response</p>
                <h3 className="text-2xl font-semibold text-cyber-50">AI status report</h3>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <div className="rounded-[26px] border border-white/10 bg-black/60 p-4 text-sm leading-relaxed text-cyber-50">
                {aiSummaryPreview.length ? (
                  aiSummaryPreview.map((line) => (
                    <p key={line} className="mb-2 break-words text-cyber-100 last:mb-0">
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="text-cyber-300">AI summary is not available for this token yet.</p>
                )}
              </div>
              {aiSummaryDetails.length > 0 && (
                <details className="rounded-[26px] border border-white/10 bg-black/40 p-4 text-xs text-cyber-200">
                  <summary className="cursor-pointer text-sm font-semibold text-cyber-50">View AI details</summary>
                  <div className="mt-3 max-h-60 space-y-2 overflow-auto text-sm leading-relaxed text-cyber-50">
                    {aiSummaryDetails.map((line) => (
                      <p key={line} className="break-words">
                        {line}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </div>
            {result.risks.length > 0 && (
              <div className="mt-6 space-y-2">
                <p className="text-xs uppercase tracking-[0.35em] text-cyber-300">Risk Flags</p>
                <div className="space-y-2">
                  {result.risks.map((flag) => (
                    <RiskBadge key={flag.id} flag={flag} />
                  ))}
                </div>
              </div>
            )}
          </section>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="space-y-4 rounded-[28px] border border-white/15 bg-black/50 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-cyber-300">Token</p>
                <h3 className="text-2xl font-semibold text-cyber-50">{result.token.name ?? result.token.symbol}</h3>
                <p className="text-sm text-cyber-200">{result.token.symbol}</p>
              </div>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-cyber-300">Price</dt>
                  <dd className="text-cyber-50">${formatNumber(result.token.priceUsd)}</dd>
                </div>
                <div>
                  <dt className="text-cyber-300">Liquidity</dt>
                  <dd className="text-cyber-50">${formatNumber(result.token.liquidityUsd)}</dd>
                </div>
                <div>
                  <dt className="text-cyber-300">Volume 24h</dt>
                  <dd className="text-cyber-50">${formatNumber(result.token.volume24hUsd)}</dd>
                </div>
                <div>
                  <dt className="text-cyber-300">Holders</dt>
                  <dd className="text-cyber-50">{formatInteger(result.token.holders)}</dd>
                </div>
              </dl>
              <div className="text-xs text-cyber-300">
                Sources:
                {result.sources.map((source) => (
                  <a key={source.url} className="ml-2 underline" href={source.url} target="_blank" rel="noreferrer">
                    {source.label}
                  </a>
                ))}
              </div>
            </article>

            <article className="rounded-[28px] border border-white/15 bg-black/50 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-cyber-300">Key telemetry</p>
              <ul className="mt-3 space-y-3 text-sm text-cyber-100">
                <li className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyber-300">Liquidity depth</p>
                  <p className="text-lg font-semibold text-cyber-50">${formatNumber(result.token.liquidityUsd)}</p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyber-300">Holder count</p>
                  <p className="text-lg font-semibold text-cyber-50">{formatInteger(result.token.holders)}</p>
                </li>
                <li className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.3em] text-cyber-300">24h volume</p>
                  <p className="text-lg font-semibold text-cyber-50">${formatNumber(result.token.volume24hUsd)}</p>
                </li>
              </ul>
            </article>
          </div>
        </div>
      )}
    </section>
  );
}
