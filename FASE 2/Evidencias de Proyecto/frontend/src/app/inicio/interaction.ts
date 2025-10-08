type CleanupFn = () => void;

const THEME_STORAGE_KEY = "theme";

export function initializeHomePage(): CleanupFn {
  if (typeof document === "undefined") {
    return () => {};
  }

  const cleanupFns: CleanupFn[] = [];

  const toggle = document.getElementById("themeSwitch") as HTMLInputElement | null;
  if (toggle) {
    const handler = () => updateTheme(toggle.checked);
    toggle.addEventListener("change", handler);
    cleanupFns.push(() => toggle.removeEventListener("change", handler));
  }

  const storageHandler = (event: StorageEvent) => {
    if (!event.key || event.key === THEME_STORAGE_KEY) {
      applyStoredTheme();
    }
  };
  window.addEventListener("storage", storageHandler);
  cleanupFns.push(() => window.removeEventListener("storage", storageHandler));

  const focusHandler = () => applyStoredTheme();
  window.addEventListener("focus", focusHandler);
  cleanupFns.push(() => window.removeEventListener("focus", focusHandler));

  applyStoredTheme();

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}

function updateTheme(isDark: boolean) {
  const body = document.body;
  const label = document.getElementById("themeLabel");

  if (isDark) {
    body.setAttribute("data-theme", "dark");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    } catch {
      // localStorage might be unavailable
    }
    if (label) {
      label.textContent = "Oscuro";
    }
  } else {
    body.removeAttribute("data-theme");
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    } catch {
      // localStorage might be unavailable
    }
    if (label) {
      label.textContent = "Claro";
    }
  }
}

function applyStoredTheme() {
  const toggle = document.getElementById("themeSwitch") as HTMLInputElement | null;
  const label = document.getElementById("themeLabel");
  const storedTheme = (() => {
    try {
      return window.localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  const useDark = storedTheme === "dark";

  if (toggle) {
    toggle.checked = useDark;
  }

  if (useDark) {
    document.body.setAttribute("data-theme", "dark");
    if (label) {
      label.textContent = "Oscuro";
    }
  } else {
    document.body.removeAttribute("data-theme");
    if (label) {
      label.textContent = "Claro";
    }
  }
}
