"use client";

import {Switch} from "@heroui/react";
import {useTheme} from "next-themes";
import {useEffect, useState} from "react";

/** Toggle between light/dark themes using next-themes. */
export default function ThemeSwitcher() {
  const {resolvedTheme, setTheme} = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  return (
    <Switch
      isSelected={isDark}
      onValueChange={(v) => setTheme(v ? "dark" : "light")}
      aria-label="Toggle theme"
      className="ml-2"
      color="secondary"
      size="sm"
    >
      {isDark ? "Dark" : "Light"}
    </Switch>
  );
}
