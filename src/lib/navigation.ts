import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
};

export const navLinks: NavLink[] = [
  { href: "/", label: "Search" },
  { href: "/contract", label: "Contract Analyzer" },
  { href: "/projects", label: "Project Directory" }
];
