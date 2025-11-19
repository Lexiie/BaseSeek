"use client";

import { useEffect, useState } from "react";
import type { ProjectEntry } from "@/lib/types";

export function ProjectDirectoryClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [projects, setProjects] = useState<ProjectEntry[]>([]);
  const [categories, setCategories] = useState<string[]>(["all"]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query) params.set("q", query);
        if (category !== "all") params.set("category", category);
        const search = params.toString();
        const response = await fetch(search ? `/api/projects?${search}` : "/api/projects");
        if (!response.ok) {
          throw new Error("Failed to load projects");
        }
        const payload = await response.json();
        setProjects(payload.projects ?? []);
        if (Array.isArray(payload.categories)) {
          const unique = Array.from(new Set<string>(payload.categories));
          setCategories(["all", ...unique]);
        }
      } catch (error) {
        console.error("Failed to load projects", error);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [query, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search project name or keyword"
          className="flex-1 rounded-2xl border border-white/10 bg-slate-900/60 px-5 py-3 text-sm text-white outline-none focus:border-base-500"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {loading && <p className="text-sm text-slate-400">Loading directory...</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <article key={project.name} className="rounded-3xl border border-white/5 bg-slate-900/40 p-5 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{project.name}</h3>
                <p className="text-xs uppercase text-slate-400">{project.category}</p>
              </div>
              <a
                href={project.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-base-300 underline-offset-4 hover:underline"
              >
                Website
              </a>
            </div>
            <p className="mt-3 text-sm text-slate-200">{project.description}</p>
            {project.highlights?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-4 text-xs text-slate-400">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-slate-300">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/10 px-2 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {!projects.length && !loading && (
        <p className="text-center text-sm text-slate-400">No projects match the current filters.</p>
      )}
    </div>
  );
}
