"use client";

import { useEffect } from "react";

export function ThemeProvider() {
  useEffect(() => {
    // Initialize theme from localStorage
    const initializeTheme = () => {
      const saved = localStorage.getItem("theme");
      const theme = !saved || saved === "dark" ? "dark" : "light";
      document.body.setAttribute("data-theme", theme);
      if (!saved) localStorage.setItem("theme", "dark");
    };

    // Initialize on mount
    initializeTheme();

    // Listen for custom theme-changed events (from apariencia page)
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const newTheme = customEvent.detail?.theme || "dark";
      document.body.setAttribute("data-theme", newTheme);
      // Force CSS variable recalculation
      void document.body.offsetHeight;
    };

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme") {
        const newTheme = e.newValue || "dark";
        document.body.setAttribute("data-theme", newTheme);
        // Force CSS variable recalculation
        void document.body.offsetHeight;
      }
    };

    window.addEventListener("theme-changed", handleThemeChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("theme-changed", handleThemeChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return null;
}
