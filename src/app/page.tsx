import { SearchClient } from "@/components/SearchClient";
import { TokenLookupClient } from "@/components/TokenLookupClient";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-3">
        <p className="text-xs uppercase tracking-[0.4em] text-base-300">AI-powered Search for Base</p>
        <h1 className="text-4xl font-semibold tracking-tight">BaseSeek Search Engine</h1>
        <p className="mx-auto max-w-2xl text-sm text-slate-300">
          Natural language answers for tokens, contracts, and projects across the Base ecosystem. Lightweight UI,
          mobile-friendly, and focused on safe AI reasoning.
        </p>
      </section>
      <SearchClient />
      <TokenLookupClient />
   </div>
  );
}
