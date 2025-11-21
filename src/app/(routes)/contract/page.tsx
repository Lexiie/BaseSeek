import { ContractAnalyzerClient } from "@/components/ContractAnalyzerClient";

export const metadata = {
  title: "Contract Analyzer | BaseSeek"
};

export default function ContractPage() {
  return (
    <div className="space-y-10">
      <section className="cyber-panel">
        <p className="cyber-chip">Smart contract watch</p>
        <h1 className="mt-4 text-3xl font-semibold text-cyber-50">ABI & Risk Guardrail Review</h1>
        <p className="mt-4 max-w-3xl text-sm text-cyber-200">
          Paste a Base contract and let the neon auditor pull ABI data, highlight sensitive permissions, and output a
          narrative that spots potential hazards before you deploy capital.
        </p>
      </section>
      <ContractAnalyzerClient />
    </div>
  );
}
