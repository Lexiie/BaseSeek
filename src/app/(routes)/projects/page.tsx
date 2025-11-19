import { ProjectDirectoryClient } from "@/components/ProjectDirectoryClient";

export const metadata = {
  title: "Project Directory | BaseSeek"
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-base-300">Base Ecosystem Directory</p>
        <h1 className="mt-2 text-3xl font-semibold">Curated Base Projects</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Filter by category, scan highlights, and discover Base-native dapps from a lightweight curated list.
          Everything ships from a static JSON so the experience stays fast on mobile.
        </p>
      </div>
      <ProjectDirectoryClient />
    </div>
  );
}
