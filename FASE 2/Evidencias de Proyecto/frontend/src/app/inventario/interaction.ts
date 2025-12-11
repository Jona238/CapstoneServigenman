import {
  DEFAULT_LOW_STOCK_THRESHOLD,
  LOW_STOCK_THRESHOLD_EVENT,
  LOW_STOCK_THRESHOLD_KEY,
  getStoredLowStockThreshold,
  isLowStock,
  sanitizeLowStockThreshold,
} from "@/lib/stockAlerts";

type XLSXNamespace = {
  utils: {
    aoa_to_sheet: (data: unknown[][]) => unknown;
    book_new: () => unknown;
    book_append_sheet: (wb: unknown, ws: unknown, name: string) => void;
  };
  writeFile: (workbook: unknown, filename: string) => void;
};

type WindowWithXLSX = Window & {
  XLSX?: XLSXNamespace;
};

type InventoryItem = {
  id: number;
  recurso: string;
  categoria: string;
  cantidad: number;
  precio: number;
  foto: string;
  info: string;
  distribuidor?: string;
  ubicacion_texto?: string;
  ubicacion_foto?: string;
  ubicacion_fotos?: string[];
  ubicacion_fotos_count?: number;
};

type CleanupFn = () => void;

type FilterOptions = {
  id?: string;
  name?: string;
  category?: string;
  quantity?: string;
  price?: string;
  location?: string;
  resetPage?: boolean;
};

const INVENTORY_KEY = "inventarioData";
const CATS_KEY = "categoriasInventario";
let inventoryCache: InventoryItem[] = [];

// Backend base URL (override at build time with NEXT_PUBLIC_BACKEND_URL)
// In the browser we prefer same-origin calls (Next.js rewrite to backend) to carry cookies properly.
const BACKEND_URL =
  (typeof process !== "undefined" &&
    (process.env.NEXT_PUBLIC_API_URL ??
      process.env.NEXT_PUBLIC_BACKEND_URL)) ||
  "http://localhost:8000";

async function backendFetch(path: string, options?: RequestInit): Promise<Response> {
  const url = `${BACKEND_URL.replace(/\/$/, "")}${path}`;
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

async function apiListItems(): Promise<InventoryItem[] | null> {
  try {
    const res = await backendFetch(`/api/inventory/items/`, { method: "GET" });
    if (!res.ok) return null;
    const data = (await res.json()) as { results?: InventoryItem[] };
    return Array.isArray(data?.results) ? data.results : null;
  } catch {
    return null;
  }
}

async function apiCreateItem(
  payload: Omit<InventoryItem, "id">
): Promise<InventoryItem | null> {
  try {
    const res = await backendFetch(`/api/inventory/items/`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data as any).pending) {
      try { alert("Creación enviada para aprobación del desarrollador."); } catch {}
      return null;
    }
    return data as InventoryItem;
  } catch {
    return null;
  }
}

async function apiUpdateItem(
  id: number,
  payload: Partial<InventoryItem>
): Promise<InventoryItem | null> {
  try {
    const res = await backendFetch(`/api/inventory/items/${id}/`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data && (data as any).pending) {
      try { alert("Edición enviada para aprobación del desarrollador."); } catch {}
      return null;
    }
    return data as InventoryItem;
  } catch {
    return null;
  }
}

async function apiDeleteItem(id: number): Promise<boolean> {
  try {
    const res = await backendFetch(`/api/inventory/items/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) return false;
    try {
      const data = await res.json();
      if (data && (data as any).pending) {
        alert("Eliminación enviada para aprobación del desarrollador.");
      }
    } catch {}
    return true;
  } catch {
    return false;
  }
}

const filasPorPagina = 10;
let paginaActual = 1;
let currentEditingRow: HTMLTableRowElement | null = null;

function showEditToolbar(row: HTMLTableRowElement) {
  currentEditingRow = row;
  let bar = document.getElementById("editToolbar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "editToolbar";
    bar.className = "edit-toolbar";
    bar.innerHTML = `
      <div class="edit-toolbar__inner">
        <span class="edit-toolbar__label">Editando recurso</span>
        <div class="edit-toolbar__actions">
          <button type="button" id="editToolbarSave" class="edit-toolbar__btn primary">Guardar cambios</button>
          <button type="button" id="editToolbarCancel" class="edit-toolbar__btn">Cancelar</button>
        </div>
      </div>`;
    document.body.appendChild(bar);
  }
  const save = document.getElementById("editToolbarSave") as HTMLButtonElement | null;
  const cancel = document.getElementById("editToolbarCancel") as HTMLButtonElement | null;
  if (save) {
    save.onclick = () => {
      const btn = currentEditingRow?.querySelector<HTMLButtonElement>('button[data-action="save"]');
      if (btn) void guardarFila(btn);
    };
  }
  if (cancel) {
    cancel.onclick = () => {
      const btn = currentEditingRow?.querySelector<HTMLButtonElement>('button[data-action="cancel"]');
      if (btn) cancelarEdicion(btn);
    };
  }
  bar.style.display = "block";
}

function hideEditToolbar() {
  const bar = document.getElementById("editToolbar");
  if (bar) bar.style.display = "none";
  currentEditingRow = null;
}

export function initializeInventoryPage(): CleanupFn {
  if (typeof document === "undefined") {
    return () => {};
  }

  const cleanupFns: CleanupFn[] = [];

  // Try backend first; fallback to local storage / DOM
  void bootstrapInventario();
  ordenarTabla();
  filtrarTabla({ resetPage: true });
  paginaActual = 1;
  actualizarPaginacion();
  initCategoriasDesdeTablaYListas();
  aplicarPresetCategoria();
  const initialCategoryEl = document.getElementById("inventoryInitialCategory");
  const initialCategory =
    initialCategoryEl?.getAttribute("data-value")?.trim() ?? "";
  if (initialCategory) {
    const categoriaInput = document.getElementById("filtroCategoria") as HTMLInputElement | null;
    if (categoriaInput) {
      categoriaInput.value = initialCategory;
    }
    filtrarTabla({ resetPage: true });
  }
  void fetchCategorySuggestions().then((names) => {
    if (names.length) {
      syncCategoryDatalists(names);
      saveJSON(CATS_KEY, names);
    }
  });

  const form = document.getElementById("formAgregar");
  if (form) {
    const submitHandler = (event: Event) => {
      void agregarRecurso(event as SubmitEvent);
    };
    form.addEventListener("submit", submitHandler);
    cleanupFns.push(() => form.removeEventListener("submit", submitHandler));
  }

  const filtroInputs: Array<[string, keyof GlobalEventHandlersEventMap]> = [
    ["filtroIdRango", "input"],
    ["filtroRecurso", "input"],
    ["filtroCategoria", "input"],
    ["filtroCantidad", "input"],
    ["filtroPrecio", "input"],
    ["filtroUbicacion", "input"],
    ["ordenarPor", "change"],
  ];

  filtroInputs.forEach(([id, evt]) => {
    const element = document.getElementById(id) as HTMLElement | null;
    if (!element) return;

    if (id === "ordenarPor") {
      const handler: EventListener = () => {
        ordenarTabla();
        actualizarPaginacion();
      };
      element.addEventListener(evt, handler);
      cleanupFns.push(() => element.removeEventListener(evt, handler));
      return;
    }

    if (id === "filtroRecurso") {
      const handler: EventListener = () => {
        actualizarSugerencias();
        filtrarTabla({ resetPage: true });
      };
      element.addEventListener(evt, handler);
      cleanupFns.push(() => element.removeEventListener(evt, handler));
      return;
    }

    const handler: EventListener = () => filtrarTabla({ resetPage: true });
    element.addEventListener(evt, handler);
    cleanupFns.push(() => element.removeEventListener(evt, handler));
  });

  const botonLimpiar = document.querySelector(
    "#filtros .boton-limpiar"
  ) as HTMLButtonElement | null;
  if (botonLimpiar) {
    const handler = () => limpiarFiltros();
    botonLimpiar.addEventListener("click", handler);
    cleanupFns.push(() => botonLimpiar.removeEventListener("click", handler));
  }

  const exportToggle = document.querySelector(
    ".boton-exportar"
  ) as HTMLButtonElement | null;
  if (exportToggle) {
    const handler = () => openExportModal();
    exportToggle.addEventListener("click", handler);
    cleanupFns.push(() => exportToggle.removeEventListener("click", handler));
  }

  const btnPrev = document.getElementById("btnAnterior");
  if (btnPrev) {
    const handler = () => cambiarPagina(-1);
    btnPrev.addEventListener("click", handler);
    cleanupFns.push(() => btnPrev.removeEventListener("click", handler));
  }

  const btnNext = document.getElementById("btnSiguiente");
  if (btnNext) {
    const handler = () => cambiarPagina(1);
    btnNext.addEventListener("click", handler);
    cleanupFns.push(() => btnNext.removeEventListener("click", handler));
  }

  const themeSwitch = document.getElementById("themeSwitch") as
    | HTMLInputElement
    | null;
  if (themeSwitch) {
    const handler = () => updateTheme(themeSwitch.checked);
    themeSwitch.addEventListener("change", handler);
    cleanupFns.push(() => themeSwitch.removeEventListener("change", handler));
    applyStoredTheme();
  }

  const filtroRecurso = document.getElementById("filtroRecurso");
  if (filtroRecurso) {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#sugerenciasRecurso")) {
        const sug = document.getElementById("sugerenciasRecurso");
        if (sug) {
          sug.innerHTML = "";
          sug.className = "autocomplete-box";
        }
      }
    };
    document.addEventListener("click", handler);
    cleanupFns.push(() => document.removeEventListener("click", handler));
  }

  const tabla = document.querySelector<HTMLTableElement>("#tablaRecursos");
  if (tabla) {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const btn = target.closest<HTMLButtonElement>("button[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;
      if (!action) return;
      if (action === "edit") {
        editarFila(btn);
      } else if (action === "delete") {
        eliminarFila(btn);
      } else if (action === "save") {
        void guardarFila(btn);
      } else if (action === "cancel") {
        cancelarEdicion(btn);
      } else if (action === "show-location-photos") {
        const id = Number.parseInt(btn.dataset.itemId ?? "0", 10) || 0;
        const item =
          getInventoryItemById(id) ||
          snapshotInventarioDesdeTabla().find((it) => it.id === id) ||
          null;
        if (item) {
          openLocationPhotosModal({
            ...item,
            ubicacion_fotos:
              item.ubicacion_fotos ?? getLocationPhotosFromCell(btn.closest("td"), btn.closest("tr")),
          });
        }
      }
    };
    tabla.addEventListener("click", handler);
    cleanupFns.push(() => tabla.removeEventListener("click", handler));
  }

  const tbody = document.querySelector<HTMLTableSectionElement>("#tablaRecursos tbody");
  if (tbody) {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest("button")) return;
      const row = target.closest<HTMLTableRowElement>("tr");
      if (!row) return;
      document
        .querySelectorAll<HTMLTableRowElement>("#tablaRecursos tbody tr.selected-row")
        .forEach((r) => r.classList.remove("selected-row"));
      row.classList.add("selected-row");
      const recursoCell = row.cells[1];
      const name = recursoCell?.textContent?.trim() || "Ninguno seleccionado";
      const nameDisplay = document.getElementById("inventorySelectedName");
      if (nameDisplay) nameDisplay.textContent = name || "Ninguno seleccionado";
      const editBtn = document.getElementById("inventoryEditSelected") as HTMLButtonElement | null;
      const deleteBtn = document.getElementById("inventoryDeleteSelected") as HTMLButtonElement | null;
      if (editBtn) editBtn.disabled = false;
      if (deleteBtn) deleteBtn.disabled = false;
    };
    tbody.addEventListener("click", handler);
    cleanupFns.push(() => tbody.removeEventListener("click", handler));
  }

  setupGlobalActions();

  const closeLocationModalBtn = document.querySelector<HTMLButtonElement>(
    "[data-close-location-photos]"
  );
  const locationModal = document.getElementById("locationPhotosModal");
  if (closeLocationModalBtn) {
    const handler = () => closeLocationPhotosModal();
    closeLocationModalBtn.addEventListener("click", handler);
    cleanupFns.push(() => closeLocationModalBtn.removeEventListener("click", handler));
  }
  if (locationModal) {
    const handler = (event: MouseEvent) => {
      if (event.target === locationModal) {
        closeLocationPhotosModal();
      }
    };
    locationModal.addEventListener("click", handler);
    cleanupFns.push(() => locationModal.removeEventListener("click", handler));
  }

  const exportModal = document.getElementById("exportModal");
  const exportCloseButtons = Array.from(
    document.querySelectorAll<HTMLElement>("[data-export-close]")
  );
  exportCloseButtons.forEach((btn) => {
    const handler = () => closeExportModal();
    btn.addEventListener("click", handler);
    cleanupFns.push(() => btn.removeEventListener("click", handler));
  });
  if (exportModal) {
    const handler = (event: MouseEvent) => {
      if (event.target === exportModal) {
        closeExportModal();
      }
    };
    exportModal.addEventListener("click", handler);
    cleanupFns.push(() => exportModal.removeEventListener("click", handler));
  }
  const exportExcelBtn = document.getElementById("exportExcelBtn") as HTMLButtonElement | null;
  if (exportExcelBtn) {
    const handler = () => handleExport("excel");
    exportExcelBtn.addEventListener("click", handler);
    cleanupFns.push(() => exportExcelBtn.removeEventListener("click", handler));
  }
  const exportCsvBtn = document.getElementById("exportCsvBtn") as HTMLButtonElement | null;
  if (exportCsvBtn) {
    const handler = () => handleExport("csv");
    exportCsvBtn.addEventListener("click", handler);
    cleanupFns.push(() => exportCsvBtn.removeEventListener("click", handler));
  }

  // Listen for currency changes
  const storageHandler = (event: StorageEvent) => {
    if (event.key === "ajustes_currency") {
      // Refresh table to update currency formatting
      actualizarPaginacion();
    }
    if (event.key === LOW_STOCK_THRESHOLD_KEY) {
      const sanitized = getStoredLowStockThreshold(DEFAULT_LOW_STOCK_THRESHOLD);
      const table = document.getElementById("tablaRecursos") as HTMLTableElement | null;
      if (table) {
        table.dataset.lowStockThreshold = String(sanitized);
      }
      applyLowStockAlerts();
    }
  };
  window.addEventListener("storage", storageHandler);
  cleanupFns.push(() => window.removeEventListener("storage", storageHandler));

  const thresholdChangeHandler = (event: Event) => {
    const custom = event as CustomEvent<number>;
    const value =
      typeof custom.detail === "number"
        ? sanitizeLowStockThreshold(custom.detail)
        : getStoredLowStockThreshold(DEFAULT_LOW_STOCK_THRESHOLD);
    const table = document.getElementById("tablaRecursos") as HTMLTableElement | null;
    if (table) {
      table.dataset.lowStockThreshold = String(value);
    }
    applyLowStockAlerts();
  };
  window.addEventListener(LOW_STOCK_THRESHOLD_EVENT, thresholdChangeHandler as EventListener);
  cleanupFns.push(() => window.removeEventListener(LOW_STOCK_THRESHOLD_EVENT, thresholdChangeHandler as EventListener));

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}

function getXLSX(): XLSXNamespace | null {
  if (typeof window === "undefined") return null;
  return (window as WindowWithXLSX).XLSX ?? null;
}

function loadJSON<T>(key: string, defVal: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : defVal;
  } catch (error) {
    console.error("Error parsing storage", error);
    return defVal;
  }
}

function saveJSON(key: string, val: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (error) {
    console.error("Error saving storage", error);
  }
}

async function fetchCategorySuggestions(): Promise<string[]> {
  try {
    const res = await backendFetch("/api/inventory/categories/summary/", { method: "GET" });
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ name?: string }>;
    if (!Array.isArray(data)) return [];
    return Array.from(
      new Set(
        data
          .map((item) => (item?.name || "").trim())
          .filter((name) => Boolean(name))
      )
    ).sort((a, b) => a.localeCompare(b, "es"));
  } catch {
    return [];
  }
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function parseLocationPhotos(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((f) => !!f).map((f) => String(f));
    }
  } catch {
    return [];
  }
  return [];
}

function getLocationPhotosFromCell(
  cell?: HTMLTableCellElement | null,
  row?: HTMLTableRowElement | null
): string[] {
  const attr = cell?.getAttribute("data-photos") ?? row?.dataset.locationPhotos ?? "";
  return parseLocationPhotos(attr);
}

function renderLocationPillHtml(itemId: number, count: number): string {
  if (!count) return "-";
  return `<button type="button" class="location-photos-pill" data-action="show-location-photos" data-item-id="${itemId}">📷 ${count}</button>`;
}

function setLocationPhotosCell(
  cell: HTMLTableCellElement | null | undefined,
  itemId: number,
  photos: string[]
) {
  if (!cell) return;
  const clean = (photos || []).filter((f) => !!f).map((f) => String(f));
  cell.setAttribute("data-photos", JSON.stringify(clean));
  cell.innerHTML = renderLocationPillHtml(itemId, clean.length);
  const row = cell.closest("tr");
  if (row) {
    row.dataset.locationPhotos = JSON.stringify(clean);
    row.dataset.locationPhotosCount = String(clean.length);
  }
}

function getInventoryItemById(id: number): InventoryItem | null {
  if (!id) return null;
  const found =
    inventoryCache.find((item) => item.id === id) ??
    loadJSON<InventoryItem[]>(INVENTORY_KEY, []).find((item) => item.id === id);
  return found ?? null;
}

function nextIdFromStorage(): number {
  const arr = loadJSON<InventoryItem[]>(
    INVENTORY_KEY,
    snapshotInventarioDesdeTabla()
  );
  return arr.reduce((max, item) => Math.max(max, item.id || 0), 0) + 1;
}

function setQuantityCell(
  cell: HTMLTableCellElement | null | undefined,
  value: number | string | null | undefined
) {
  if (!cell) return;
  const parsed = Number.parseInt(String(value ?? "0"), 10);
  const quantity = Number.isNaN(parsed) ? 0 : parsed;
  cell.setAttribute("data-quantity", String(quantity));
  cell.innerHTML = "";
  const span = document.createElement("span");
  span.className = "quantity-value";
  span.textContent = String(quantity);
  cell.appendChild(span);
}

function resolveLowStockMeta(table: HTMLTableElement | null) {
  const label =
    table?.dataset.lowStockLabel?.trim() ??
    "Low stock";
  const thresholdAttr = table?.dataset.lowStockThreshold;
  const thresholdParsed = thresholdAttr ? Number.parseInt(thresholdAttr, 10) : Number.NaN;
  const threshold = Number.isNaN(thresholdParsed)
    ? getStoredLowStockThreshold(DEFAULT_LOW_STOCK_THRESHOLD)
    : thresholdParsed;
  return { label, threshold };
}

function applyLowStockAlerts() {
  if (typeof document === "undefined") return;
  const table = document.getElementById("tablaRecursos") as HTMLTableElement | null;
  if (!table) return;
  const { label, threshold } = resolveLowStockMeta(table);
  table.dataset.lowStockThreshold = String(threshold);

  const rows = table.querySelectorAll<HTMLTableRowElement>("tbody tr");
  rows.forEach((row) => {
    const quantityCell = row.cells[3];
    if (!quantityCell) return;
    if (quantityCell.querySelector("input")) return;

    const dataQuantity = quantityCell.getAttribute("data-quantity");
    const parsed = dataQuantity
      ? Number.parseInt(dataQuantity, 10)
      : Number.parseInt(quantityCell.textContent ?? "0", 10);
    const quantity = Number.isNaN(parsed) ? 0 : parsed;

    if (!quantityCell.querySelector(".quantity-value")) {
      setQuantityCell(quantityCell, quantity);
    } else {
      quantityCell.setAttribute("data-quantity", String(quantity));
      const valueSpan = quantityCell.querySelector<HTMLSpanElement>(".quantity-value");
      if (valueSpan) valueSpan.textContent = String(quantity);
    }

    const isLow = isLowStock(quantity, threshold);
    row.classList.toggle("inventory-row--low", isLow);
    quantityCell.classList.toggle("inventory-quantity--low", isLow);
    if (isLow) {
      quantityCell.setAttribute("aria-label", `${quantity} - ${label}`);
    } else {
      quantityCell.removeAttribute("aria-label");
    }

    let badge = quantityCell.querySelector<HTMLSpanElement>(".low-stock-badge");
    if (isLow) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "low-stock-badge";
        badge.setAttribute("role", "status");
        quantityCell.appendChild(badge);
      }
      badge.textContent = label;
    } else if (badge) {
      badge.remove();
    }
  });
}

function openLocationPhotosModal(item: InventoryItem) {
  const overlay = document.getElementById("locationPhotosModal");
  if (!overlay) return;
  const titleEl = overlay.querySelector<HTMLElement>(".location-photos-title");
  const nameEl = overlay.querySelector<HTMLElement>(".location-photos-name");
  const gridEl = overlay.querySelector<HTMLElement>(".location-photos-grid");
  const safeName = (item.recurso || "").replace(/[<>&"]/g, "");
  if (titleEl) titleEl.textContent = "Fotos de ubicacion";
  if (nameEl) nameEl.textContent = safeName;
  if (gridEl) {
    const fotos = (item.ubicacion_fotos || []).filter((f) => !!f);
    if (!fotos.length) {
      gridEl.innerHTML = `<p class="location-photos-empty">No hay fotos de ubicacion</p>`;
    } else {
      gridEl.innerHTML = fotos
        .map(
          (foto, index) =>
            `<div class="location-photo-item"><img src="${foto}" alt="Ubicacion ${index + 1} de ${safeName}" loading="lazy" /></div>`
        )
        .join("");
    }
  }
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function closeLocationPhotosModal() {
  const overlay = document.getElementById("locationPhotosModal");
  if (!overlay) return;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

function openExportModal() {
  const overlay = document.getElementById("exportModal");
  if (!overlay) return;
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

function closeExportModal() {
  const overlay = document.getElementById("exportModal");
  if (!overlay) return;
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
}

function handleExport(type: "excel" | "csv") {
  const scopeInput = document.querySelector<HTMLInputElement>('input[name="exportScope"]:checked');
  const scope: "visible" | "todo" = scopeInput?.value === "todo" ? "todo" : "visible";
  const selectedKeys = Array.from(
    document.querySelectorAll<HTMLInputElement>('input[name="exportColumn"]:checked')
  ).map((cb) => cb.value);

  const { headers, rows } = prepareExportData(scope, selectedKeys);
  if (!rows.length) {
    alert("No hay datos para exportar con los filtros actuales.");
    return;
  }

  if (type === "excel") {
    exportarExcel(headers, rows, scope);
  } else {
    exportarCSV(headers, rows, scope);
  }
  closeExportModal();
}

function setupGlobalActions() {
  const editBtn = document.querySelector<HTMLButtonElement>(
    '[data-global-action="edit-selected"]'
  );
  const deleteBtn = document.querySelector<HTMLButtonElement>(
    '[data-global-action="delete-selected"]'
  );

  function getSelectedRow(): HTMLTableRowElement | null {
    return document.querySelector<HTMLTableRowElement>(
      "#tablaRecursos tbody tr.selected-row"
    );
  }

  editBtn?.addEventListener("click", () => {
    const row = getSelectedRow();
    if (!row) return;
    const innerEdit = row.querySelector<HTMLButtonElement>('[data-action="edit"]');
    innerEdit?.click();
  });

  deleteBtn?.addEventListener("click", () => {
    const row = getSelectedRow();
    if (!row) return;
    const innerDelete = row.querySelector<HTMLButtonElement>('[data-action="delete"]');
    innerDelete?.click();
  });
}

function renderInventarioToDOM(arr: InventoryItem[]) {
  const tbody = document.querySelector<HTMLTableSectionElement>(
    "#tablaRecursos tbody"
  );
  if (!tbody) return;
  tbody.innerHTML = "";
  inventoryCache = Array.isArray(arr) ? [...arr] : [];

  arr.forEach((item) => {
    const fotos = Array.isArray(item.ubicacion_fotos)
      ? item.ubicacion_fotos.filter((f) => !!f)
      : [];
    const fotosCount =
      typeof item.ubicacion_fotos_count === "number" && item.ubicacion_fotos_count > 0
        ? item.ubicacion_fotos_count
        : fotos.length;
    const ubicacionPill = fotosCount
      ? `<button type="button" class="location-photos-pill" data-action="show-location-photos" data-item-id="${item.id}">📷 ${fotosCount}</button>`
      : "—";
    const tr = document.createElement("tr");
    tr.dataset.match = "1";
    tr.dataset.locationPhotos = JSON.stringify(fotos);
    tr.dataset.locationPhotosCount = String(fotosCount || 0);
    tr.dataset.recurso = item.recurso || "";
    tr.classList.remove("editing-row");
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.recurso}</td>
      <td>${item.categoria}</td>
      <td data-quantity="${item.cantidad ?? 0}">${item.cantidad ?? 0}</td>
      <td data-precio="${item.precio ?? 0}">${formatCurrency(item.precio ?? 0)}</td>
      <td data-foto="${item.foto ? "1" : ""}">
        ${item.foto ? `<img class=\"thumb\" src=\"${item.foto}\" alt=\"\" />` : ""}
      </td>
      <td>${item.distribuidor ? item.distribuidor : "—"}</td>
      <td>${item.ubicacion_texto ? item.ubicacion_texto : "—"}</td>
      <td data-photos='${JSON.stringify(fotos)}'>${ubicacionPill}</td>
      <td>${item.info ? item.info : "—"}</td>
      <td class="acciones-cell">
        <div class="tabla-acciones">
          <button type="button" class="boton-editar" data-action="edit">Editar</button>
          <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>
        </div>
      </td>`;
    setQuantityCell(tr.cells[3] ?? null, item.cantidad ?? 0);
    tbody.appendChild(tr);
  });
  applyLowStockAlerts();
  toggleEmptyState(arr.length === 0);
}

function snapshotInventarioDesdeTabla(): InventoryItem[] {
  const rows = Array.from(
    document.querySelectorAll<HTMLTableRowElement>("#tablaRecursos tbody tr")
  );
  return rows.map((tr) => {
    const tds = tr.querySelectorAll<HTMLTableCellElement>("td");
    const img = tds[5]?.querySelector<HTMLImageElement>("img");
    const quantityAttr = tds[3]?.getAttribute("data-quantity");
    const parsedQuantity = quantityAttr
      ? Number.parseInt(quantityAttr, 10)
      : Number.parseInt(tds[3]?.innerText || "0", 10);
    let ubicacionFotos: string[] = [];
    const fotosAttr = tds[8]?.getAttribute("data-photos") || tr.dataset.locationPhotos;
    if (fotosAttr) {
      try {
        const parsed = JSON.parse(fotosAttr);
        if (Array.isArray(parsed)) {
          ubicacionFotos = parsed.filter((f) => !!f).map((f) => String(f));
        }
      } catch {
        ubicacionFotos = [];
      }
    }
    const fotosCountAttr = tds[8]?.querySelector("button")?.textContent?.replace(/\D+/g, "") ?? "";
    const countFromText = Number.parseInt(fotosCountAttr || "", 10);
    const ubicacionFotosCount = Number.isNaN(countFromText) ? ubicacionFotos.length : countFromText;
    return {
      id: Number.parseInt(tds[0]?.innerText ?? "0", 10),
      recurso: tds[1]?.innerText.trim() ?? "",
      categoria: tds[2]?.innerText.trim() ?? "",
      cantidad: Number.isNaN(parsedQuantity) ? 0 : parsedQuantity || 0,
      precio: Number.parseFloat(tds[4]?.getAttribute("data-precio") || "0") || 0,
      distribuidor: (tds[6]?.innerText.trim() || "—") === "—" ? "" : tds[6]?.innerText.trim(),
      ubicacion_texto: (tds[7]?.innerText.trim() || "—") === "—" ? "" : tds[7]?.innerText.trim(),
      ubicacion_fotos: ubicacionFotos,
      ubicacion_fotos_count: ubicacionFotosCount,
      foto: img?.src ?? "",
      info: tds[9]?.innerText.trim() ?? "",
    };
  });
}

function persistInventario() {
  const items = snapshotInventarioDesdeTabla();
  inventoryCache = items;
  saveJSON(INVENTORY_KEY, items);
}

async function bootstrapInventario() {
  const fromApi = await apiListItems();
  let data: InventoryItem[] | null = null;

  if (Array.isArray(fromApi)) {
    data = fromApi;
    saveJSON(INVENTORY_KEY, data);
  } else {
    data = loadJSON<InventoryItem[] | null>(INVENTORY_KEY, null);
    if (!Array.isArray(data) || !data.length) {
      data = snapshotInventarioDesdeTabla();
      saveJSON(INVENTORY_KEY, data);
    }
  }

  renderInventarioToDOM(data);

  const cats = loadJSON<string[] | null>(CATS_KEY, null);
  if (!Array.isArray(cats) || !cats.length) {
    const set = new Set(
      (data ?? [])
        .map((item) => item?.categoria)
        .filter((value): value is string => Boolean(value))
    );
    saveJSON(CATS_KEY, Array.from(set).sort((a, b) => a.localeCompare(b, "es")));
  }
}

function filtrarTabla({ resetPage = true }: FilterOptions = {}) {
  const filters: FilterOptions = {
    id: (document.getElementById("filtroIdRango") as HTMLInputElement | null)?.value.trim() ?? "",
    name: (document.getElementById("filtroRecurso") as HTMLInputElement | null)?.value || "",
    category: (document.getElementById("filtroCategoria") as HTMLInputElement | null)?.value || "",
    quantity: (document.getElementById("filtroCantidad") as HTMLInputElement | null)?.value || "",
    price: (document.getElementById("filtroPrecio") as HTMLInputElement | null)?.value || "",
    location: (document.getElementById("filtroUbicacion") as HTMLInputElement | null)?.value || "",
  };

  let idExacto: number | null = null;
  let idDesde: number | null = null;
  let idHasta: number | null = null;

  if (filters.id.includes("-")) {
    const partes = filters.id.split("-");
    if (partes[0] !== "" && !Number.isNaN(Number(partes[0]))) {
      idDesde = Number.parseInt(partes[0], 10);
    }
    if (partes[1] !== "" && !Number.isNaN(Number(partes[1]))) {
      idHasta = Number.parseInt(partes[1], 10);
    }
  } else if (!Number.isNaN(Number(filters.id)) && filters.id !== "") {
    idExacto = Number.parseInt(filters.id, 10);
  }

  const inputRecurso = filters.name.toLowerCase();
  const inputCategoria = filters.category.toLowerCase();
  const inputCantidad = filters.quantity.trim();
  const inputPrecio = filters.price.trim();
  const inputUbicacion = filters.location.toLowerCase();

  const filas = document.querySelectorAll<HTMLTableRowElement>(
    "#tablaRecursos tbody tr"
  );

  filas.forEach((fila) => {
    const celdaId = Number.parseInt(fila.cells[0]?.innerText ?? "0", 10);
    const celdaRecurso = fila.cells[1]?.innerText.toLowerCase() ?? "";
    const celdaCategoria = fila.cells[2]?.innerText.toLowerCase() ?? "";
    const celdaCantidad = fila.cells[3]?.innerText ?? "";
    const celdaPrecio = fila.cells[4]?.innerText ?? "";
    const celdaUbicacion = fila.cells[7]?.innerText.toLowerCase() ?? "";

    const coincideId =
      (idExacto === null || celdaId === idExacto) &&
      (idDesde === null || celdaId >= idDesde) &&
      (idHasta === null || celdaId <= idHasta);

    const matchesName = !inputRecurso || celdaRecurso.includes(inputRecurso);
    const matchesCategory = !inputCategoria || celdaCategoria.includes(inputCategoria);
    const matchesQuantity = !inputCantidad || celdaCantidad.includes(inputCantidad);
    const matchesPrice = !inputPrecio || celdaPrecio.includes(inputPrecio);
    const matchesLocation = !inputUbicacion || celdaUbicacion.includes(inputUbicacion);

    const mostrar =
      coincideId &&
      matchesName &&
      matchesCategory &&
      matchesQuantity &&
      matchesPrice &&
      matchesLocation;

    fila.dataset.match = mostrar ? "1" : "0";
    fila.style.display = mostrar ? "" : "none";
  });

  if (resetPage) paginaActual = 1;
  actualizarPaginacion();
  persistInventario();
  const visibles = document.querySelectorAll(
    "#tablaRecursos tbody tr[data-match='1']"
  ).length;
  toggleEmptyState(visibles === 0);
}

function ordenarTabla() {
  const sel = document.getElementById("ordenarPor") as HTMLSelectElement | null;
  if (!sel) return;

  const criterio = sel.value;
  const tbody = document.querySelector<HTMLTableSectionElement>(
    "#tablaRecursos tbody"
  );
  if (!tbody) return;

  const filas = Array.from(tbody.querySelectorAll("tr"));

  let columnaIndex = 0;
  let ascendente = true;

  switch (criterio) {
    case "id-asc":
      columnaIndex = 0;
      ascendente = true;
      break;
    case "id-desc":
      columnaIndex = 0;
      ascendente = false;
      break;
    case "recurso-asc":
      columnaIndex = 1;
      ascendente = true;
      break;
    case "recurso-desc":
      columnaIndex = 1;
      ascendente = false;
      break;
    case "categoria-asc":
      columnaIndex = 2;
      ascendente = true;
      break;
    case "categoria-desc":
      columnaIndex = 2;
      ascendente = false;
      break;
    case "cantidad-asc":
      columnaIndex = 3;
      ascendente = true;
      break;
    case "cantidad-desc":
      columnaIndex = 3;
      ascendente = false;
      break;
    case "precio-asc":
      columnaIndex = 4;
      ascendente = true;
      break;
    case "precio-desc":
      columnaIndex = 4;
      ascendente = false;
      break;
    default:
      return;
  }

  filas.sort((a, b) => {
    const valorA = a.cells[columnaIndex]?.innerText.trim().toLowerCase() ?? "";
    const valorB = b.cells[columnaIndex]?.innerText.trim().toLowerCase() ?? "";

    if ([0, 3, 4].includes(columnaIndex)) {
      const numA = Number.parseFloat(valorA.replace(",", ".")) || 0;
      const numB = Number.parseFloat(valorB.replace(",", ".")) || 0;
      return ascendente ? numA - numB : numB - numA;
    }

    if (valorA < valorB) return ascendente ? -1 : 1;
    if (valorA > valorB) return ascendente ? 1 : -1;
    return 0;
  });

  filas.forEach((fila) => tbody.appendChild(fila));
  persistInventario();
}

function limpiarFiltros() {
  const ids = [
    "filtroIdRango",
    "filtroRecurso",
    "filtroCategoria",
    "filtroCantidad",
    "filtroPrecio",
    "filtroUbicacion",
  ];
  ids.forEach((id) => {
    const element = document.getElementById(id) as HTMLInputElement | null;
    if (element) element.value = "";
  });
  const sugerencias = document.getElementById("sugerenciasRecurso");
  if (sugerencias) sugerencias.innerHTML = "";
  filtrarTabla();
}

function actualizarSugerencias() {
  const recursoInput = document.getElementById("filtroRecurso") as
    | HTMLInputElement
    | null;
  const sugerenciasDiv = document.getElementById("sugerenciasRecurso");
  if (!recursoInput || !sugerenciasDiv) return;

  const texto = recursoInput.value.toLowerCase();
  sugerenciasDiv.innerHTML = "";

  if (texto.length < 2) {
    sugerenciasDiv.className = "autocomplete-box";
    return;
  }

  sugerenciasDiv.className = "autocomplete-box show";

  const arr = loadJSON<InventoryItem[]>(
    INVENTORY_KEY,
    snapshotInventarioDesdeTabla()
  );
  const recursosUnicos = Array.from(
    new Set(arr.map((item) => item.recurso))
  ).sort((a, b) => a.localeCompare(b, "es"));

  const sugerencias = recursosUnicos
    .filter((recurso) => recurso.toLowerCase().includes(texto))
    .slice(0, 12);

  sugerencias.forEach((opcion) => {
    const div = document.createElement("div");
    div.className = "sugerencia-item";
    const regex = new RegExp(`(${texto})`, "gi");
    div.innerHTML = opcion.replace(regex, "<strong>$1</strong>");
    div.addEventListener("click", () => {
      recursoInput.value = opcion;
      sugerenciasDiv.innerHTML = "";
      sugerenciasDiv.className = "autocomplete-box";
      filtrarTabla({ resetPage: true });
    });
    sugerenciasDiv.appendChild(div);
  });
}

function editarFila(button: HTMLButtonElement) {
  const fila = button.closest("tr");
  if (!fila) return;
  const celdas = fila.querySelectorAll<HTMLTableCellElement>("td");
  const itemId = Number.parseInt(celdas[0]?.innerText ?? "0", 10) || 0;

  const original = {
    recurso: celdas[1]?.innerText ?? "",
    categoria: celdas[2]?.innerText ?? "",
    cantidad: celdas[3]?.getAttribute("data-quantity") ?? celdas[3]?.innerText ?? "0",
    // Keep legacy 'precio' while also storing text/raw for confirmation step
    precio: celdas[4]?.getAttribute("data-precio") ?? celdas[4]?.innerText ?? "0",
    precioText: celdas[4]?.innerText ?? "0",
    precioRaw: celdas[4]?.getAttribute("data-precio") ?? celdas[4]?.innerText ?? "0",
    imgSrc: celdas[5]?.querySelector("img")?.src ?? "",
    distribuidor: celdas[6]?.innerText ?? "",
    ubicacion_texto: celdas[7]?.innerText ?? "",
    ubicacion_fotos: getLocationPhotosFromCell(celdas[8], fila),
    info: celdas[9]?.innerText ?? "",
  };

  fila.dataset.original = JSON.stringify(original);

  celdas[1].innerHTML = `<input type="text" value="${original.recurso}" class="editar-input edit-input" />`;
  celdas[2].innerHTML = `<input type="text" value="${original.categoria}" class="editar-input edit-input" />`;
  celdas[3].innerHTML = `<input type="number" value="${original.cantidad}" min="0" step="1" class="editar-input edit-input" />`;
  celdas[4].innerHTML = `<input type="number" value="${Number.parseFloat(original.precioRaw) || 0}" min="0" step="0.01" class="editar-input edit-input precio" title="Precio unitario del producto" />`;
  celdas[5].innerHTML = `
    <div>
      ${
        original.imgSrc
          ? `<img class="thumb" src="${original.imgSrc}" alt="" />`
          : '<img class="thumb" src="" alt="" />'
      }
      <input type="file" class="editar-foto" accept="image/*" style="display:block; margin-top:6px;" />
    </div>`;
  celdas[6].innerHTML = `<input type="text" value="${original.distribuidor ?? ""}" class="editar-input edit-input" title="Proveedor o comercio donde se compro" />`;
  celdas[7].innerHTML = `<input type="text" value="${original.ubicacion_texto ?? ""}" class="editar-input edit-input" title="Lugar exacto en bodega" />`;
  celdas[8].innerHTML = `
    <div class="location-edit-cell">
      ${renderLocationPillHtml(itemId, original.ubicacion_fotos.length)}
      <input type="file" class="ubicacion-fotos-input" accept="image/*" multiple />
    </div>`;
  celdas[8].setAttribute("data-photos", JSON.stringify(original.ubicacion_fotos));
  celdas[9].innerHTML = `<input type="text" value="${original.info}" class="editar-input info" />`;
  celdas[10].innerHTML = "";
  const saveBtn = document.createElement("button");
  saveBtn.className = "boton-guardar";
  saveBtn.textContent = "Guardar";
  saveBtn.dataset.action = "save";
  const cancelBtn = document.createElement("button");
  cancelBtn.className = "boton-cancelar";
  cancelBtn.textContent = "Cancelar";
  cancelBtn.dataset.action = "cancel";
  const actionsWrapper = document.createElement("div");
  actionsWrapper.className = "tabla-acciones";
  actionsWrapper.appendChild(saveBtn);
  actionsWrapper.appendChild(cancelBtn);
  celdas[10].classList.add("acciones-cell");
  celdas[10].appendChild(actionsWrapper);
  fila.classList.add("editing-row");
  showEditToolbar(fila);
}

async function guardarFila(button: HTMLButtonElement) {
  const fila = button.closest("tr");
  if (!fila) return;
  const celdas = fila.querySelectorAll<HTMLTableCellElement>("td");
  const itemId = Number.parseInt(celdas[0]?.innerText ?? "0", 10) || 0;

  const nuevoRecurso = celdas[1]?.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";
  const nuevaCategoria =
    celdas[2]?.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";
  const nuevaCantidad = Number.parseInt(
    celdas[3]?.querySelector<HTMLInputElement>("input")?.value || "0",
    10
  );
  const nuevoPrecio = Number.parseFloat(
    celdas[4]?.querySelector<HTMLInputElement>("input")?.value || "0"
  );
  const fileInput = celdas[5]?.querySelector<HTMLInputElement>("input[type='file']");
  const imgElement = celdas[5]?.querySelector<HTMLImageElement>("img");
  const nuevoDistribuidor =
    celdas[6]?.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";
  const nuevaUbicacionTexto =
    celdas[7]?.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";
  const ubicacionFilesInput =
    celdas[8]?.querySelector<HTMLInputElement>("input[type='file']") ?? null;
  const nuevaInfo = celdas[9]?.querySelector<HTMLInputElement>("input")?.value.trim() ?? "";

  let fotoDataURL = imgElement?.src ?? "";
  if (fileInput && fileInput.files && fileInput.files[0]) {
    fotoDataURL = await readFileAsDataURL(fileInput.files[0]);
  }

  const existingLocationPhotos = getLocationPhotosFromCell(celdas[8], fila);
  const nuevasFotosUbicacion: string[] = [];
  if (ubicacionFilesInput && ubicacionFilesInput.files && ubicacionFilesInput.files.length > 0) {
    for (const f of Array.from(ubicacionFilesInput.files)) {
      nuevasFotosUbicacion.push(await readFileAsDataURL(f));
    }
  }
  const ubicacionFotosActualizadas = [...existingLocationPhotos, ...nuevasFotosUbicacion];
  const ubicacionFotosCount = ubicacionFotosActualizadas.length;

  // Confirmacion de cambios antes de aplicar
  const safeCantidadTry = Number.isNaN(nuevaCantidad) ? 0 : nuevaCantidad;
  const safePrecioTry = Number.isNaN(nuevoPrecio) ? 0 : nuevoPrecio;

  const originalRaw = fila.dataset.original || "";
  try {
    if (originalRaw) {
      const original = JSON.parse(originalRaw) as {
        recurso: string;
        categoria: string;
        cantidad: string;
        precioText: string;
        precioRaw: string;
        imgSrc: string;
        info: string;
        distribuidor?: string;
        ubicacion_texto?: string;
        ubicacion_fotos?: string[];
      };

      const cambios: string[] = [];
      if ((original.recurso || "") !== (nuevoRecurso || "")) {
        cambios.push(`Recurso: "${original.recurso || ""}" -> "${nuevoRecurso || ""}"`);
      }
      if ((original.categoria || "") !== (nuevaCategoria || "")) {
        cambios.push(`Categoria: "${original.categoria || ""}" -> "${nuevaCategoria || ""}"`);
      }
      if ((original.cantidad || "0") !== String(safeCantidadTry)) {
        cambios.push(`Cantidad: ${original.cantidad || "0"} -> ${safeCantidadTry}`);
      }
      if ((Number.parseFloat(original.precioRaw) || 0) !== safePrecioTry) {
        cambios.push(
          `Precio: ${formatCurrency(Number.parseFloat(original.precioRaw) || 0)} -> ${formatCurrency(safePrecioTry)}`
        );
      }
      if ((original.info || "") !== (nuevaInfo || "")) {
        cambios.push(`Info: "${original.info || ""}" -> "${nuevaInfo || ""}"`);
      }
      const fotoCambio = (original.imgSrc || "") !== (fotoDataURL || "");
      if (fotoCambio) {
        cambios.push("Foto: (cambiada)");
      }
      if ((original.distribuidor || "") !== (nuevoDistribuidor || "")) {
        cambios.push(`Distribuidor: "${original.distribuidor || ""}" -> "${nuevoDistribuidor || ""}"`);
      }
      if ((original.ubicacion_texto || "") !== (nuevaUbicacionTexto || "")) {
        cambios.push(`Ubicacion: "${original.ubicacion_texto || ""}" -> "${nuevaUbicacionTexto || ""}"`);
      }
      const originalFotosCount = Array.isArray(original.ubicacion_fotos)
        ? original.ubicacion_fotos.filter((f) => !!f).length
        : 0;
      if (ubicacionFotosCount !== originalFotosCount) {
        cambios.push(`Ubicacion fotos: ${originalFotosCount} -> ${ubicacionFotosCount}`);
      }

      if (cambios.length === 0) {
        // No hay cambios; salir del modo edicion sin tocar backend
        celdas[10].innerHTML = `
      <div class="tabla-acciones">
        <button type="button" class="boton-editar" data-action="edit">Editar</button>
        <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>
      </div>`;
        fila.dataset.original = "";
        filtrarTabla({ resetPage: false });
        ordenarTabla();
        actualizarPaginacion();
        hideEditToolbar();
        return;
      }

      const idText = celdas[0]?.innerText ?? "0";
      const ok = window.confirm(`Confirmar modificacion del recurso #${idText}\n\n` + cambios.join("\n"));
      if (!ok) {
        // Permanecer en modo edicion si cancela
        return;
      }
    }
  } catch {
    const ok = window.confirm("Confirmar modificacion de este recurso?");
    if (!ok) return;
  }

  const safeCantidad = safeCantidadTry;
  const safePrecio = safePrecioTry;

  celdas[1].innerText = nuevoRecurso;
  celdas[2].innerText = nuevaCategoria;
  setQuantityCell(celdas[3], safeCantidad);
  celdas[4].setAttribute("data-precio", String(safePrecio));
  celdas[4].innerText = formatCurrency(safePrecio);
  if (fotoDataURL) {
    celdas[5].innerHTML = `<img class="thumb" src="${fotoDataURL}" alt="" />`;
    celdas[5].setAttribute("data-foto", "1");
  } else {
    celdas[5].innerHTML = "";
    celdas[5].setAttribute("data-foto", "");
  }
  celdas[6].innerText = nuevoDistribuidor || "-";
  celdas[7].innerText = nuevaUbicacionTexto || "-";
  setLocationPhotosCell(celdas[8], itemId, ubicacionFotosActualizadas);
  celdas[9].innerText = nuevaInfo;
  celdas[10].innerHTML = `
      <div class="tabla-acciones">
        <button type="button" class="boton-editar" data-action="edit">Editar</button>
        <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>
      </div>`;
  fila.classList.remove("editing-row");

  // Best-effort sync with backend
  void apiUpdateItem(itemId, {
    id: itemId,
    recurso: nuevoRecurso,
    categoria: nuevaCategoria,
    cantidad: safeCantidad,
    precio: safePrecio,
    foto: fotoDataURL,
    info: nuevaInfo,
    distribuidor: nuevoDistribuidor || undefined,
    ubicacion_texto: nuevaUbicacionTexto || undefined,
    ubicacion_fotos: ubicacionFotosActualizadas,
  });

  fila.dataset.original = "";
  fila.dataset.locationPhotos = JSON.stringify(ubicacionFotosActualizadas);
  fila.dataset.locationPhotosCount = String(ubicacionFotosCount);
  persistInventario();
  const arr = loadJSON<InventoryItem[]>(INVENTORY_KEY, snapshotInventarioDesdeTabla());
  const idx = arr.findIndex((it) => it.id === itemId);
  const updatedItem: InventoryItem = {
    id: itemId,
    recurso: nuevoRecurso,
    categoria: nuevaCategoria,
    cantidad: safeCantidad,
    precio: safePrecio,
    foto: fotoDataURL,
    info: nuevaInfo,
    distribuidor: nuevoDistribuidor || undefined,
    ubicacion_texto: nuevaUbicacionTexto || undefined,
    ubicacion_fotos: ubicacionFotosActualizadas,
    ubicacion_fotos_count: ubicacionFotosCount,
  };
  if (idx >= 0) {
    arr[idx] = updatedItem;
  } else {
    arr.push(updatedItem);
  }
  inventoryCache = arr;
  saveJSON(INVENTORY_KEY, arr);
  renderInventarioToDOM(arr);
  filtrarTabla({ resetPage: false });
  ordenarTabla();
  actualizarPaginacion();
  hideEditToolbar();
}

function cancelarEdicion(button: HTMLButtonElement) {
  const fila = button.closest("tr");
  if (!fila) return;
  const originalRaw = fila.dataset.original;
  if (!originalRaw) return;

  const original = JSON.parse(originalRaw) as {
    recurso: string;
    categoria: string;
    cantidad: string;
    precioText: string;
    precioRaw: string;
    imgSrc: string;
    info: string;
    distribuidor?: string;
    ubicacion_texto?: string;
    ubicacion_fotos?: string[];
  };

  const celdas = fila.querySelectorAll<HTMLTableCellElement>("td");
  const itemId = Number.parseInt(celdas[0]?.innerText ?? "0", 10) || 0;
  celdas[1].innerText = original.recurso;
  celdas[2].innerText = original.categoria;
  const cantidadOriginal = Number.parseInt(original.cantidad ?? "0", 10);
  const safeCantidad = Number.isNaN(cantidadOriginal) ? 0 : cantidadOriginal;
  setQuantityCell(celdas[3], safeCantidad);
  const precioOriginal = Number.parseFloat(original.precio ?? "0");
  const safePrecio = Number.isNaN(precioOriginal) ? 0 : precioOriginal;
  celdas[4].setAttribute("data-precio", String(safePrecio));
  celdas[4].innerText = formatCurrency(safePrecio);
  if (original.imgSrc) {
    celdas[5].innerHTML = `<img class="thumb" src="${original.imgSrc}" alt="" />`;
    celdas[5].setAttribute("data-foto", "1");
  } else {
    celdas[5].innerHTML = "";
    celdas[5].setAttribute("data-foto", "");
  }
  celdas[6].innerText = original.distribuidor || "-";
  celdas[7].innerText = original.ubicacion_texto || "-";
  setLocationPhotosCell(celdas[8], itemId, original.ubicacion_fotos || []);
  celdas[9].innerText = original.info;
  celdas[10].innerHTML = `
    <div class="tabla-acciones">
      <button type="button" class="boton-editar" data-action="edit">Editar</button>
      <button type="button" class="boton-eliminar" data-action="delete">Eliminar</button>
    </div>`;
  fila.dataset.original = "";
  fila.dataset.locationPhotos = JSON.stringify(original.ubicacion_fotos || []);
  fila.dataset.locationPhotosCount = String((original.ubicacion_fotos || []).filter((f) => !!f).length);
  fila.classList.remove("editing-row");
  filtrarTabla();
  ordenarTabla();
  actualizarPaginacion();
  hideEditToolbar();
}

function eliminarFila(button: HTMLButtonElement) {
  if (!window.confirm("¿Estás seguro de que deseas eliminar este recurso?")) {
    return;
  }

  const fila = button.closest("tr");
  const idText = fila?.cells?.[0]?.innerText ?? "0";
  const id = Number.parseInt(idText, 10) || 0;
  if (id) {
    void apiDeleteItem(id);
  }
  fila?.remove();
  persistInventario();
  const arr = loadJSON<InventoryItem[]>(
    INVENTORY_KEY,
    snapshotInventarioDesdeTabla()
  );
  renderInventarioToDOM(arr);
  filtrarTabla({ resetPage: false });
  ordenarTabla();
  actualizarPaginacion();
}

async function agregarRecurso(event: SubmitEvent) {
  event.preventDefault();

  const recurso =
    (document.getElementById("nuevoRecurso") as HTMLInputElement | null)?.value.trim() ??
    "";
  const categoria =
    (document.getElementById("nuevaCategoria") as HTMLInputElement | null)?.value.trim() ??
    "";
  const cantidad = Number.parseInt(
    (document.getElementById("nuevaCantidad") as HTMLInputElement | null)?.value ||
      "0",
    10
  );
  const precio = Number.parseFloat(
    (document.getElementById("nuevoPrecio") as HTMLInputElement | null)?.value || "0"
  );
  const file = (document.getElementById("nuevaFoto") as HTMLInputElement | null)
    ?.files?.[0] ?? null;
  const info =
    (document.getElementById("nuevaInfo") as HTMLInputElement | null)?.value.trim() ?? "";

  if (!recurso || !categoria) return;

  const arr = loadJSON<InventoryItem[]>(
    INVENTORY_KEY,
    snapshotInventarioDesdeTabla()
  );
  let fotoDataURL = "";
  if (file) {
    fotoDataURL = await readFileAsDataURL(file);
  }

  const payload = {
    recurso,
    categoria,
    cantidad: Number.isNaN(cantidad) ? 0 : cantidad,
    precio: Number.isNaN(precio) ? 0 : precio,
    foto: fotoDataURL,
    info,
  } as Omit<InventoryItem, "id">;

  const created = await apiCreateItem(payload);
  const nuevo: InventoryItem = created ?? { id: nextIdFromStorage(), ...payload };

  arr.push(nuevo);
  saveJSON(INVENTORY_KEY, arr);
  renderInventarioToDOM(arr);
  syncDatalistsCategoria(categoria);

  const form = document.getElementById("formAgregar") as HTMLFormElement | null;
  form?.reset();

  const paginaPrev = paginaActual;
  filtrarTabla({ resetPage: false });
  ordenarTabla();
  persistInventario();

  const totalFiltradas = document.querySelectorAll(
    "#tablaRecursos tbody tr[data-match='1']"
  ).length;
  const totalPaginas = Math.max(1, Math.ceil(totalFiltradas / filasPorPagina));
  paginaActual = Math.min(paginaPrev, totalPaginas);
  actualizarPaginacion();
}

function syncDatalistsCategoria(catNueva: string) {
  if (!catNueva) return;
  const dlForm = document.getElementById("categoriasFormulario") as
    | HTMLDataListElement
    | null;
  const dlFilt = document.getElementById("categorias") as
    | HTMLDataListElement
    | null;

  const normalized = catNueva.toLowerCase();

  if (
    dlForm &&
    !Array.from(dlForm.options).some(
      (option) => option.value.toLowerCase() === normalized
    )
  ) {
    const opt = document.createElement("option");
    opt.value = catNueva;
    dlForm.appendChild(opt);
  }

  if (
    dlFilt &&
    !Array.from(dlFilt.options).some(
      (option) => option.value.toLowerCase() === normalized
    )
  ) {
    const opt = document.createElement("option");
    opt.value = catNueva;
    dlFilt.appendChild(opt);
  }

  const cats = loadJSON<string[]>(CATS_KEY, []);
  if (!cats.some((cat) => cat.toLowerCase() === normalized)) {
    cats.push(catNueva);
    saveJSON(CATS_KEY, cats);
  }
}

function toggleExportMenu() {
  const menu = document.getElementById("exportMenu");
  if (!menu) return;
  menu.classList.toggle("show");
  if (!menu.classList.contains("show")) {
    document
      .querySelectorAll<HTMLElement>(".submenu-content")
      .forEach((submenu) => submenu.classList.remove("show"));
  }
}

function toggleSubmenu(id: string) {
  document.querySelectorAll<HTMLElement>(".submenu-content").forEach((submenu) => {
    if (submenu.id !== id) submenu.classList.remove("show");
  });
  const sub = document.getElementById(id);
  sub?.classList.toggle("show");
}

function closeAllMenus() {
  document.getElementById("exportMenu")?.classList.remove("show");
  document
    .querySelectorAll<HTMLElement>(".submenu-content")
    .forEach((submenu) => submenu.classList.remove("show"));
}

const EXPORT_COLUMN_KEYS = [
  "id",
  "recurso",
  "categoria",
  "cantidad",
  "precio",
  "foto",
  "distribuidor",
  "ubicacion",
  "ubicacion_fotos",
  "info",
];

function prepareExportData(
  scope: "visible" | "todo",
  selectedKeys?: string[]
) {
  const filas = scope === "visible" ? filasPaginaActual() : filasFiltradas();
  const headers = encabezadosTabla();
  const datos = datosDesdeFilas(filas);

  const keys = selectedKeys && selectedKeys.length ? selectedKeys : EXPORT_COLUMN_KEYS;
  const indexes = keys
    .map((key) => EXPORT_COLUMN_KEYS.indexOf(key))
    .filter((idx) => idx >= 0);
  const effectiveIndexes =
    indexes.length > 0 ? indexes : EXPORT_COLUMN_KEYS.map((_, i) => i);

  const filteredHeaders = effectiveIndexes.map((i) => headers[i]);
  const filteredRows = datos.map((row) => effectiveIndexes.map((i) => row[i] ?? ""));
  return { headers: filteredHeaders, rows: filteredRows };
}

function exportarCSV(
  headers: string[],
  datos: (string | number | boolean)[][],
  scope: "visible" | "todo"
) {
  const lineas: string[] = [];
  lineas.push(headers.join(","));
  datos.forEach((arr) => {
    const linea = arr.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",");
    lineas.push(linea);
  });

  const blob = new Blob([lineas.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = scope === "visible" ? "inventario_visible.csv" : "inventario_todo.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportarExcel(
  headers: string[],
  datos: (string | number | boolean)[][],
  scope: "visible" | "todo"
) {
  const filas = [headers, ...datos];
  const xlsx = getXLSX();
  if (!xlsx) {
    console.warn("Biblioteca XLSX no disponible");
    return;
  }
  const ws = xlsx.utils.aoa_to_sheet(filas as unknown[][]);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Inventario");
  xlsx.writeFile(
    wb,
    scope === "visible" ? "inventario_visible.xlsx" : "inventario_todo.xlsx"
  );
}

function filasFiltradas(): HTMLTableRowElement[] {
  const tbody = document.querySelector<HTMLTableSectionElement>(
    "#tablaRecursos tbody"
  );
  if (!tbody) return [];
  return Array.from(tbody.querySelectorAll("tr")).filter(
    (tr) => tr.dataset.match === "1"
  );
}

function filasPaginaActual(): HTMLTableRowElement[] {
  const todas = filasFiltradas();
  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  return todas.slice(inicio, fin);
}

function datosDesdeFilas(filas: HTMLTableRowElement[]) {
  return filas.map((tr) => {
    const tds = tr.querySelectorAll<HTMLTableCellElement>("td");
    const tieneFoto = Boolean(tds[5]?.querySelector("img")?.src);
    const fotosCountText = tds[8]?.querySelector("button")?.textContent?.replace(/\D+/g, "") ?? "";
    const fotosCount = Number.parseInt(fotosCountText || "0", 10) || 0;
    return [
      tds[0]?.innerText ?? "",
      tds[1]?.innerText ?? "",
      tds[2]?.innerText ?? "",
      tds[3]?.innerText ?? "",
      tds[4]?.innerText ?? "",
      tieneFoto ? "si" : "no",
      tds[6]?.innerText ?? "",
      tds[7]?.innerText ?? "",
      String(fotosCount),
      tds[9]?.innerText ?? "",
    ];
  });
}

function encabezadosTabla() {
  return [
    "ID",
    "Recurso",
    "Categoria",
    "Cantidad",
    "Precio",
    "Foto",
    "Distribuidor",
    "Ubicacion",
    "Ubicacion fotos",
    "Informacion",
  ];
}

function actualizarPaginacion() {
  const tbody = document.querySelector<HTMLTableSectionElement>(
    "#tablaRecursos tbody"
  );
  if (!tbody) return;
  const filas = Array.from(tbody.querySelectorAll("tr"));
  const filtradas = filas.filter((fila) => fila.dataset.match === "1");

  const total = filtradas.length;
  const totalPaginas = Math.max(1, Math.ceil(total / filasPorPagina));
  if (paginaActual > totalPaginas) paginaActual = totalPaginas;
  if (paginaActual < 1) paginaActual = 1;

  filtradas.forEach((fila) => {
    fila.style.display = "none";
  });

  const inicio = (paginaActual - 1) * filasPorPagina;
  const fin = inicio + filasPorPagina;
  filtradas.slice(inicio, fin).forEach((fila) => {
    fila.style.display = "";
  });

  const info = document.getElementById("infoPagina");
  if (info) {
    info.textContent = `Página ${paginaActual} de ${totalPaginas}`;
  }

  const btnAnterior = document.getElementById("btnAnterior") as HTMLButtonElement | null;
  const btnSiguiente = document.getElementById("btnSiguiente") as
    | HTMLButtonElement
    | null;
  if (btnAnterior) btnAnterior.disabled = paginaActual <= 1;
  if (btnSiguiente) btnSiguiente.disabled = paginaActual >= totalPaginas;

  applyLowStockAlerts();
  persistInventario();
}

function cambiarPagina(direccion: number) {
  paginaActual += direccion;
  actualizarPaginacion();
}

function updateTheme(isDark: boolean) {
  const body = document.body;
  const label = document.getElementById("themeLabel");
  if (isDark) {
    body.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
    if (label) label.textContent = "Oscuro";
  } else {
    body.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
    if (label) label.textContent = "Claro";
  }
}

function applyStoredTheme() {
  const saved = localStorage.getItem("theme");
  const body = document.body;
  const toggle = document.getElementById("themeSwitch") as HTMLInputElement | null;
  const label = document.getElementById("themeLabel");
  // Default to dark theme if not set
  if (!saved || saved === "dark") {
    if (!saved) localStorage.setItem("theme", "dark");
    body.setAttribute("data-theme", "dark");
    if (toggle) toggle.checked = true;
    if (label) label.textContent = "Oscuro";
  } else {
    body.removeAttribute("data-theme");
    if (toggle) toggle.checked = false;
    if (label) label.textContent = "Claro";
  }
}

function toggleEmptyState(show: boolean) {
  const el = document.getElementById("emptyState");
  const tableWrap = document.querySelector<HTMLElement>(".tabla-scroll");
  if (el) el.style.display = show ? "block" : "none";
  if (tableWrap) tableWrap.style.display = show ? "none" : "";
}

function syncCategoryDatalists(names: string[]) {
  const unique = Array.from(new Set(names)).sort((a, b) => a.localeCompare(b, "es"));
  const targets = ["categorias", "categoriasFormulario"];
  targets.forEach((id) => {
    const dl = document.getElementById(id) as HTMLDataListElement | null;
    if (!dl) return;
    dl.innerHTML = "";
    unique.forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      dl.appendChild(opt);
    });
  });
}

function initCategoriasDesdeTablaYListas() {
  const set = new Set<string>();
  document.querySelectorAll<HTMLTableRowElement>("#tablaRecursos tbody tr").forEach((tr) => {
    const cat = tr.cells[2]?.innerText.trim();
    if (cat) set.add(cat);
  });

  document.querySelectorAll<HTMLDataListElement>("#categorias option").forEach((opt) => {
    const value = opt.value.trim();
    if (value) set.add(value);
  });

  document
    .querySelectorAll<HTMLDataListElement>("#categoriasFormulario option")
    .forEach((opt) => {
      const value = opt.value.trim();
      if (value) set.add(value);
    });

  const arr = Array.from(set);
  localStorage.setItem(CATS_KEY, JSON.stringify(arr));
  syncCategoryDatalists(arr);
}

function aplicarPresetCategoria() {
  const preset = localStorage.getItem("presetCategoria");
  if (!preset) return;
  const input = document.getElementById("filtroCategoria") as HTMLInputElement | null;
  if (input) {
    input.value = preset;
    filtrarTabla({ resetPage: true });
  }
  localStorage.removeItem("presetCategoria");
}





function getCurrencyPrefs(){
  try{
    const curr = localStorage.getItem('ajustes_currency') || 'CLP';
    const decimalsRaw = localStorage.getItem('ajustes_currency_decimals');
    const decimals = decimalsRaw !== null ? parseInt(decimalsRaw,10) : (curr==='CLP'?0:2);
    const locale = curr==='CLP' ? 'es-CL' : (curr==='EUR' ? 'es-ES' : 'en-US');
    return { curr, decimals, locale };
  }catch{ return { curr:'CLP', decimals:0, locale:'es-CL' }; }
}

function formatCurrency(value:number){
  const { curr, decimals, locale } = getCurrencyPrefs();
  try{
    return new Intl.NumberFormat(locale,{style:'currency',currency:curr,maximumFractionDigits:decimals}).format(value||0);
  }catch{
    return String(value||0);
  }
}


