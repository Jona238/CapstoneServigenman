"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

export default function AppHeader() {
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

    const apply = (dark: boolean) => {
      if (dark) {
        body.setAttribute("data-theme", "dark");
        try { localStorage.setItem("theme", "dark"); } catch {}
        if (toggle) toggle.checked = true;
        if (label) label.textContent = "Oscuro";
      } else {
        body.removeAttribute("data-theme");
        try { localStorage.setItem("theme", "light"); } catch {}
        if (toggle) toggle.checked = false;
        if (label) label.textContent = "Claro";
      }
    };

    // default to dark if not set
    const saved = ((): string | null => {
      try { return localStorage.getItem("theme"); } catch { return null; }
    })();
    apply(!saved || saved === "dark");

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
          <h1>Gestión de Inventario - Recursos Internos</h1>
          <div className="header-actions">
            <input type="checkbox" id="themeSwitch" hidden />
            <label htmlFor="themeSwitch" className="switch" aria-label="Cambiar tema claro/oscuro" />
            <span id="themeLabel" className="theme-label">Claro</span>
            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginLeft: 12,
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,.12)",
                background: "linear-gradient(90deg,#7b5cff,#26c4ff)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
        <nav>
          <ul>
            <li><Link href="/inicio">Inicio</Link></li>
            <li><Link href="/inventario">Inventario</Link></li>
            <li><Link href="/categorias">Categorías</Link></li>
            <li><Link href="/presupuesto">Presupuesto</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
