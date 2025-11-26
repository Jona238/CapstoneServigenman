"use client";
import AppHeader from "@/components/AppHeader";
import AppFooter from "@/components/AppFooter";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import { useLanguage } from "@/contexts/LanguageContext";
import { useLowStockThreshold } from "@/hooks/useLowStockThreshold";

import { AnimatedBackground } from "../(auth)/login/components/AnimatedBackground";
import { useBodyClass } from "../(auth)/login/hooks/useBodyClass";
import { initializeInventoryPage } from "./interaction";
import "../(auth)/login/styles.css";
import "./styles.css";

export default function InventoryPage() {
  useBodyClass();
  const { t } = useLanguage();
  const [isDeveloper, setIsDeveloper] = useState(false);
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
      return () => {};
    }
    const cleanup = initializeInventoryPage();
    return () => {
      cleanup();
    };
  }, []);

  // Agrega/quita la clase en <body> para estilos del inventario
  useEffect(() => {
    if (typeof document === "undefined") {
      return () => {};
    }
    const inventoryClass = "inventory-layout";
    document.body.classList.add(inventoryClass);
    return () => {
      document.body.classList.remove(inventoryClass);
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${apiBaseUrl}/api/me/`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setIsDeveloper(Boolean(data?.user?.is_developer));
      } catch {}
    })();
  }, [apiBaseUrl]);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"
        strategy="afterInteractive"
      />
      <AnimatedBackground />

      <div className="inventory-page">
        <AppHeader />
        

        <div className="inventory-shell">
          <main className="inventory-main">
            <section className="inventory-card">
              <div className="inventory-card__heading">
                <h2>{t.inventory.listTitle}</h2>
                <p>{t.inventory.listDescription}</p>
                {isDeveloper && (
                  <p>
                    <a href="/inventario/papelera" style={{ fontWeight: 600 }}>
                      {t.navigation.trash} / {t.navigation.pendingChanges}
                    </a>
                  </p>
                )}
              </div>

              <section className="inventory-section">
                <h3>{t.inventory.addNewResource}</h3>
                <form id="formAgregar" className="inventory-form">
                  <div className="form-grid">
                    <label className="visually-hidden" htmlFor="nuevoRecurso">
                      {t.inventory.resourceName}
                    </label>
                    <input
                      type="text"
                      id="nuevoRecurso"
                      placeholder={t.inventory.resourceName}
                      required
                    />

                    <label className="visually-hidden" htmlFor="nuevaCategoria">
                      {t.inventory.category}
                    </label>
                    <input
                      type="text"
                      id="nuevaCategoria"
                      list="categoriasFormulario"
                      placeholder={t.inventory.category}
                      required
                    />
                    <datalist id="categoriasFormulario">
                      <option value={t.categories.waterPumps}>{t.categories.waterPumps}</option>
                      <option value={t.categories.tools}>{t.categories.tools}</option>
                      <option value={t.categories.electricalMaterials}>{t.categories.electricalMaterials}</option>
                      <option value={t.categories.spareParts}>{t.categories.spareParts}</option>
                      <option value={t.categories.lubricants}>{t.categories.lubricants}</option>
                    </datalist>

                    <label className="visually-hidden" htmlFor="nuevaCantidad">
                      {t.inventory.quantity}
                    </label>
                    <input
                      type="number"
                      id="nuevaCantidad"
                      placeholder={t.inventory.quantity}
                      min="0"
                      step="1"
                      required
                    />

                    <label className="visually-hidden" htmlFor="nuevoPrecio">
                      {t.inventory.price}
                    </label>
                    <input
                      type="number"
                      id="nuevoPrecio"
                      placeholder={t.inventory.price}
                      min="0"
                      step="0.01"
                      required
                    />

                    <label className="visualmente-hidden" htmlFor="nuevaFoto">
                      {t.inventory.photo}
                    </label>
                    <input type="file" id="nuevaFoto" accept="image/*" />

                    <label className="visually-hidden" htmlFor="nuevaInfo">
                      {t.inventory.additionalInfo}
                    </label>
                    <input
                      type="text"
                      id="nuevaInfo"
                      placeholder={t.inventory.additionalInfo}
                    />
                  </div>

                  <button type="submit" className="boton-agregar">
                    {t.inventory.add}
                  </button>
                </form>
              </section>

              <section className="inventory-section">
                <h3>{t.inventory.filterAndSort}</h3>
                <div id="filtros" className="filters-panel">
                  <input
                    type="text"
                    id="filtroIdRango"
                    className="filtro-input"
                    placeholder={t.inventory.idOrRange}
                  />

                  <div className="autocomplete-container">
                    <input
                      type="text"
                      id="filtroRecurso"
                      className="filtro-input"
                      placeholder={t.inventory.filterByResource}
                      autoComplete="off"
                    />
                    <div id="sugerenciasRecurso" className="autocomplete-box" />
                  </div>

                  <input
                    type="text"
                    id="filtroCategoria"
                    className="filtro-input"
                    list="categorias"
                    placeholder={t.inventory.filterByCategory}
                  />
                  <datalist id="categorias">
                    <option value={t.categories.waterPumps}>{t.categories.waterPumps}</option>
                    <option value={t.categories.tools}>{t.categories.tools}</option>
                    <option value={t.categories.electricalMaterials}>{t.categories.electricalMaterials}</option>
                    <option value={t.categories.spareParts}>{t.categories.spareParts}</option>
                    <option value={t.categories.lubricants}>{t.categories.lubricants}</option>
                  </datalist>

                  <input
                    type="text"
                    id="filtroInfo"
                    className="filtro-input"
                    placeholder={t.inventory.filterByInfo}
                  />

                  <select id="ordenarPor" className="filtro-input" defaultValue="id-desc">
                    <option value="">{t.inventory.sortBy}</option>
                    <option value="id-asc">ID ↑</option>
                    <option value="id-desc">ID ↓</option>
                    <option value="recurso-asc">{t.home.resource} A-Z</option>
                    <option value="recurso-desc">{t.home.resource} Z-A</option>
                    <option value="categoria-asc">{t.inventory.category} A-Z</option>
                    <option value="categoria-desc">{t.inventory.category} Z-A</option>
                    <option value="cantidad-asc">{t.inventory.quantity} ↑</option>
                    <option value="cantidad-desc">{t.inventory.quantity} ↓</option>
                    <option value="precio-asc">{t.inventory.price} ↑</option>
                    <option value="precio-desc">{t.inventory.price} ↓</option>
                  </select>

                  <button type="button" className="boton-limpiar">
                    {t.inventory.clearFilters}
                  </button>

                  <div className="exportar-dropdown">
                    <button type="button" className="boton-exportar">
                      {t.inventory.export} ▼
                    </button>
                    <div id="exportMenu" className="dropdown-content">
                      <div className="submenu">
                        <button type="button" className="submenu-btn" data-submenu="excelSub">
                          Excel ▸
                        </button>
                        <div id="excelSub" className="submenu-content">
                          <a href="#" data-export="excel-visible">{t.inventory.visible}</a>
                          <a href="#" data-export="excel-todo">{t.inventory.all}</a>
                        </div>
                      </div>
                      <div className="submenu">
                        <button type="button" className="submenu-btn" data-submenu="csvSub">
                          CSV ▸
                        </button>
                        <div id="csvSub" className="submenu-content">
                          <a href="#" data-export="csv-visible">{t.inventory.visible}</a>
                          <a href="#" data-export="csv-todo">{t.inventory.all}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Empty state placeholder for no results */}
              <div id="emptyState" className="empty-state" aria-live="polite" style={{ display: "none" }}>
                <div className="empty-state__box">
                  <div className="empty-state__icon" aria-hidden="true">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="12" fill="url(#g)" />
                      <path d="M8 7h5l3 3v7a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zm6 3h2l-2-2v2z" fill="#fff"/>
                      <defs>
                        <linearGradient id="g" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#2ad1ff" />
                          <stop offset="1" stopColor="#6d78ff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <h4 className="empty-state__title">{t.inventory.emptyStateTitle}</h4>
                  <p className="empty-state__subtitle">
                    {t.inventory.emptyStateDescription}
                  </p>
                </div>
              </div>

              <div className="tabla-scroll">
                <table
                  id="tablaRecursos"
                  data-low-stock-label={t.inventory.lowStock}
                  data-low-stock-threshold={lowStockThreshold}
                >
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t.home.resource}</th>
                      <th>{t.inventory.category}</th>
                      <th>{t.inventory.quantity}</th>
                      <th>{t.inventory.price}</th>
                      <th>{t.inventory.photo}</th>
                      <th>{t.inventory.info}</th>
                      <th>{t.common.actions}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr data-match="1">
                      <td>1</td>
                      <td>Bombas sumergibles 1HP</td>
                      <td>{t.categories.waterPumps}</td>
                      <td data-quantity="5">
                        <span className="quantity-value">5</span>
                      </td>
                      <td>120.00</td>
                      <td data-foto=""></td>
                      <td>Equipo básico</td>
                      <td>
                        <div className="tabla-acciones">
                          <button type="button" className="boton-editar" data-action="edit">{t.inventory.edit}</button>
                          <button type="button" className="boton-eliminar" data-action="delete">{t.inventory.delete}</button>
                        </div>
                      </td>
                    </tr>
                    <tr data-match="1">
                      <td>2</td>
                      <td>Kit reparación rodamientos</td>
                      <td>{t.categories.spareParts}</td>
                      <td data-quantity="2">
                        <span className="quantity-value">2</span>
                      </td>
                      <td>45.50</td>
                      <td data-foto=""></td>
                      <td>Incluye grasa</td>
                      <td>
                        <div className="tabla-acciones">
                          <button type="button" className="boton-editar" data-action="edit">{t.inventory.edit}</button>
                          <button type="button" className="boton-eliminar" data-action="delete">{t.inventory.delete}</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="paginacion">
                <button type="button" id="btnAnterior">{t.inventory.previous}</button>
                <span id="infoPagina">{t.inventory.page} 1</span>
                <button type="button" id="btnSiguiente">{t.inventory.next}</button>
              </div>
            </section>
          </main>

          <AppFooter />
        </div>
      </div>
    </>
  );
}



