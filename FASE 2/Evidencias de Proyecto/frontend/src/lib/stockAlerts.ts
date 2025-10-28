export const DEFAULT_LOW_STOCK_THRESHOLD = 3;

export type StockStatus = "ok" | "low";

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

