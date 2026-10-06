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
  }).format(date);
}

export const statusLabel = {
  NEW: "New",
  PROCESSING: "Processing",
  DONE: "Done",
} as const;

export function canBuy(product: { available: boolean; stock: number }) {
  return product.available && product.stock > 0;
}
