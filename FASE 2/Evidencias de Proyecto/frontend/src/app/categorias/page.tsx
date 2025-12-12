"use client";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLowStockThreshold } from "@/hooks/useLowStockThreshold";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

type CategorySummary = {
  name: string;
  total_units: number;
  total_items: number;
  total_value: number;
  cover_photo?: string | null;
};

function getCurrencyPrefs() {
  try {
    const curr = localStorage.getItem("ajustes_currency") || "CLP";
    const decimalsRaw = localStorage.getItem("ajustes_currency_decimals");
    const decimals = decimalsRaw !== null ? parseInt(decimalsRaw, 10) : curr === "CLP" ? 0 : 2;
    const locale = curr === "CLP" ? "es-CL" : curr === "EUR" ? "es-ES" : "en-US";
    return { curr, decimals, locale };
  } catch {
    return { curr: "CLP", decimals: 0, locale: "es-CL" };
  }
}

function formatCurrency(value: number) {
  const { curr, decimals, locale } = getCurrencyPrefs();
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: curr,
      maximumFractionDigits: decimals,
      minimumFractionDigits: decimals,
    }).format(value || 0);
  } catch {
    return String(value || 0);
  }
}

async function backendFetch(path: string, options?: RequestInit): Promise<Response> {
  const base =
    (typeof process !== "undefined" &&
      (process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL)) ||
    "http://localhost:8000";
  const url = `${base.replace(/\/$/, "")}${path}`;
  const init: RequestInit = {
    ...options,
    credentials: options?.credentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  };
  return fetch(url, init);
}

export default function CategoriesPage() {
  useBodyClass(["inventory-layout"]);
  const router = useRouter();
  const { t } = useLanguage();
  const [categories, setCategories] = useState<CategorySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const { threshold: lowStockThreshold } = useLowStockThreshold();
  const apiBaseUrl = useMemo(() => {
    const sanitize = (u: string) => u.replace(/\/+$/, "");
    const env = process.env.NEXT_PUBLIC_API_URL?.trim();
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
      // ignore
    } finally {
      window.location.href = "/login";
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const layoutClass = "inventory-layout";
    document.body.classList.add(layoutClass);
    return () => {
      document.body.classList.remove(layoutClass);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    backendFetch("/api/inventory/categories/summary/", { method: "GET" })
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as CategorySummary[];
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <AnimatedBackground />
      <div className="categories-page">
        <AppHeader />
        

        <div
          className="categories-shell"
          data-low-stock-label={t.inventory.lowStock}
          data-low-stock-threshold={lowStockThreshold}
        >
          <main className="categories-main">
            <section className="categories-hero">
              <div>
                <h2>{t.categories.title}</h2>
                <p>
                  {t.categories.description}
                </p>
              </div>
            </section>

            <section className="categories-hero">
              <div className="categories-hero__header">
                <h3 className="categories-hero-title">Resumen de categorias</h3>
                <p className="categories-hero__hint">
                  {t.categories.hint}
                </p>
              </div>
              <div className="categories-hero-grid">
                <div>
                  <p className="categories-hero-kpi-label">Categorias</p>
                  <p className="categories-hero-kpi-value">{categories.length}</p>
                </div>
                <div>
                  <p className="categories-hero-kpi-label">Total de unidades</p>
                  <p className="categories-hero-kpi-value">
                    {categories.reduce((acc, cat) => acc + (cat.total_units || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="categories-hero-kpi-label">Recursos distintos</p>
                  <p className="categories-hero-kpi-value">
                    {categories.reduce((acc, cat) => acc + (cat.total_items || 0), 0)}
                  </p>
                </div>
                <div>
                  <p className="categories-hero-kpi-label">Valor estimado total</p>
                  <p className="categories-hero-kpi-value">
                    {formatCurrency(
                      categories.reduce((acc, cat) => acc + (cat.total_value || 0), 0)
                    )}
                  </p>
                </div>
              </div>
              {categories.length > 0 && (
                <p className="categories-hero-top">
                  Categoria con mas unidades:{" "}
                  {categories
                    .slice()
                    .sort((a, b) => (b.total_units || 0) - (a.total_units || 0))
                    .slice(0, 1)
                    .map((cat) => `${cat.name} (${cat.total_units} unidades)`)}
                </p>
              )}
            </section>

            <section className="categories-section">
              <header className="categories-section__header">
                <h3>{t.categories.exploreTitle}</h3>
                <p>{t.categories.exploreDescription}</p>
              </header>

              {loading && (
                <p className="categories-empty">
                  {t.categories.loading ?? "Cargando categorias..."}
                </p>
              )}
              {!loading && categories.length === 0 && (
                <p className="categories-empty">{t.categories.emptyState}</p>
              )}

              <section className="categories-strip">
                {categories.map((cat) => (
                  <article
                    key={cat.name}
                    className="category-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/inventario?categoria=${encodeURIComponent(cat.name)}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        router.push(`/inventario?categoria=${encodeURIComponent(cat.name)}`);
                      }
                    }}
                  >
                    {cat.cover_photo ? (
                      <div className="category-card-cover">
                        <img src={cat.cover_photo} alt={cat.name} />
                      </div>
                    ) : (
                      <div className="category-card-cover category-card-cover--empty">Sin foto</div>
                    )}
                    <h3 className="category-card__title">{cat.name}</h3>
                    <span className="category-card__pill">{cat.total_units} unidades</span>
                    <div className="category-card__pill category-card__pill--value">
                      <span>Valor estimado</span>
                      <strong>{formatCurrency(cat.total_value)}</strong>
                    </div>
                    <div className="category-card__stats">
                      <p className="category-card__stat">
                        <span className="category-card__stat-label">Recursos:</span>
                        <span className="category-card__stat-value">{cat.total_items}</span>
                      </p>
                    </div>
                  </article>
                ))}
              </section>
            </section>
          </main>

          <footer className="categories-footer">
            <p>{t.categories.footer}</p>
          </footer>
        </div>
      </div>
    </>
  );
}




