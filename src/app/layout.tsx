import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} bg-slate-950 text-slate-50`}>
        <div className="min-h-screen">
          <SiteHeader />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
          <footer className="border-t border-white/5 px-4 py-6 text-center text-xs text-slate-400">
            Powered by public Base ecosystem data sources. Do your own research.
          </footer>
        </div>
      </body>
    </html>
  );
}
