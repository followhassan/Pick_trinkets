export type GalleryImage = { id?: string; url: string };

export function galleryUrls(product: { imageUrl: string; images?: GalleryImage[] }) {
  const extras = [...(product.images ?? [])]
    .sort((a, b) => {
      const left = "sortOrder" in a ? Number((a as { sortOrder?: number }).sortOrder ?? 0) : 0;
      const right = "sortOrder" in b ? Number((b as { sortOrder?: number }).sortOrder ?? 0) : 0;
      return left - right;
    })
    .map((image) => image.url)
    .filter((url) => url && url !== product.imageUrl);
  return [product.imageUrl, ...extras];
}

export const sortOptions = [
  { id: "new", label: "Newest" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name" },
] as const;

export type SortId = (typeof sortOptions)[number]["id"];

export function parseSort(value: string | undefined): SortId {
  return sortOptions.some((option) => option.id === value) ? (value as SortId) : "new";
}

export function sortOrder(sort: SortId) {
  if (sort === "price-asc") return [{ price: "asc" as const }, { title: "asc" as const }];
  if (sort === "price-desc") return [{ price: "desc" as const }, { title: "asc" as const }];
  if (sort === "name") return [{ title: "asc" as const }];
  return [{ createdAt: "desc" as const }, { title: "asc" as const }];
}

export function parsePrice(value: string | undefined) {
  if (!value?.trim()) return undefined;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return undefined;
  return amount;
}
