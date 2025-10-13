"use client";
import AppHeader from "../components/AppHeader";
import AppFooter from "../components/AppFooter";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import Script from "next/script";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import { initializeBudgetPage } from "./interaction";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

export default function BudgetPage() {
  useBodyClass();

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
                <h2>Presupuesto</h2>
                <p>
                  Resumen financiero a partir de los recursos del inventario
                  (precio × cantidad).
                </p>
              </header>

              <section className="kpi-grid" id="budgetKpis" aria-live="polite" />

              <section className="chart-grid">
                <article className="panel" data-panel="pie">
                  <h3>Distribución del valor por categoría</h3>
                  <canvas id="chartPie" aria-label="Distribución del valor por categoría" />
                </article>
                <article className="panel" data-panel="bar">
                  <h3>Top 10 recursos por valor</h3>
                  <canvas id="chartBar" aria-label="Top 10 recursos por valor" />
                </article>
              </section>

              <section className="panel">
                <header className="panel-header">
                  <h3>Resumen por categoría</h3>
                  <p className="panel-caption">
                    Cantidades y valor estimado consolidados según la división de
                    categorías sincronizada con el inventario.
                  </p>
                </header>
                <div className="table-wrapper">
                  <table className="table-sm" id="tablaResumenCat">
                    <thead>
                      <tr>
                        <th scope="col">Categoría</th>
                        <th scope="col" className="text-right">
                          Recursos distintos
                        </th>
                        <th scope="col" className="text-right">
                          Unidades
                        </th>
                        <th scope="col" className="text-right">
                          Valor total
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



