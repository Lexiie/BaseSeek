import { ContractAnalyzerClient } from "@/components/ContractAnalyzerClient";

export const metadata = {
  title: "Contract Analyzer | BaseSeek"
};

export default function ContractPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-base-300">Smart Contract Analyzer</p>
        <h1 className="mt-2 text-3xl font-semibold">Analisis ABI & Risk Guardrail</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-300">
          Masukkan alamat kontrak Base kemudian kami fetch ABI dari BaseScan, jalankan rule-based risk check, dan
          minta Gemini menjelaskan fungsi penting tanpa memberi saran investasi.
        </p>
      </div>
      <ContractAnalyzerClient />
    </div>
  );
}
