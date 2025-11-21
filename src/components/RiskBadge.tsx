import type { RiskFlag } from "@/lib/types";

const severityStyles: Record<RiskFlag["severity"], string> = {
  info: "border-cyan-400/50 bg-cyan-400/10 text-cyan-100",
  low: "border-emerald-400/50 bg-emerald-400/10 text-emerald-100",
  medium: "border-amber-400/60 bg-amber-400/10 text-amber-100",
  high: "border-rose-500/70 bg-rose-500/10 text-rose-100"
};

export function RiskBadge({ flag }: { flag: RiskFlag }) {
  return (
    <div className={`rounded-2xl border px-3 py-3 text-xs leading-relaxed backdrop-blur ${severityStyles[flag.severity]}`}>
      <p className="font-semibold uppercase tracking-[0.2em]">{flag.label}</p>
      <p className="text-[11px] opacity-90">{flag.description}</p>
    </div>
  );
}
