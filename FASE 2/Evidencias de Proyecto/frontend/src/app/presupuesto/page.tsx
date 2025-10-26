"use client";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";
import { useLanguage } from "@/contexts/LanguageContext";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import { initializeBudgetPage } from "./interaction";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

export default function BudgetPage() {
  useBodyClass();
  const { t } = useLanguage();

  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }

    const layoutClass = "inventory-layout";
    document.body.classList.add(layoutClass);
    return () => {
      document.body.classList.remove(layoutClass);
    };
  }, []);

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
      return () => {};
    }

    const cleanup = initializeBudgetPage();
    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="afterInteractive"
      />
      <AnimatedBackground />

      <div className="budget-page">
        <AppHeader />
        

        <div className="budget-shell">
          <main className="budget-main">
            <section className="budget-wrap">
              <header className="budget-header">
                <h2>{t.budget.budgetTitle}</h2>
                <p>
                  {t.budget.financialSummary}
                </p>
              </header>

              <section className="kpi-grid" id="budgetKpis" aria-live="polite" />

              <section className="chart-grid">
                <article className="panel" data-panel="pie">
                  <h3>{t.budget.valueDistribution}</h3>
                  <canvas id="chartPie" aria-label={t.budget.valueDistribution} />
                </article>
                <article className="panel" data-panel="bar">
                  <h3>{t.budget.topResources}</h3>
                  <canvas id="chartBar" aria-label={t.budget.topResources} />
                </article>
              </section>

              <section className="panel">
                <header className="panel-header">
                  <h3>{t.budget.categorySummary}</h3>
                  <p className="panel-caption">
                    {t.budget.categorySummaryCaption}
                  </p>
                </header>
                <div className="table-wrapper">
                  <table className="table-sm" id="tablaResumenCat">
                    <thead>
                      <tr>
                        <th scope="col">{t.inventory.category}</th>
                        <th scope="col" className="text-right">
                          {t.budget.distinctResources}
                        </th>
                        <th scope="col" className="text-right">
                          {t.inventory.units}
                        </th>
                        <th scope="col" className="text-right">
                          {t.budget.totalValue}
                        </th>
                      </tr>
                    </thead>
                    <tbody />
                  </table>
                </div>
              </section>
            </section>
          </main>

          <AppFooter />
        </div>
      </div>
    </>
  );
}



