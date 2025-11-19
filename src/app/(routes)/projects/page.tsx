import { ProjectDirectoryClient } from "@/components/ProjectDirectoryClient";

export const metadata = {
  title: "Project Directory | BaseSeek"
};

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.4em] text-base-300">Base Ecosystem Directory</p>
        <h1 className="mt-2 text-3xl font-semibold">Kurasi Proyek Ekosistem Base</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-300">
          Filter berdasarkan kategori dan jelajahi highlight untuk menemukan dApps Base populer tanpa perlu
          indexer. Data berasal dari file JSON statis sehingga tetap gratis dan ringan.
        </p>
      </div>
      <ProjectDirectoryClient />
    </div>
  );
}
