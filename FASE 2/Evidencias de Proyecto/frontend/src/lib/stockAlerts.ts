export const DEFAULT_LOW_STOCK_THRESHOLD = 1;

export type StockStatus = "ok" | "low";

export const LOW_STOCK_THRESHOLD_KEY = "ajustes_low_stock_threshold";
export const LOW_STOCK_THRESHOLD_EVENT = "servigenman-low-stock-threshold-change";

const MIN_THRESHOLD = 0;
const MAX_THRESHOLD = 999_999;

function toQuantity(value: number | string | null | undefined): number {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value.trim(), 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

export function isLowStock(
  value: number | string | null | undefined,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD
): boolean {
  return toQuantity(value) <= threshold;
}

export function getStockStatus(
  value: number | string | null | undefined,
  threshold: number = DEFAULT_LOW_STOCK_THRESHOLD
): StockStatus {
  return isLowStock(value, threshold) ? "low" : "ok";
}

export function sanitizeLowStockThreshold(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_LOW_STOCK_THRESHOLD;
  }
  if (value < MIN_THRESHOLD) return MIN_THRESHOLD;
  if (value > MAX_THRESHOLD) return MAX_THRESHOLD;
  return Math.floor(value);
}

export function getStoredLowStockThreshold(
  fallback: number = DEFAULT_LOW_STOCK_THRESHOLD
): number {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(LOW_STOCK_THRESHOLD_KEY);
    if (raw === null) return fallback;
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return fallback;
    return sanitizeLowStockThreshold(parsed);
  } catch {
    return fallback;
  }
}

export function setStoredLowStockThreshold(value: number): number {
  const sanitized = sanitizeLowStockThreshold(value);
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LOW_STOCK_THRESHOLD_KEY, String(sanitized));
    } catch {
      // ignore storage failures (private mode, etc.)
    }
    try {
      const event = new CustomEvent<number>(LOW_STOCK_THRESHOLD_EVENT, {
        detail: sanitized,
      });
      window.dispatchEvent(event);
    } catch {
      // ignore dispatch issues on older browsers
    }
  }
  return sanitized;
}

export function subscribeToLowStockThreshold(
  handler: (threshold: number) => void
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  const storageListener = (event: StorageEvent) => {
    if (event.key === LOW_STOCK_THRESHOLD_KEY) {
      handler(getStoredLowStockThreshold());
    }
  };

  const customListener = (event: Event) => {
    const custom = event as CustomEvent<number>;
    const value =
      typeof custom.detail === "number"
        ? sanitizeLowStockThreshold(custom.detail)
        : getStoredLowStockThreshold();
    handler(value);
  };

  window.addEventListener("storage", storageListener);
  window.addEventListener(LOW_STOCK_THRESHOLD_EVENT, customListener as EventListener);

  return () => {
    window.removeEventListener("storage", storageListener);
    window.removeEventListener(LOW_STOCK_THRESHOLD_EVENT, customListener as EventListener);
  };
}


