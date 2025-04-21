"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/stores/theme/useThemeStore";

export default function ThemeProvider() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return null;
}
