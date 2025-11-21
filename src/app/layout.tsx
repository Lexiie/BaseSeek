import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "BaseSeek",
  description: "BaseSeek – AI search engine for the Base ecosystem.",
  metadataBase: new URL("https://baseseek.local")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakarta.className} bg-slate-950 text-slate-50`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="gradient-glow" />
          </div>
          <div className="relative">
            <SiteHeader />
            <main className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">{children}</main>
            <footer className="mx-auto max-w-5xl border-t border-white/5 px-4 py-6 text-center text-xs text-slate-400">
              Powered by public Base ecosystem data. Always verify on-chain activity before acting.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
