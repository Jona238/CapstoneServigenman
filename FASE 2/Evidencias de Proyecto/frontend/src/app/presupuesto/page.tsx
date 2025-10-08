"use client";

import { useEffect } from "react";
import Script from "next/script";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import Header from "../components/Header";
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

      <div className="inventory-page budget-page">
        <Header active="presupuesto" />

        <div className="inventory-shell budget-shell">
          <main className="inventory-main budget-main">
            <section className="inventory-card budget-wrap">
              <header className="budget-header">
                <h2>Presupuesto</h2>
                <p>
                  Resumen financiero a partir de los recursos del inventario
                  (precio × cantidad).
                </p>
              </header>

              <section className="kpi-grid" id="budgetKpis" aria-live="polite" />

              <section className="chart-grid">
                <article className="inventory-card panel" data-panel="pie">
                  <h3>Distribución del valor por categoría</h3>
                  <canvas id="chartPie" aria-label="Distribución del valor por categoría" />
                </article>
                <article className="inventory-card panel" data-panel="bar">
                  <h3>Top 10 recursos por valor</h3>
                  <canvas id="chartBar" aria-label="Top 10 recursos por valor" />
                </article>
              </section>

              <section className="inventory-card panel">
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

          <footer className="inventory-footer budget-footer">
            <p>
              &copy; <span id="year" /> Gestión de Inventario
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
