import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "BaseSeek AI | Neon Base Intelligence",
  description: "Cyberpunk AI copilot for Base – search tokens, contracts, and projects with curated onchain data.",
  metadataBase: new URL("https://baseseek.local")
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.className} cyber-bg text-cyber-50`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="cyber-grid" />
          <div className="relative">
            <SiteHeader />
            <main className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-6 lg:px-8">{children}</main>
            <footer className="mx-auto max-w-6xl border-t border-cyber-500/20 px-4 py-6 text-center text-xs text-cyber-200">
              Powered by public Base ecosystem data. Stay vigilant and verify on-chain activity.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
