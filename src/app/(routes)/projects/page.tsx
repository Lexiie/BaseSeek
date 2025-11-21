import { ProjectDirectoryClient } from "@/components/ProjectDirectoryClient";

export const metadata = {
  title: "Project Directory | BaseSeek"
};

export default function ProjectsPage() {
  return (
    <div className="space-y-10">
      <section className="cyber-panel">
        <p className="cyber-chip">Base ecosystem directory</p>
        <h1 className="mt-4 text-3xl font-semibold text-cyber-50">Curated Base Projects</h1>
        <p className="mt-4 max-w-3xl text-sm text-cyber-200">
          Filter neon-tagged Base dapps, parse their highlights, and keep tabs on who is experimenting with the chain’s
          bleeding edge—no dashboards required.
        </p>
      </section>
      <ProjectDirectoryClient />
    </div>
  );
}
