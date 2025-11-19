import { ContractAnalyzerClient } from "@/components/ContractAnalyzerClient";

export const metadata = {
  title: "Contract Analyzer | BaseSeek"
};

export default function ContractPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-base-300">Smart Contract Analyzer</p>
        <h1 className="mt-2 text-3xl font-semibold">ABI & Risk Guardrail Review</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Paste any Base contract address to fetch its ABI, run rule-based safety checks, and receive a Gemini
          explanation focused on permissions and operational risk.
        </p>
      </div>
      <ContractAnalyzerClient />
    </div>
  );
}
