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

export default function InventoryPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  useBodyClass();
  const { t } = useLanguage();
  const initialCategory =
    typeof searchParams?.categoria === "string" ? searchParams.categoria : "";
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
            <span
              id="inventoryInitialCategory"
              data-value={initialCategory}
              style={{ display: "none" }}
            />
            <span
              id="inventoryInitialCategory"
              data-value={initialCategory}
              style={{ display: "none" }}
            />
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
                    placeholder="Filtrar por categoria"
                  />
                  <datalist id="categorias">
                  </datalist>

                  <input
                    type="text"
                    id="filtroCantidad"
                    className="filtro-input"
                    placeholder="Filtrar por cantidad"
                  />

                  <input
                    type="text"
                    id="filtroPrecio"
                    className="filtro-input"
                    placeholder="Filtrar por precio"
                  />

                  <input
                    type="text"
                    id="filtroUbicacion"
                    className="filtro-input"
                    placeholder="Filtrar por ubicacion"
                  />

                  <select id="ordenarPor" className="filtro-input" defaultValue="id-desc">
                    <option value="">Ordenar por...</option>
                    <option value="id-asc">ID ascendente</option>
                    <option value="id-desc">ID descendente</option>
                    <option value="recurso-asc">Recurso A-Z</option>
                    <option value="recurso-desc">Recurso Z-A</option>
                    <option value="categoria-asc">Categoria A-Z</option>
                    <option value="categoria-desc">Categoria Z-A</option>
                    <option value="cantidad-asc">Cantidad ascendente</option>
                    <option value="cantidad-desc">Cantidad descendente</option>
                    <option value="precio-asc">Precio ascendente</option>
                    <option value="precio-desc">Precio descendente</option>
                  </select>

                  <button type="button" className="boton-limpiar">
                    {t.inventory.clearFilters}
                  </button>

                  <button type="button" className="boton-exportar">
                    {t.inventory.export} ▼
                  </button>
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

              <div id="inventoryActionsPanel" className="inventory-actions-panel">
                <div className="inventory-actions-left">
                  <span>Recurso seleccionado:</span>
                  <strong id="inventorySelectedName">Ninguno seleccionado</strong>
                </div>
                <div className="inventory-actions-right">
                  <button
                    id="inventoryEditSelected"
                    type="button"
                    className="boton-editar"
                    data-global-action="edit-selected"
                    disabled
                  >
                    Editar recurso
                  </button>
                  <button
                    id="inventoryDeleteSelected"
                    type="button"
                    className="boton-eliminar"
                    data-global-action="delete-selected"
                    disabled
                  >
                    Eliminar recurso
                  </button>
                </div>
              </div>

              <div className="tabla-scroll inventory-table-wrapper">
                <table
                  id="tablaRecursos"
                  className="inventory-table"
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
                      <th>Distribuidor</th>
                      <th>Ubicacion</th>
                      <th>Ubicacion (fotos)</th>
                      <th>{t.inventory.info}</th>
                      <th className="acciones-col"></th>
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
                  <td>Acme Corp</td>
                  <td>Estante A1</td>
                  <td>-</td>
                  <td>Equipo basico</td>
                  <td className="acciones-cell">
                    <div className="tabla-acciones">
                      <button type="button" className="boton-editar" data-action="edit">{t.inventory.edit}</button>
                      <button type="button" className="boton-eliminar" data-action="delete">{t.inventory.delete}</button>
                      <button type="button" className="boton-salida" data-action="out">Salida</button>
                    </div>
                  </td>
                </tr>
                <tr data-match="1">
                  <td>2</td>
                  <td>Kit reparacion rodamientos</td>
                  <td>{t.categories.spareParts}</td>
                  <td data-quantity="2">
                    <span className="quantity-value">2</span>
                  </td>
                  <td>45.50</td>
                  <td data-foto=""></td>
                  <td>Proveedor X</td>
                  <td>Estante B2</td>
                  <td>-</td>
                  <td>Incluye grasa</td>
                  <td className="acciones-cell">
                    <div className="tabla-acciones">
                      <button type="button" className="boton-editar" data-action="edit">{t.inventory.edit}</button>
                      <button type="button" className="boton-eliminar" data-action="delete">{t.inventory.delete}</button>
                      <button type="button" className="boton-salida" data-action="out">Salida</button>
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

      <div
        id="locationPhotosModal"
        className="location-photos-modal-overlay"
        aria-hidden="true"
      >
        <div
          className="location-photos-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="locationPhotosTitle"
        >
          <div className="location-photos-modal__header">
            <h3 id="locationPhotosTitle" className="location-photos-title">
              Fotos de ubicacion
            </h3>
            <button
              type="button"
              className="location-photos-close"
              data-close-location-photos
              aria-label="Cerrar modal"
            >
              x
            </button>
          </div>
          <p className="location-photos-name"></p>
          <div className="location-photos-grid"></div>
          <div className="location-photos-footer">
            <button type="button" className="location-photos-close-btn" data-close-location-photos>
              Cerrar
            </button>
          </div>
        </div>
      </div>

      <div
        id="exportModal"
        className="export-modal-overlay"
        aria-hidden="true"
      >
        <div className="export-modal" role="dialog" aria-modal="true" aria-labelledby="exportModalTitle">
          <div className="export-modal__header">
            <h3 id="exportModalTitle">Exportar inventario</h3>
            <button type="button" className="export-modal__close" data-export-close aria-label="Cerrar">x</button>
          </div>
          <p className="export-modal__subtitle">Selecciona que columnas quieres incluir en el archivo.</p>
          <div className="export-modal__body">
            <div className="export-columns">
              <label><input type="checkbox" name="exportColumn" value="id" defaultChecked /> ID</label>
              <label><input type="checkbox" name="exportColumn" value="recurso" defaultChecked /> Recurso</label>
              <label><input type="checkbox" name="exportColumn" value="categoria" defaultChecked /> Categoria</label>
              <label><input type="checkbox" name="exportColumn" value="cantidad" defaultChecked /> Cantidad</label>
              <label><input type="checkbox" name="exportColumn" value="precio" defaultChecked /> Precio</label>
              <label><input type="checkbox" name="exportColumn" value="foto" defaultChecked /> Foto</label>
              <label><input type="checkbox" name="exportColumn" value="distribuidor" defaultChecked /> Distribuidor</label>
              <label><input type="checkbox" name="exportColumn" value="ubicacion" defaultChecked /> Ubicacion</label>
              <label><input type="checkbox" name="exportColumn" value="ubicacion_fotos" defaultChecked /> Ubicacion (fotos)</label>
              <label><input type="checkbox" name="exportColumn" value="info" defaultChecked /> Informacion</label>
            </div>
            <div className="export-scope">
              <p>Alcance:</p>
              <label><input type="radio" name="exportScope" value="visible" defaultChecked /> Filas visibles (segun filtros y pagina actual)</label>
              <label><input type="radio" name="exportScope" value="todo" /> Todas las filas</label>
            </div>
          </div>
          <div className="export-modal__footer">
            <div className="export-modal__footer-buttons">
              <button type="button" id="exportExcelBtn" className="boton-editar">Exportar a Excel</button>
              <button type="button" id="exportCsvBtn" className="boton-eliminar">Exportar a CSV</button>
            </div>
            <button type="button" className="export-modal__cancel" data-export-close>Cancelar</button>
          </div>
        </div>
      </div>

      {/* Modal de salida de recursos */}
      <div id="modalSalida" className="modal-salida" aria-hidden="true">
        <div className="modal-salida__backdrop"></div>
        <div className="modal-salida__content" role="dialog" aria-modal="true" aria-labelledby="modalSalidaTitulo">
          <div className="modal-salida__header">
            <h3 id="modalSalidaTitulo">Registrar salida</h3>
            <button type="button" className="modal-salida__close" data-close-salida aria-label="Cerrar modal">x</button>
          </div>
          <div className="modal-salida__body">
            <p className="modal-salida__label">Recurso seleccionado:</p>
            <p id="salidaNombre" className="modal-salida__value">-</p>
            <p className="modal-salida__label">Stock actual:</p>
            <p id="salidaStock" className="modal-salida__value">0</p>
            <label className="modal-salida__field">
              Cantidad a retirar
              <input type="number" id="salidaCantidad" min="1" step="1" />
            </label>
            <label className="modal-salida__field">
              Comentario (opcional)
              <textarea id="salidaComentario" rows={3} placeholder="Motivo de la salida" />
            </label>
            <p id="salidaError" className="modal-salida__error" role="alert" />
          </div>
          <div className="modal-salida__footer">
            <button type="button" className="modal-salida__cancel" data-close-salida>Cancelar</button>
            <button type="button" className="modal-salida__confirm" id="salidaConfirmar">Confirmar salida</button>
          </div>
        </div>
      </div>
    </>
  );
}



