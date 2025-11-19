import type { Metadata, Route } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaseSeek",
  description: "BaseSeek – AI search engine for the Base ecosystem.",
  metadataBase: new URL("https://baseseek.local")
};

const navLinks: Array<{ href: Route; label: string }> = [
  { href: "/", label: "Search" },
  { href: "/contract", label: "Contract Analyzer" },
  { href: "/projects", label: "Project Directory" }
];

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <div className="min-h-screen">
          <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
              <Link href="/" className="font-semibold tracking-tight">
                BaseSeek
              </Link>
              <nav className="flex flex-wrap gap-4 text-sm text-slate-300">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-slate-400">
            Powered by public Base ecosystem data sources. Do your own research.
          </footer>
        </div>
      </body>
    </html>
  );
}
