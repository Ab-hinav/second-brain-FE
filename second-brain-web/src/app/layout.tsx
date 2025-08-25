import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import TopNav from "./components/top-nav";


export const metadata = {
  title: "Second Brain",
  description: "Phase 0 – Web",
};

const inter = Inter({subsets: ["latin"]});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* HeroUI theme tokens: text-foreground / bg-background */}
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          <TopNav />
          <main className="container mx-auto p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
