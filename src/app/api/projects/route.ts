import { NextRequest, NextResponse } from "next/server";
import { getProjectDirectory } from "@/lib/apis";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").toLowerCase();
  const category = (searchParams.get("category") ?? "").toLowerCase();

  const directory = getProjectDirectory();
  const projects = directory.filter((project) => {
    const matchQuery = q ? project.name.toLowerCase().includes(q) || project.description.toLowerCase().includes(q) : true;
    const matchCategory = category ? project.category.toLowerCase() === category : true;
    return matchQuery && matchCategory;
  });

  const categories = Array.from(new Set(directory.map((project) => project.category)));

  return NextResponse.json({ projects, categories }, { status: 200 });
}
