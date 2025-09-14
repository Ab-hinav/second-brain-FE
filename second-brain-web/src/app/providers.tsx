"use client";
// Global providers for Session, HeroUI, and Theme handling

import {HeroUIProvider} from "@heroui/react";
import { SessionProvider } from "next-auth/react";
import {ThemeProvider as NextThemesProvider} from "next-themes";
import {useRouter} from "next/navigation";

/** Wraps the app with NextAuth Session, HeroUI, and theme providers. */
export default function Providers({children}: {children: React.ReactNode}) {
  const router = useRouter();

  return (
    <SessionProvider>
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
    </SessionProvider>
  );
}
