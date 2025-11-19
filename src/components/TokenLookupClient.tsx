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

export function TokenLookupClient() {
  const [address, setAddress] = useState("0x4200000000000000000000000000000000000006");
  const [result, setResult] = useState<TokenApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/token?address=${address}`);
      if (!response.ok) {
        throw new Error("Gagal memuat token");
      }
      const payload: TokenApiResponse = await response.json();
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error tidak diketahui");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/5 bg-slate-900/30 p-6 shadow-card">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Token Lookup</p>
          <h2 className="text-2xl font-semibold">Analisis Cepat Token</h2>
          <p className="mt-1 text-sm text-slate-400">Fetch data DexScreener + BaseScan lalu rangkum dengan Gemini.</p>
        </div>
        <form onSubmit={lookup} className="flex w-full flex-col gap-3 md:w-1/2 md:flex-row">
          <input
            value={address}
            onChange={(event) => setAddress(event.target.value)}
            placeholder="Alamat token"
            className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-white outline-none focus:border-base-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-2xl bg-base-500 px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
          >
            {isLoading ? <LoadingDots /> : "Cek"}
          </button>
        </form>
      </div>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      {result && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="space-y-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Token</p>
              <h3 className="text-xl font-semibold">{result.token.name ?? result.token.symbol}</h3>
              <p className="text-sm text-slate-400">{result.token.symbol}</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-400">Harga</dt>
                <dd className="text-white">${formatNumber(result.token.priceUsd)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Likuiditas</dt>
                <dd className="text-white">${formatNumber(result.token.liquidityUsd)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Volume 24h</dt>
                <dd className="text-white">${formatNumber(result.token.volume24hUsd)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Holders</dt>
                <dd className="text-white">{formatInteger(result.token.holders)}</dd>
              </div>
            </dl>
            <div className="text-xs text-slate-400">
              Sumber:
              {result.sources.map((source) => (
                <a key={source.url} className="ml-2 underline" href={source.url} target="_blank" rel="noreferrer">
                  {source.label}
                </a>
              ))}
            </div>
          </article>
          <article className="space-y-3">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">AI Summary</p>
            <p className="rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-slate-100">{result.aiSummary}</p>
            {result.risks.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Risk Flags</p>
                {result.risks.map((flag) => (
                  <RiskBadge key={flag.id} flag={flag} />
                ))}
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
