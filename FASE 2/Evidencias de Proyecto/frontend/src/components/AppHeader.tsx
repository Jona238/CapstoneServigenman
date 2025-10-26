"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import LanguageSelector from "./LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AppHeader() {
  const { t } = useLanguage();
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
      window.location.href = "/login";
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

  return (
    <header className="inventory-header">
      <div className="inventory-header__inner">
        <div className="header-bar">
          <h1>{t.header.title}</h1>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LanguageSelector />
            <input type="checkbox" id="themeSwitch" hidden />
            <label htmlFor="themeSwitch" className="switch" aria-label={t.common.theme} />
            <span id="themeLabel" className="theme-label">{t.common.light}</span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.12)",
                background: "linear-gradient(90deg,#7b5cff,#26c4ff)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
              aria-label={t.common.logout}
              title={t.common.logout}
            >
              {t.common.logout}
            </button>
          </div>
        </div>
        <nav>
          <ul>
            <li><Link href="/inicio">{t.common.home}</Link></li>
            <li><Link href="/inventario">{t.common.inventory}</Link></li>
            <li><Link href="/categorias">{t.common.categories}</Link></li>
            <li><Link href="/presupuesto">{t.common.budget}</Link></li>
            <li><Link href="/ajustes">{t.common.settings}</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
