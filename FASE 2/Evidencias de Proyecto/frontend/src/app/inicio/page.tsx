"use client";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/hooks/useCurrency";
import { useLowStockThreshold } from "@/hooks/useLowStockThreshold";
import { isLowStock } from "@/lib/stockAlerts";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

type ResourcePreview = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  info: string;
};

type CategoryPreview = {
  name: string;
  resources: number;
  units: number;
  value: number;
};

type BudgetSnapshot = {
  label: string;
  value: number | string;
  detail: string;
  trend?: "up" | "down";
};

// Get featured resources - category names will be replaced using translations
// This is sample data that will be displayed in the home page hero section
const getFeaturedResources = (t: any): ResourcePreview[] => [
  {
    id: 1,
    name: "Bombas sumergibles 1HP",
    category: t.categories.waterPumps,
    quantity: 5,
    price: 120000,
    info: "Equipo básico para faenas rurales",
  },
  {
    id: 2,
    name: "Kit reparación rodamientos",
    category: t.categories.spareParts,
    quantity: 2,
    price: 45500,
    info: "Incluye grasa industrial premium",
  },
  {
    id: 5,
    name: "Panel de control trifásico",
    category: t.categories.electricalMaterials,
    quantity: 3,
    price: 189000,
    info: "Tablero listo para montaje en terreno",
  },
];

// Get category preview - category names will be replaced using translations
const getCategoryPreview = (t: any): CategoryPreview[] => [
  {
    name: t.categories.electricalMaterials,
    resources: 18,
    units: 84,
    value: 4280000,
  },
  {
    name: t.categories.waterPumps,
    resources: 9,
    units: 21,
    value: 3515000,
  },
  {
    name: t.categories.specializedTools,
    resources: 6,
    units: 32,
    value: 1458000,
  },
];

// Get budget snapshot - labels will be replaced using translations
const getBudgetSnapshot = (t: any): BudgetSnapshot[] => [
  {
    label: t.home.quarterlyExecution,
    value: "54%",
    detail: t.home.quarterlyGoal,
    trend: "up",
  },
  {
    label: t.home.monthlyExpense,
    value: 1875000,
    detail: t.home.monthLabel,
    trend: "down",
  },
  {
    label: t.home.availableBalance,
    value: 1640000,
    detail: t.home.reservedForEmergencies,
  },
];

const THEME_STORAGE_KEY = "theme";

export default function InicioPage() {
  useBodyClass();
  const router = useRouter();
  const { t } = useLanguage();
  const { formatCurrency } = useCurrency();
  const { threshold: lowStockThreshold } = useLowStockThreshold();

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }

    const className = "home-layout";
    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    const shouldUseDark = savedTheme ? savedTheme === "dark" : true;
    if (!savedTheme) {
      try { window.localStorage.setItem(THEME_STORAGE_KEY, "dark"); } catch {}
    }
    setIsDarkTheme(shouldUseDark);
    applyTheme(shouldUseDark);
  }, []);

  useEffect(() => {
    applyTheme(isDarkTheme);
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme((previous) => {
      const next = !previous;

      try {
        window.localStorage.setItem(
          THEME_STORAGE_KEY,
          next ? "dark" : "light"
        );
      } catch {
        // Ignored — localStorage might be unavailable.
      }

      return next;
    });
  };

  const apiBaseUrl = useMemo(() => {
    const sanitizeBaseUrl = (url: string) => url.replace(/\/+$/, "");
    const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
    if (envUrl) return sanitizeBaseUrl(envUrl);
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return sanitizeBaseUrl("http://localhost:8000");
      }
      return sanitizeBaseUrl(window.location.origin);
    }
    return "";
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${apiBaseUrl}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // best-effort
    } finally {
      // Forzar navegación completa para limpiar estado
      window.location.href = "/login";
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="home-page">
        <AppHeader />
        

        <main className="home-main">
          <section className="home-hero">
            <aside className="home-leftbar" aria-label={t.home.quickAccess}>
              <h3 className="leftbar-title">{t.home.quickAccess}</h3>
              <ul className="leftbar-nav">
                <li><Link href="/inventario">{t.home.goToInventory}</Link></li>
                <li><Link href="/categorias">{t.home.exploreCategories}</Link></li>
                <li><Link href="/presupuesto">{t.home.viewBudget}</Link></li>
                <li><Link href="/inventario#formAgregar">{t.home.addResource}</Link></li>
              </ul>

              <h4 className="leftbar-sub">{t.home.shortcuts}</h4>
              <div className="leftbar-chips" role="list">
                <Link href="/inventario" role="listitem" className="chip">{t.home.lowStock}</Link>
                <Link href="/inventario" role="listitem" className="chip">{t.home.lastAdded}</Link>
                <Link href="/presupuesto" role="listitem" className="chip">{t.home.topExpense}</Link>
              </div>
            </aside>
            <div className="home-hero__content">
              <p className="home-badge">{t.home.badge}</p>
              <h2>{t.home.heroTitle}</h2>
              <p>
                {t.home.heroDescription}
              </p>
              <div className="home-actions">
                <Link className="home-cta" href="/inventario">
                  {t.home.goToInventoryCta}
                </Link>
                <Link className="home-secondary" href="/presupuesto">
                  {t.home.viewFinancialSummary}
                </Link>
              </div>
            </div>
            <div className="home-hero__aside">
              <div className="home-summary">
                <p className="summary-label">{t.home.managedResources}</p>
                <p className="summary-value">+180</p>
                <p className="summary-caption">
                  {t.home.managedResourcesCaption}
                </p>
              </div>
              <div className="home-summary">
                <p className="summary-label">{t.home.activeOrders}</p>
                <p className="summary-value">12</p>
                <p className="summary-caption">
                  {t.home.activeOrdersCaption}
                </p>
              </div>
            </div>
          </section>

          <section className="home-preview">
            <div className="home-preview__header">
              <div>
                <h3>{t.home.featuredResourcesTitle}</h3>
                <p>
                  {t.home.featuredResourcesDescription}
                </p>
              </div>
              <Link className="home-preview__link" href="/inventario">
                {t.home.viewFullInventory}
              </Link>
            </div>

            <div className="home-table__wrapper">
              <table className="home-preview__table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{t.home.resource}</th>
                    <th>{t.inventory.category}</th>
                    <th>{t.inventory.quantity}</th>
                    <th>{t.home.unitValue}</th>
                    <th>{t.home.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {getFeaturedResources(t).map((resource) => {
                    const lowStock = isLowStock(resource.quantity, lowStockThreshold);
                    return (
                      <tr
                        key={resource.id}
                        className={lowStock ? "home-preview__row home-preview__row--low" : "home-preview__row"}
                      >
                        <td>{resource.id}</td>
                        <td>{resource.name}</td>
                        <td>{resource.category}</td>
                        <td className={lowStock ? "home-preview__quantity home-preview__quantity--low" : "home-preview__quantity"}>
                          <span className="quantity-value">{resource.quantity}</span>
                          {lowStock && (
                            <span className="low-stock-badge" role="status">
                              {t.home.lowStock}
                            </span>
                          )}
                        </td>
                        <td>{formatCurrency(resource.price)}</td>
                        <td>{resource.info}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="home-panels">
            <article className="home-panel">
              <h4>{t.home.categoryPlanningTitle}</h4>
              <p>
                {t.home.categoryPlanningDescription}
              </p>
              <div className="home-panel__preview" aria-label={t.home.categoryOverview}>
                <ul className="category-preview">
                  {getCategoryPreview(t).map((category) => (
                    <li key={category.name} className="category-preview__item">
                      <div>
                        <p className="category-preview__name">{category.name}</p>
                        <p className="category-preview__meta">
                          {category.resources} {t.home.resources} · {category.units} {t.inventory.units}
                        </p>
                      </div>
                      <p className="category-preview__value">
                        {formatCurrency(category.value)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/categorias">{t.home.exploreCategories}</Link>
            </article>
            <article className="home-panel">
              <h4>{t.home.budgetMonitoringTitle}</h4>
              <p>
                {t.home.budgetMonitoringDescription}
              </p>
              <div className="home-panel__preview" aria-label={t.home.quickStats}>
                <ul className="budget-preview">
                  {getBudgetSnapshot(t).map((item) => (
                    <li key={item.label} className="budget-preview__item">
                      <div className="budget-preview__header">
                        <p className="budget-preview__label">{item.label}</p>
                        {item.trend ? (
                          <span
                            className={`budget-preview__trend budget-preview__trend--${item.trend}`}
                            aria-hidden="true"
                          >
                            {item.trend === "up" ? "▲" : "▼"}
                          </span>
                        ) : null}
                      </div>
                      <p className="budget-preview__value">
                        {typeof item.value === "number"
                          ? formatCurrency(item.value)
                          : item.value}
                      </p>
                      <p className="budget-preview__detail">{item.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/presupuesto">{t.home.openBudget}</Link>
            </article>
          </section>
        </main>

        <AppFooter />
      </div>
    </>
  );
}

function applyTheme(useDark: boolean) {
  if (typeof document === "undefined") {
    return;
  }

  const body = document.body;
  if (!body) {
    return;
  }

  if (useDark) {
    body.setAttribute("data-theme", "dark");
  } else {
    body.removeAttribute("data-theme");
  }
}
