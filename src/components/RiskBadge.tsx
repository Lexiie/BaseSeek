import type { RiskFlag } from "@/lib/types";

const severityStyles: Record<RiskFlag["severity"], string> = {
  info: "bg-slate-800 text-slate-200 border-slate-700",
  low: "bg-emerald-900/40 text-emerald-200 border-emerald-700/70",
  medium: "bg-amber-900/40 text-amber-200 border-amber-700/70",
  high: "bg-red-900/40 text-red-200 border-red-700/70"
};

export function RiskBadge({ flag }: { flag: RiskFlag }) {
  return (
    <div
      className={`rounded-xl border px-3 py-2 text-xs leading-relaxed ${severityStyles[flag.severity]}`}
    >
      <p className="font-semibold">{flag.label}</p>
      <p className="text-[11px] opacity-90">{flag.description}</p>
    </div>
  );
}
