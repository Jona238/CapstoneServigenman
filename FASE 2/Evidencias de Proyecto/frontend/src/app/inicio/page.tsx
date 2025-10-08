"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import Header from "../components/Header";
import { initializeHomePage } from "./interaction";
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

const FEATURED_RESOURCES: ResourcePreview[] = [
  {
    id: 1,
    name: "Bombas sumergibles 1HP",
    category: "Bombas de agua",
    quantity: 5,
    price: 120000,
    info: "Equipo básico para faenas rurales",
  },
  {
    id: 2,
    name: "Kit reparación rodamientos",
    category: "Repuestos",
    quantity: 2,
    price: 45500,
    info: "Incluye grasa industrial premium",
  },
  {
    id: 5,
    name: "Panel de control trifásico",
    category: "Materiales eléctricos",
    quantity: 3,
    price: 189000,
    info: "Tablero listo para montaje en terreno",
  },
];

const CATEGORY_PREVIEW: CategoryPreview[] = [
  {
    name: "Materiales eléctricos",
    resources: 18,
    units: 84,
    value: 4280000,
  },
  {
    name: "Bombas de agua",
    resources: 9,
    units: 21,
    value: 3515000,
  },
  {
    name: "Herramientas especializadas",
    resources: 6,
    units: 32,
    value: 1458000,
  },
];

const BUDGET_SNAPSHOT: BudgetSnapshot[] = [
  {
    label: "Ejecución trimestral",
    value: "54%",
    detail: "Meta Q2: 62%",
    trend: "up",
  },
  {
    label: "Gasto del mes",
    value: 1875000,
    detail: "Abril 2024",
    trend: "down",
  },
  {
    label: "Saldo disponible",
    value: 1640000,
    detail: "Reservado para urgencias",
  },
];

export default function InicioPage() {
  useBodyClass();

  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }

    const className = "inventory-layout";
    document.body.classList.add(className);
    return () => {
      document.body.classList.remove(className);
    };
  }, []);

  useEffect(() => {
    return initializeHomePage();
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
      }),
    []
  );

  return (
    <>
      <AnimatedBackground />

      <div className="inventory-page home-page">
        <Header active="inicio" />

        <div className="inventory-shell home-shell">
          <main className="inventory-main home-main">
            <section className="inventory-card home-hero">
              <div className="home-hero__content">
                <p className="home-badge">Portal interno v1.1</p>
                <h2>Seguimiento integral de recursos en terreno</h2>
                <p>
                  Centraliza el estado de tus activos críticos, recibe alertas de
                  reposición y coordina los equipos técnicos con la visibilidad que
                  proporciona el inventario interactivo.
                </p>

                <div className="home-actions">
                  <Link className="home-cta" href="/inventario">
                    Ir al inventario
                  </Link>
                  <Link className="home-secondary" href="/presupuesto">
                    Ver resumen financiero
                  </Link>
                </div>
              </div>

              <div className="home-hero__aside">
                <div className="home-summary">
                  <p className="summary-label">Recursos gestionados</p>
                  <p className="summary-value">+180</p>
                  <p className="summary-caption">
                    Información sincronizada desde bodegas y cuadrillas móviles.
                  </p>
                </div>
                <div className="home-summary">
                  <p className="summary-label">Órdenes activas</p>
                  <p className="summary-value">12</p>
                  <p className="summary-caption">
                    Coordinación en línea entre técnicos y supervisores regionales.
                  </p>
                </div>
              </div>
            </section>

            <section className="inventory-card home-preview">
              <div className="home-preview__header">
                <div>
                  <h3>Recursos destacados del inventario</h3>
                  <p>
                    Una muestra rápida de los equipos priorizados para la próxima
                    mantención preventiva.
                  </p>
                </div>
                <Link className="home-preview__link" href="/inventario">
                  Ver inventario completo
                </Link>
              </div>

              <div className="home-table__wrapper">
                <table className="home-preview__table">
                  <thead>
                    <tr>
                      <th scope="col">ID</th>
                      <th scope="col">Recurso</th>
                      <th scope="col">Categoría</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Valor unitario</th>
                      <th scope="col">Notas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURED_RESOURCES.map((resource) => (
                      <tr key={resource.id}>
                        <td>{resource.id}</td>
                        <td>{resource.name}</td>
                        <td>{resource.category}</td>
                        <td>{resource.quantity}</td>
                        <td>{currencyFormatter.format(resource.price)}</td>
                        <td>{resource.info}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="home-panels">
              <article className="inventory-card home-panel">
                <header className="home-panel__header">
                  <h4>Planificación de categorías</h4>
                  <p>
                    Explora el carrusel de categorías para segmentar recursos, asignar
                    responsables y activar filtros preconfigurados según cada área.
                  </p>
                </header>
                <div
                  className="home-panel__preview"
                  aria-label="Resumen rápido de categorías"
                >
                  <ul className="category-preview">
                    {CATEGORY_PREVIEW.map((category) => (
                      <li key={category.name} className="category-preview__item">
                        <div>
                          <p className="category-preview__name">{category.name}</p>
                          <p className="category-preview__meta">
                            {category.resources} recursos · {category.units} unidades
                          </p>
                        </div>
                        <p className="category-preview__value">
                          {currencyFormatter.format(category.value)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link className="home-link" href="/categorias">
                  Explorar categorías
                </Link>
              </article>

              <article className="inventory-card home-panel">
                <header className="home-panel__header">
                  <h4>Monitoreo presupuestario</h4>
                  <p>
                    Visualiza el impacto financiero de los insumos mediante gráficas y
                    KPI en la sección de presupuesto.
                  </p>
                </header>
                <div
                  className="home-panel__preview"
                  aria-label="Indicadores financieros destacados"
                >
                  <ul className="budget-preview">
                    {BUDGET_SNAPSHOT.map((item) => (
                      <li key={item.label} className="budget-preview__item">
                        <div className="budget-preview__header">
                          <p className="budget-preview__label">{item.label}</p>
                          {item.trend ? (
                            <span
                              className={`budget-preview__trend budget-preview__trend--${item.trend}`}
                              aria-hidden="true"
                            >
                              {item.trend === "up" ? "↑" : "↓"}
                            </span>
                          ) : null}
                        </div>
                        <p className="budget-preview__value">
                          {typeof item.value === "number"
                            ? currencyFormatter.format(item.value)
                            : item.value}
                        </p>
                        <p className="budget-preview__detail">{item.detail}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link className="home-link" href="/presupuesto">
                  Abrir presupuesto
                </Link>
              </article>
            </section>
          </main>

          <footer className="inventory-footer home-footer">
            <p>
              © {new Date().getFullYear()} Servigenman. Plataforma interna para el
              seguimiento operativo.
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
