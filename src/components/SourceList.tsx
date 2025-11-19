import type { SourceLink } from "@/lib/types";

export function SourceList({ sources }: { sources: SourceLink[] }) {
  if (!sources?.length) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3 text-xs">
      {sources.map((source) => (
        <a
          key={source.url}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/10 px-3 py-1 text-slate-300 transition hover:border-white/40"
        >
          {source.label}
        </a>
      ))}
    </div>
  );
}
