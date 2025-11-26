"use client";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/hooks/useCurrency";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import { initializeBudgetPage } from "./interaction";
import "../(auth)/login/styles.css";
import "../inventario/styles.css";
import "./styles.css";

export default function BudgetPage() {
  useBodyClass();
  const { t } = useLanguage();
  const { currency, decimals, formatCurrency } = useCurrency();
  const [debtSummary, setDebtSummary] = useState<{
    total_debt: number;
    pending_by_month: { month: string; amount: number }[];
    upcoming_payments: {
      id: number;
      supplier: string;
      due_date: string | null;
      total_amount: number;
      payment_method: string;
      payment_status: string;
    }[];
  }>({ total_debt: 0, pending_by_month: [], upcoming_payments: [] });
  const currencyLabel = {
    CLP: t.settings.chileanPeso,
    USD: t.settings.dollar,
    EUR: t.settings.euro,
  }[currency];
  const sampleValue = formatCurrency(1250000);
  const decimalsLegend =
    decimals === 0
      ? t.budget.currencyNoDecimals
      : t.budget.currencyDecimals.replace("{decimals}", String(decimals));

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

  useEffect(() => {
    const fetchDebtSummary = async () => {
      if (!apiBaseUrl) return;
      try {
        const res = await fetch(`${apiBaseUrl}/api/purchase-invoices/summary/`, {
          credentials: "include",
        });
        if (!res.ok) return;
        const data = await res.json();
        setDebtSummary({
          total_debt: data.total_debt || 0,
          pending_by_month: Array.isArray(data.pending_by_month) ? data.pending_by_month : [],
          upcoming_payments: Array.isArray(data.upcoming_payments) ? data.upcoming_payments : [],
        });
      } catch {
        // ignore network errors
      }
    };
    fetchDebtSummary();
  }, [apiBaseUrl]);

  const maxPendingByMonth = useMemo(() => {
    const amounts = debtSummary.pending_by_month.map((item) => item.total_amount || item.amount || 0);
    return Math.max(...amounts, 0);
  }, [debtSummary.pending_by_month]);

  const upcomingTotals = useMemo(() => {
    const total = debtSummary.upcoming_payments.reduce((acc, item) => acc + (item.total_amount || 0), 0);
    return { count: debtSummary.upcoming_payments.length, total };
  }, [debtSummary.upcoming_payments]);

  const formatDateShort = (iso: string | null | undefined) => {
    if (!iso) return "--";
    const parts = iso.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    try {
      return new Intl.DateTimeFormat("es-CL").format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const computeUrgency = (iso: string | null | undefined) => {
    if (!iso) return "critical";
    const due = new Date(iso + "T00:00:00");
    const today = new Date();
    const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 3) return "critical";
    if (diff <= 10) return "soon";
    return "ok";
  };

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
                <div className="budget-meta" aria-live="polite">
                  <span className="budget-chip">
                    {t.budget.currencyLegend}: {currencyLabel}
                  </span>
                  <span className="budget-chip budget-chip--ghost">
                    {t.budget.currencyExample.replace("{value}", sampleValue)}
                  </span>
                  <span className="budget-chip budget-chip--ghost">
                    {decimalsLegend}
                  </span>
                </div>
              </header>

              <section className="kpi-grid" id="budgetKpis" aria-live="polite" />

              <section className="kpi-grid" aria-live="polite">
                <article className="kpi-card">
                  <p className="kpi-title">Deuda pendiente (cheques)</p>
                  <p className="kpi-value">{formatCurrency(debtSummary.total_debt || 0)}</p>
                </article>
              </section>

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
                  <h3>Pagos pendientes por mes</h3>
                  <p className="panel-caption">Cheques por vencer agrupados por mes</p>
                  <p className="panel-caption">
                    Deuda total en cheques: {formatCurrency(debtSummary.total_debt || 0)}
                  </p>
                </header>
                {debtSummary.pending_by_month.length === 0 ? (
                  <p className="table-empty">No hay pagos pendientes registrados.</p>
                ) : (
                  <div className="pending-month-list">
                    {debtSummary.pending_by_month.map((item) => {
                      const total = item.total_amount ?? item.amount ?? 0;
                      const pct = maxPendingByMonth ? Math.round((total / maxPendingByMonth) * 100) : 0;
                      return (
                        <div className="pending-month-row" key={item.month_label || item.month}>
                          <div className="pending-month-info">
                            <div>
                              <strong>{item.month_label || item.month}</strong>
                              <span className="pending-month-count">{item.count ? `${item.count} pagos` : ""}</span>
                            </div>
                            <div className="pending-month-amount">{formatCurrency(total)}</div>
                          </div>
                          <div className="pending-month-bar">
                            <div
                              className="pending-month-bar-fill"
                              style={{ width: `${pct}%` }}
                              aria-hidden
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="panel">
                <header className="panel-header">
                  <h3>Compromisos de pago</h3>
                  <p className="panel-caption">Próximos pagos de facturas de compra</p>
                  <p className="panel-caption">
                    {upcomingTotals.count} pagos pendientes · Total: {formatCurrency(upcomingTotals.total)}
                  </p>
                </header>
                {debtSummary.upcoming_payments.length === 0 ? (
                  <p className="table-empty">No hay pagos pendientes.</p>
                ) : (
                  <div className="payment-list">
                    {debtSummary.upcoming_payments
                      .slice()
                      .sort((a, b) => (a.due_date || "").localeCompare(b.due_date || ""))
                      .map((item) => {
                        const urgency = computeUrgency(item.due_date);
                        const methodLabel =
                          item.payment_method === "cheque"
                            ? "Cheque"
                            : item.payment_method === "transferencia"
                            ? "Transf."
                            : item.payment_method === "contado"
                            ? "Contado"
                            : item.payment_method || "N/D";
                        const statusLabel = item.payment_status || "pendiente";
                        return (
                          <div className="payment-row" key={item.id}>
                            <div className="payment-main">
                              <div className="payment-date">{formatDateShort(item.due_date)}</div>
                              <div className="payment-supplier">{item.supplier}</div>
                            </div>
                            <div className="payment-meta">
                              <span className="payment-amount">{formatCurrency(item.total_amount || 0)}</span>
                              <span className="pill pill-method">{methodLabel}</span>
                              <span className="pill pill-status">{statusLabel}</span>
                              <span className={`pill pill-urgency pill-urgency--${urgency}`}>
                                {urgency === "critical" ? "Crítico" : urgency === "soon" ? "Próximo" : "Tranquilo"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
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



