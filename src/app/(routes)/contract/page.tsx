import { ContractAnalyzerClient } from "@/components/ContractAnalyzerClient";

export const metadata = {
  title: "Contract Analyzer | BaseSeek"
};

export default function ContractPage() {
  return (
    <div className="space-y-8">
      <section className="glass-panel px-6 py-8 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400">Smart Contract Analyzer</p>
        <h1 className="mt-3 text-3xl font-semibold">ABI &amp; Risk Guardrail Review</h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300">
          Paste any Base contract address to fetch its ABI, run rule-based safety checks, and receive a Gemini
          explanation focused on permissions and operational risk.
        </p>
      </section>
      <ContractAnalyzerClient />
    </div>
  );
}
