"use client";

import {createContext, useContext, useMemo, useState} from "react";

type SidebarCtx = {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
};

const Ctx = createContext<SidebarCtx | null>(null);

/** Provides sidebar open/close state to dashboard components. */
export function SidebarProvider({children}: {children: React.ReactNode}) {
  const [open, setOpen] = useState(true);
  const value = useMemo(() => ({
    open,
    openSidebar: () => setOpen(true),
    closeSidebar: () => setOpen(false),
    toggleSidebar: () => setOpen(v => !v),
  }), [open]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

/** Hook to access sidebar state within the provider. */
export function useSidebar() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSidebar must be used within <SidebarProvider>");
  return v;
}
