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
      <form onSubmit={analyze} className="cyber-panel flex flex-col gap-4 md:flex-row">
        <input
          value={address}
          onChange={(event) => setAddress(event.target.value)}
          placeholder="Base contract address"
          className="flex-1 rounded-[22px] border border-cyber-500/30 bg-black/50 px-5 py-4 text-base text-cyber-50 placeholder-cyber-300 outline-none focus:border-cyber-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-[22px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-500 px-6 py-4 font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {isLoading ? <LoadingDots /> : "Audit"}
        </button>
      </form>
      {error && <p className="text-sm text-red-400">{error}</p>}

      {result && (
        <section className="cyber-panel space-y-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyber-300">Address</p>
              <p className="font-mono text-sm text-cyber-50">{result.address}</p>
            </div>
            <div className="text-sm text-cyber-200">Categories: {result.categories.join(", ") || "-"}</div>
          </div>

          <article className="space-y-2 rounded-[28px] border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-cyber-50">
            {formatSummary(result.aiSummary).map((line) => (
              <p key={line}>{line}</p>
            ))}
          </article>

          {result.risks.length > 0 && (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {result.risks.map((flag) => (
                <RiskBadge key={flag.id} flag={flag} />
              ))}
            </div>
          )}

          {result.abi.length > 0 && (
            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-cyber-300">Top Functions</p>
              <ul className="mt-4 divide-y divide-white/10 rounded-[28px] border border-white/15 bg-black/30">
                {result.abi.map((item) => (
                  <li key={item.name} className="px-4 py-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-cyber-50">{item.name}</span>
                      <span className="text-xs uppercase tracking-[0.2em] text-cyber-300">{item.stateMutability}</span>
                    </div>
                    {item.inputs?.length ? (
                      <p className="mt-2 text-xs text-cyber-300">
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
