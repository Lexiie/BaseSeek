import { SearchClient } from "@/components/SearchClient";
import { TokenLookupClient } from "@/components/TokenLookupClient";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="glass-panel px-6 py-10 text-center sm:px-10">
        <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400">Base ecosystem copilot</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Search Base with quiet confidence</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
          BaseSeek pairs curated data sources with opinionated AI prompts so you can quickly understand tokens,
          contracts, and onchain activity without digging through dashboards.
        </p>
      </section>
      <SearchClient />
      <TokenLookupClient />
    </div>
  );
}
