import { SearchClient } from "@/components/SearchClient";
import { TokenLookupClient } from "@/components/TokenLookupClient";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-base-300">AI-powered Search for Base</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">BaseSeek Search Engine</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-300">
          Natural language search untuk token, kontrak, dan proyek ekosistem Base. Menggabungkan DexScreener,
          BaseScan, Aerodrome, dan Gemini Free API tanpa indexer.
        </p>
      </section>
      <SearchClient />
      <TokenLookupClient />
   </div>
  );
}
