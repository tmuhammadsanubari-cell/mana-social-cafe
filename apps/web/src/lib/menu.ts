// Aturan tampilan halaman menu (FR-05, US-04).
import type { MenuCategory, MenuSection } from "./content/types";
import { formatPrice } from "./formatPrice";

export const MENU_SECTIONS: ReadonlyArray<{ id: MenuSection; label: string }> = [
  { id: "food", label: "Makanan" },
  { id: "drink", label: "Minuman" },
];

const MS_PER_SECOND = 1000;

/** ADR 0002: foto produk dari PDF tidak boleh tampil di produksi sebelum Q-07 dijawab. */
export function menuPhotosAllowed(buildEnv: unknown): boolean {
  return buildEnv !== "production";
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Alamat gulir tiap kategori; nama yang sama diberi nomor. */
export function categoryAnchors(names: readonly string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const base = `kategori-${slugify(name)}`;
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
}

/** Kasus tepi 7.4: kategori kosong tidak tampil di navigasi dan daftar. */
export function visibleCategories(categories: readonly MenuCategory[]): MenuCategory[] {
  return categories.filter((category) => category.items.length > 0 || category.addOns.length > 0);
}

export function summaryText(categories: readonly MenuCategory[]): string {
  const items = categories.flatMap((category) => category.items);
  const prices = items.map((item) => item.priceIdr).filter((price) => price !== null);
  if (prices.length === 0) return `${items.length} menu.`;
  const range = `${formatPrice(Math.min(...prices))} sampai ${formatPrice(Math.max(...prices))}`;
  return `${items.length} menu, ${range}.`;
}

/** Nilai token durasi CSS; minifier bisa menulis 300ms sebagai .3s. */
export function cssDurationMs(value: string): number {
  const amount = Number.parseFloat(value);
  if (Number.isNaN(amount)) return 0;
  return value.trim().endsWith("ms") ? amount : amount * MS_PER_SECOND;
}
