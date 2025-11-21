"use client";

import { useState } from "react";
import Link from "next/link";
import { navLinks } from "@/lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-4 rounded-[28px] border border-cyber-500/40 bg-black/40 px-5 py-4 shadow-[0_25px_60px_-40px_rgba(0,240,255,0.8)] backdrop-blur-2xl">
        <Link href="/" className="flex flex-1 items-center gap-3 text-sm font-semibold tracking-[0.2em]" onClick={closeMenu}>
          <span className="glow-ring inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-cyber-accent text-lg text-black">
            β
          </span>
          <div>
            <p className="text-lg text-cyber-50">BaseSeek</p>
            <p className="text-[11px] uppercase tracking-[0.4em] text-cyber-300">Neon Base intelligence</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-3 text-xs uppercase tracking-[0.35em] text-cyber-300 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-white/10 px-4 py-2 transition hover:border-cyber-500/60 hover:text-cyber-50"
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
          className="rounded-2xl border border-white/20 p-2 text-cyber-50 hover:border-cyber-500/60 md:hidden"
        >
          <span className="sr-only">Toggle navigation</span>
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
      <div
        className={`md:hidden transition-[max-height] duration-300 ease-in-out ${
          open ? "max-h-64" : "max-h-0"
        } overflow-hidden px-4 text-sm text-cyber-50`}
      >
        <nav className="mx-auto mt-4 flex max-w-6xl flex-col gap-3 rounded-[28px] border border-cyber-500/30 bg-black/70 px-5 py-5 backdrop-blur-xl">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="rounded-2xl border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.4em] transition hover:border-cyber-500/60"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
