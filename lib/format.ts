export function formatBdt(value: number | string | { toString(): string }) {
  const amount = Number(value);
  const rounded = Number.isInteger(amount) ? amount : Math.round(amount * 100) / 100;
  const text = rounded.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `৳${text}`;
}

export function formatWhen(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export function formatDay(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

export const statusLabel = {
  NEW: "New",
  PROCESSING: "Processing",
  DONE: "Done",
} as const;

export const statusDetail = {
  NEW: "We have your order and will confirm it by phone.",
  PROCESSING: "We're packing this and arranging delivery.",
  DONE: "This order is complete. Thank you for shopping with us.",
} as const;

export function canBuy(product: { available: boolean; stock: number }) {
  return product.available && product.stock > 0;
}

const DHAKA_OFFSET_MS = 6 * 60 * 60 * 1000;

export function dhakaDateKey(date: Date) {
  return new Date(date.getTime() + DHAKA_OFFSET_MS).toISOString().slice(0, 10);
}

export function lastDhakaDays(count: number) {
  const today = dhakaDateKey(new Date());
  const [year, month, day] = today.split("-").map(Number);
  const start = new Date(Date.UTC(year, month - 1, day));
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() - (count - 1 - index));
    const key = date.toISOString().slice(0, 10);
    const label = new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    }).format(date);
    return { key, label };
  });
}
