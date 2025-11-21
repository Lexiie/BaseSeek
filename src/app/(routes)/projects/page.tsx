import { ProjectDirectoryClient } from "@/components/ProjectDirectoryClient";

export const metadata = {
  title: "Project Directory | BaseSeek"
};

export default function ProjectsPage() {
  return (
    <div className="space-y-8">
      <section className="glass-panel px-6 py-8 sm:px-8">
        <p className="text-[11px] uppercase tracking-[0.5em] text-slate-400">Base Ecosystem Directory</p>
        <h1 className="mt-3 text-3xl font-semibold">Curated Base Projects</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-300">
          Filter by category, scan highlights, and discover Base-native dapps from a lightweight curated list.
          Everything ships from a static JSON so the experience stays fast on mobile.
        </p>
      </section>
      <ProjectDirectoryClient />
    </div>
  );
}
