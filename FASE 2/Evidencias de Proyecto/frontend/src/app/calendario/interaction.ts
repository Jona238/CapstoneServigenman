type CleanupFn = () => void;

export function initializeCalendarPage(): CleanupFn {
  if (typeof document === "undefined") {
    return () => {};
  }

  const cleanupFns: (() => void)[] = [];
  const body = document.body;

  // Initialize theme from localStorage
  applyStoredTheme();

  // Listen for custom theme-changed events from apariencia page
  const handleThemeChange = (e: Event) => {
    const customEvent = e as CustomEvent;
    const theme = customEvent.detail?.theme;

    // Update the data-theme attribute (localStorage is already updated by apariencia page)
    if (theme === "light") {
      body.setAttribute("data-theme", "light");
    } else {
      body.setAttribute("data-theme", "dark");
    }

    // Force CSS variable recalculation by triggering a reflow
    void body.offsetHeight;
  };

  window.addEventListener("theme-changed", handleThemeChange);
  cleanupFns.push(() => window.removeEventListener("theme-changed", handleThemeChange));

  // Also listen for storage changes from other tabs/windows
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === "theme") {
      const newTheme = e.newValue || "dark";
      if (newTheme === "light") {
        body.setAttribute("data-theme", "light");
      } else {
        body.setAttribute("data-theme", "dark");
      }
      // Force CSS variable recalculation
      void body.offsetHeight;
    }
  };

  window.addEventListener("storage", handleStorageChange);
  cleanupFns.push(() => window.removeEventListener("storage", handleStorageChange));

  // Cleanup all event listeners
  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}

function applyStoredTheme() {
  const saved = localStorage.getItem("theme");
  const body = document.body;
  // Default to dark theme if not set
  if (!saved || saved === "dark") {
    if (!saved) localStorage.setItem("theme", "dark");
    body.setAttribute("data-theme", "dark");
  } else {
    body.setAttribute("data-theme", "light");
  }
}
