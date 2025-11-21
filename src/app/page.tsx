import { SearchClient } from "@/components/SearchClient";
import { TokenLookupClient } from "@/components/TokenLookupClient";

export default function HomePage() {
  return (
    <div className="space-y-16">
      <section className="cyber-panel text-center">
        <p className="cyber-chip mx-auto">Neon base navigator</p>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-cyber-50 sm:text-5xl">
          Decode Base with cyber-grade intelligence
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-cyber-200">
          A cinematic interface that fuses AI-guided reasoning with curated onchain data. Ask questions, vet contracts,
          and probe Base-native projects all from a single neon cockpit.
        </p>
      </section>
      <SearchClient />
      <TokenLookupClient />
    </div>
  );
}
