import {
  LOW_STOCK_THRESHOLD_EVENT,
  LOW_STOCK_THRESHOLD_KEY,
  getStoredLowStockThreshold,
  isLowStock,
} from "@/lib/stockAlerts";

type InventoryItem = {
  id: number;
  recurso: string;
  categoria: string;
  cantidad: number;
  precio: number;
  foto: string;
  info: string;
};

type CleanupFn = () => void;

type CategorySummary = {
  name: string;
  resourceCount: number;
  totalQuantity: number;
  totalValue: number;
  topResource?: string;
  hasLowStock: boolean;
};

type CarouselControl = {
  cleanup: CleanupFn;
  refresh: () => void;
};

const INVENTORY_KEY = "inventarioData";
const CATS_KEY = "categoriasInventario";

export function initializeCategoriesPage(): CleanupFn {
  if (typeof document === "undefined") {
    return () => {};
  }

  const cleanupFns: CleanupFn[] = [];
  const carouselControls = Array.from(
    document.querySelectorAll<HTMLElement>(".category-carousel")
  ).map(setupCarousel);

  cleanupFns.push(
    ...carouselControls.map((control) => control.cleanup),
    setupThemeToggle(),
    setupStorageSync(() => renderCategories(carouselControls)),
    setupFocusSync(() => renderCategories(carouselControls)),
    setupThresholdSync(() => renderCategories(carouselControls))
  );

  renderCategories(carouselControls);

  return () => {
    cleanupFns.forEach((fn) => fn());
  };
}

function setupThemeToggle(): CleanupFn {
  const toggle = document.getElementById("themeSwitch") as HTMLInputElement | null;
  const handler = () => updateTheme(Boolean(toggle?.checked));
  toggle?.addEventListener("change", handler);
  applyStoredTheme();
  return () => {
    toggle?.removeEventListener("change", handler);
  };
}

function setupStorageSync(refresh: () => void): CleanupFn {
  const handler = (event: StorageEvent) => {
    if (!event.key || [INVENTORY_KEY, CATS_KEY, "theme", "ajustes_currency", "ajustes_currency_decimals", LOW_STOCK_THRESHOLD_KEY].includes(event.key)) {
      refresh();
      if (!event.key || event.key === "theme") {
        applyStoredTheme();
      }
    }
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

function setupFocusSync(refresh: () => void): CleanupFn {
  const handler = () => refresh();
  window.addEventListener("focus", handler);
  return () => window.removeEventListener("focus", handler);
}

function setupThresholdSync(refresh: () => void): CleanupFn {
  const handler = () => refresh();
  window.addEventListener(LOW_STOCK_THRESHOLD_EVENT, handler as EventListener);
  return () => window.removeEventListener(LOW_STOCK_THRESHOLD_EVENT, handler as EventListener);
}

function renderCategories(controls: CarouselControl[]) {
  const inventory = loadJSON<InventoryItem[]>(INVENTORY_KEY, []);
  const storedCategories = loadJSON<string[]>(CATS_KEY, []);

  const container = document.querySelector<HTMLElement>(".categories-shell");
  const lowStockLabel = container?.dataset.lowStockLabel?.trim() ?? "Low stock";
  const thresholdAttr = container?.dataset.lowStockThreshold;
  const thresholdParsed = thresholdAttr ? Number.parseInt(thresholdAttr, 10) : Number.NaN;
  const lowStockThreshold = Number.isNaN(thresholdParsed)
    ? getStoredLowStockThreshold()
    : thresholdParsed;
  if (container) {
    container.dataset.lowStockThreshold = String(lowStockThreshold);
  }

  const categories = buildCategorySummaries(inventory, storedCategories, lowStockThreshold);
  persistCategoryNames(categories.map((category) => category.name));

  const topRow = categories.slice(0, Math.ceil(categories.length / 2));
  const bottomRow = categories.slice(Math.ceil(categories.length / 2));

  const topTrack = document.querySelector<HTMLElement>(
    '.category-carousel[data-row="top"] .category-track'
  );
  const bottomTrack = document.querySelector<HTMLElement>(
    '.category-carousel[data-row="bottom"] .category-track'
  );

  if (topTrack) {
    fillTrack(topTrack, topRow, lowStockLabel);
  }
  if (bottomTrack) {
    fillTrack(bottomTrack, bottomRow, lowStockLabel);
  }

  const emptyState = document.getElementById("categoriesEmptyState");
  const isEmpty = categories.length === 0;
  if (emptyState) {
    emptyState.hidden = !isEmpty;
  }

  const carousels = document.querySelectorAll<HTMLElement>(".category-carousel");
  carousels.forEach((carousel) => {
    if (isEmpty) {
      carousel.classList.add("is-empty");
    } else {
      carousel.classList.remove("is-empty");
    }
  });

  requestAnimationFrame(() => {
    controls.forEach((control) => control.refresh());
  });
}

function fillTrack(track: HTMLElement, categories: CategorySummary[], lowStockLabel: string) {
  track.innerHTML = "";
  if (!categories.length) {
    const placeholder = document.createElement("div");
    placeholder.className = "category-track__placeholder";
    placeholder.textContent = "No hay categorías en esta fila";
    track.appendChild(placeholder);
    return;
  }

  categories.forEach((category) => {
    track.appendChild(createCategoryCard(category, lowStockLabel));
  });
}

function createCategoryCard(category: CategorySummary, lowStockLabel: string) {
  const card = document.createElement("article");
  card.className = "category-card";
  card.tabIndex = 0;
  card.dataset.category = category.name;
  if (category.hasLowStock) {
    card.classList.add("category-card--low");
  }

  // Get currency preferences from localStorage
  const curr = localStorage.getItem('ajustes_currency') || 'CLP';
  const decimalsRaw = localStorage.getItem('ajustes_currency_decimals');
  const decimals = decimalsRaw !== null ? parseInt(decimalsRaw, 10) : (curr === 'CLP' ? 0 : 2);
  const locale = curr === 'CLP' ? 'es-CL' : (curr === 'EUR' ? 'de-DE' : 'en-US');

  const quantityFormatter = new Intl.NumberFormat(locale);
  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: curr,
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });

  card.innerHTML = `
    <header class="category-card__header">
      <h4>${category.name}</h4>
      <div class="category-card__meta">
        <span class="category-card__chip">${category.resourceCount} recursos</span>
        ${category.hasLowStock ? `<span class="low-stock-badge" role="status">${lowStockLabel}</span>` : ""}
      </div>
    </header>
    <dl class="category-card__stats">
      <div>
        <dt>Total de unidades</dt>
        <dd>${quantityFormatter.format(category.totalQuantity)}</dd>
      </div>
      <div>
        <dt>Valor estimado</dt>
        <dd>${currencyFormatter.format(category.totalValue)}</dd>
      </div>
      <div>
        <dt>Recurso destacado</dt>
        <dd>${category.topResource ?? "Sin especificar"}</dd>
      </div>
    </dl>
    <footer class="category-card__footer">
      <span>Ver recursos</span>
      <span aria-hidden="true" class="category-card__arrow">→</span>
    </footer>
  `;

  const navigate = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("presetCategoria", category.name);
    window.location.href = "/inventario";
  };

  card.addEventListener("click", navigate);
  card.addEventListener("keydown", (event) => {
    const key = (event as KeyboardEvent).key;
    if (key === "Enter" || key === " " || key === "Spacebar") {
      event.preventDefault();
      navigate();
    }
  });

  return card;
}

function setupCarousel(carousel: HTMLElement): CarouselControl {
  const track = carousel.querySelector<HTMLElement>(".category-track");
  const prev = carousel.querySelector<HTMLButtonElement>(".cat-nav.prev");
  const next = carousel.querySelector<HTMLButtonElement>(".cat-nav.next");

  if (!track || !prev || !next) {
    return {
      cleanup: () => {},
      refresh: () => {},
    };
  }

  const step = () => Math.max(track.clientWidth * 0.8, 200);

  const scrollPrev = () => {
    track.scrollBy({ left: -step(), behavior: "smooth" });
  };

  const scrollNext = () => {
    track.scrollBy({ left: step(), behavior: "smooth" });
  };

  const updateControls = () => {
    const { scrollLeft, scrollWidth, clientWidth } = track;
    const maxScrollLeft = Math.max(0, scrollWidth - clientWidth - 1);
    const hideButtons = scrollWidth <= clientWidth + 1;

    prev.disabled = scrollLeft <= 0;
    next.disabled = scrollLeft >= maxScrollLeft;

    prev.classList.toggle("is-hidden", hideButtons);
    next.classList.toggle("is-hidden", hideButtons);
  };

  prev.addEventListener("click", scrollPrev);
  next.addEventListener("click", scrollNext);
  track.addEventListener("scroll", updateControls);
  window.addEventListener("resize", updateControls);

  return {
    cleanup: () => {
      prev.removeEventListener("click", scrollPrev);
      next.removeEventListener("click", scrollNext);
      track.removeEventListener("scroll", updateControls);
      window.removeEventListener("resize", updateControls);
    },
    refresh: () => {
      updateControls();
    },
  };
}

function buildCategorySummaries(
  inventory: InventoryItem[],
  storedCategories: string[],
  threshold: number
): CategorySummary[] {
  const normalizedCategories = new Map<string, string>();

  const addCategory = (raw?: string) => {
    const value = raw?.trim();
    if (!value) return;
    const key = value.toLowerCase();
    if (!normalizedCategories.has(key)) {
      normalizedCategories.set(key, value);
    }
  };

  storedCategories.forEach((name) => addCategory(name));
  inventory.forEach((item) => addCategory(item.categoria));

  const categories = Array.from(normalizedCategories.values()).sort((a, b) =>
    a.localeCompare(b, "es", { sensitivity: "base" })
  );

  return categories.map((name) => summarizeCategory(name, inventory, threshold));
}

function summarizeCategory(
  name: string,
  inventory: InventoryItem[],
  threshold: number
): CategorySummary {
  const normalized = name.trim().toLowerCase();
  const items = inventory.filter((item) => {
    const categoryName = item.categoria?.trim().toLowerCase();
    return categoryName === normalized;
  });

  const resourceCount = items.length;
  const totalQuantity = items.reduce((acc, item) => acc + (item.cantidad ?? 0), 0);
  const totalValue = items.reduce(
    (acc, item) => acc + (item.cantidad ?? 0) * (item.precio ?? 0),
    0
  );

  const topResource = items
    .slice()
    .sort((a, b) => (b.cantidad ?? 0) - (a.cantidad ?? 0))[0]?.recurso;
  const hasLowStock = items.some((item) => isLowStock(item.cantidad ?? 0, threshold));

  return {
    name,
    resourceCount,
    totalQuantity,
    totalValue,
    topResource,
    hasLowStock,
  };
}

function loadJSON<T>(key: string, fallback: T): T {
  try {
    if (typeof window === "undefined") {
      return fallback;
    }
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn("Error leyendo almacenamiento", error);
    return fallback;
  }
}

function updateTheme(isDark: boolean) {
  const body = document.body;
  const label = document.getElementById("themeLabel");
  if (isDark) {
    body.setAttribute("data-theme", "dark");
    window.localStorage.setItem("theme", "dark");
    if (label) label.textContent = "Oscuro";
  } else {
    body.removeAttribute("data-theme");
    window.localStorage.setItem("theme", "light");
    if (label) label.textContent = "Claro";
  }
}

function applyStoredTheme() {
  const saved = window.localStorage.getItem("theme");
  const toggle = document.getElementById("themeSwitch") as HTMLInputElement | null;
  const label = document.getElementById("themeLabel");
  if (saved === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (toggle) toggle.checked = true;
    if (label) label.textContent = "Oscuro";
  } else {
    document.body.removeAttribute("data-theme");
    if (toggle) toggle.checked = false;
    if (label) label.textContent = "Claro";
  }
}

function persistCategoryNames(names: string[]) {
  try {
    if (typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(CATS_KEY, JSON.stringify(names));
  } catch (error) {
    console.warn("No fue posible guardar las categorías", error);
  }
}
