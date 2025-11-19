"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-semibold tracking-tight" onClick={closeMenu}>
          BaseSeek
        </Link>
        <nav className="hidden items-center gap-5 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={toggleMenu}
          className="rounded-xl border border-white/10 p-2 text-slate-200 hover:border-white/30 md:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      <div
        className={`md:hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-48" : "max-h-0"
        } overflow-hidden border-t border-white/5 bg-slate-950/95`}
      >
        <nav className="flex flex-col gap-2 px-4 py-4 text-sm text-slate-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-xl border border-white/5 px-4 py-2 transition hover:border-white/40"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
