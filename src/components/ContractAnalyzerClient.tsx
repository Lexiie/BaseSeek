"use client";

import { useState } from "react";
import { LoadingDots } from "@/components/LoadingDots";
import { RiskBadge } from "@/components/RiskBadge";
import type { ContractAnalysisResponse } from "@/lib/types";

export function ContractAnalyzerClient() {
  const [address, setAddress] = useState("0x0000000000000000000000000000000000000000");
  const [result, setResult] = useState<ContractAnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formatSummary = (text: string) =>
    text
      .split(/\n+/)
      .map((line) => line.replace(/\*\*/g, "").trim())
      .filter(Boolean);

  const analyze = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/contract?address=${address}`);
      if (!response.ok) {
        throw new Error("Failed to load contract data");
      }
      const payload: ContractAnalysisResponse = await response.json();
      setResult(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error, please retry");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={analyze} className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-card md:flex-row">
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Base contract address"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-4 text-base text-white outline-none transition focus:border-base-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-2xl bg-base-500 px-6 py-4 font-semibold text-white transition hover:bg-base-300 disabled:opacity-60"
        >
          {isLoading ? <LoadingDots /> : "Analyze"}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <section className="rounded-3xl border border-white/5 bg-slate-900/40 p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Address</p>
              <p className="font-mono text-sm text-slate-200">{result.address}</p>
            </div>
            <div className="text-sm text-slate-400">Categories: {result.categories.join(", ") || "-"}</div>
          </div>

          <article className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-100 break-words">
            {formatSummary(result.aiSummary).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </article>

          {result.risks.length > 0 && (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {result.risks.map((flag) => (
                <RiskBadge key={flag.id} flag={flag} />
              ))}
            </div>
          )}

          {result.abi.length > 0 && (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Top Functions</p>
              <ul className="mt-3 divide-y divide-white/5 rounded-2xl border border-white/10 bg-black/30">
                {result.abi.map((item) => (
                  <li key={item.name} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.name}</span>
                      <span className="text-xs text-slate-400">{item.stateMutability}</span>
                    </div>
                    {item.inputs?.length ? (
                      <p className="mt-1 text-xs text-slate-400">
                        Inputs: {item.inputs.map((input) => `${input.name}:${input.type}`).join(", ")}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
