"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppHeader() {
  const { t } = useLanguage();
  const [isDeveloper, setIsDeveloper] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const apiBaseUrl = useMemo(() => {
    const sanitize = (u: string) => u.replace(/\/+$/, "");
    const env = process.env.NEXT_PUBLIC_API_URL?.trim() || process.env.NEXT_PUBLIC_BACKEND_URL?.trim();
    if (env) return sanitize(env);
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return sanitize("http://localhost:8000");
      }
      return sanitize(window.location.origin);
    }
    return "";
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/logout/`, { method: "POST", credentials: "include" });
    } catch {
      // ignore network errors
    } finally {
      try { document.cookie = "auth_ok=; Max-Age=0; path=/"; } catch {}

      // Show goodbye message
      const logoutMessage = document.createElement("div");
      logoutMessage.className = "logout-message";
      logoutMessage.innerHTML = `
        <div class="logout-message-content">
          <p>¡Hasta luego!</p>
          <p>ServiGenman</p>
        </div>
      `;
      document.body.appendChild(logoutMessage);

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    }
  };

  // Theme switch (shared across pages)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const body = document.body;
    const toggle = document.getElementById("themeSwitch") as HTMLInputElement | null;
    const label = document.getElementById("themeLabel");
    const root = document.documentElement;

    const apply = (dark: boolean) => {
      if (dark) {
        body.setAttribute("data-theme", "dark");
        try { localStorage.setItem("theme", "dark"); } catch {}
        if (toggle) toggle.checked = true;
        if (label) label.textContent = t.common.dark;
      } else {
        body.removeAttribute("data-theme");
        try { localStorage.setItem("theme", "light"); } catch {}
        if (toggle) toggle.checked = false;
        if (label) label.textContent = t.common.light;
      }
    };

    // default to dark if not set
    const saved = ((): string | null => {
      try { return localStorage.getItem("theme"); } catch { return null; }
    })();
    apply(!saved || saved === "dark");

    // Apply font scale if present
    try {
      const fs = localStorage.getItem("ajustes_font_scale");
      if (fs) root.setAttribute("data-font-scale", fs);
    } catch {}

    if (toggle) {
      const onChange = () => apply(toggle.checked);
      toggle.addEventListener("change", onChange);
      return () => toggle.removeEventListener("change", onChange);
    }
    return () => {};
  }, []);

  // Load current user role to conditionally render Papelera link
  useEffect(() => {
    let aborted = false;
    async function load() {
      try {
        const res = await fetch(`${apiBaseUrl}/api/me/`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        if (!aborted) setIsDeveloper(Boolean(data?.user?.is_developer));
      } catch {}
    }
    if (apiBaseUrl) void load();
    return () => { aborted = true; };
  }, [apiBaseUrl]);

  // Pending count polling (developers only)
  useEffect(() => {
    if (!isDeveloper || !apiBaseUrl) return;
    let aborted = false;
    const getCount = async () => {
      try {
        const r = await fetch(`${apiBaseUrl}/api/inventory/pending/count/`, { credentials: "include" });
        if (!r.ok) return;
        const d = await r.json();
        if (!aborted) setPendingCount(Number(d?.pending ?? 0));
      } catch {}
    };
    void getCount();
    const timer = setInterval(getCount, 15000);
    return () => { aborted = true; clearInterval(timer); };
  }, [isDeveloper, apiBaseUrl]);

  return (
    <header className="inventory-header">
      <div className="inventory-header__inner">
        <div className="header-bar">
          <div className="inventory-title__wrap">
            <div className="inventory-title__logo">SG</div>
            <div>
              <h1 className="inventory-title">Inventario Servigenman</h1>
              <p className="inventory-subtitle">Operaciones y control en un solo panel</p>
            </div>
          </div>
          <div className="header-actions refined" aria-label="User and theme controls">
            <div className="header-actions__group">
              <LanguageSelector />
              <div className="theme-toggle">
                <input type="checkbox" id="themeSwitch" hidden />
                <label htmlFor="themeSwitch" className="switch" aria-label={t.common.theme} />
                <span id="themeLabel" className="theme-label">{t.common.light}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="logout-btn"
              aria-label={t.common.logout}
              title={t.common.logout}
            >
              <span className="logout-btn__icon" aria-hidden>↩</span>
              {t.common.logout}
            </button>
          </div>
        </div>
        <nav className="nav-chipbar" aria-label="Primary">
          <ul>
            <li><Link href="/inicio">{t.common.home}</Link></li>
            <li><Link href="/inventario">{t.common.inventory}</Link></li>
            <li><Link href="/facturas">{t.common.invoices}</Link></li>
            <li><Link href="/calendario">{t.common.calendar}</Link></li>
            {isDeveloper && (
              <li>
                <Link href="/inventario/papelera">
                  Papelera{typeof pendingCount === "number" && pendingCount > 0 ? ` (${pendingCount})` : ""}
                </Link>
              </li>
            )}
            <li><Link href="/categorias">{t.common.categories}</Link></li>
            <li><Link href="/presupuesto">{t.common.budget}</Link></li>
            <li><Link href="/ajustes">{t.common.settings}</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}





