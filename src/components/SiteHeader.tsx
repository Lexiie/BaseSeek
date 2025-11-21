"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center gap-4 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 shadow-card backdrop-blur-xl">
        <Link href="/" className="flex flex-1 items-center gap-2 text-sm font-semibold tracking-tight" onClick={closeMenu}>
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-base-500/20 text-base-300">B</span>
          <div>
            <p className="text-base leading-none">BaseSeek</p>
            <p className="text-[11px] font-normal text-slate-400">Base-native AI search</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1 transition hover:bg-white/5 hover:text-white"
            >
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
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      <div
        className={`md:hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-48" : "max-h-0"
        } overflow-hidden px-4 text-sm text-slate-200`}
      >
        <nav className="mx-auto mt-3 flex max-w-5xl flex-col gap-2 rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-4 backdrop-blur">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-xl px-4 py-2 transition hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
