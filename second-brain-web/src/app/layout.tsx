import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import TopNav from "./components/top-nav";
import Footer from "./components/footer";


export const metadata = {
  title: "Second Brain",
  description: "Phase 0 – Web",
};

const inter = Inter({subsets: ["latin"]});

/** Root server layout: global nav, footer, and theme/Session providers. */
export default function RootLayout({children}: {children: React.ReactNode}) {

  console.log('called when visiting root ?')

  return (
    <html lang="en" suppressHydrationWarning>
      {/* HeroUI theme tokens: text-foreground / bg-background */}
      <body className={`${inter.className} bg-background text-foreground`}>
        <Providers>
          <TopNav />
          <main >{children}</main>
         <Footer></Footer>
        </Providers>
      </body>
    </html>
  );
}
