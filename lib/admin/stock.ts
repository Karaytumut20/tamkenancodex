export const CRITICAL_STOCK_THRESHOLD = 3;

export function isCriticalStock(quantity: unknown) {
  return Number(quantity ?? 0) < CRITICAL_STOCK_THRESHOLD;
}
