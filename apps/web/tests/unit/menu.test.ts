import { describe, expect, it } from "vitest";
import seed from "../../../../seed/menu-buah-batu-2026-06.json";
import fixture from "../../src/lib/content/fixtures/menu.json";
import { getMenu } from "../../src/lib/content/getMenu";
import { loadMenu, parseMenu } from "../../src/lib/content/menu";
import { formatPrice } from "../../src/lib/formatPrice";
import {
  categoryAnchors,
  cssDurationMs,
  menuPhotosAllowed,
  summaryText,
  visibleCategories,
} from "../../src/lib/menu";

type Fixture = typeof fixture;
const categories = parseMenu(fixture, { photos: true });
const items = categories.flatMap((category) => category.items);
const changed = (change: (copy: Fixture) => void) => {
  const copy = structuredClone(fixture);
  change(copy);
  return copy;
};

describe("formatPrice", () => {
  it("BR-02: Es Kopi Susu Mana 28000 tampil Rp28.000", () => {
    expect(formatPrice(28000)).toBe("Rp28.000");
  });

  it("BR-02: item tanpa harga tampil Tanya barista", () => {
    expect(formatPrice(null)).toBe("Tanya barista");
  });

  it.each([
    [0, "Rp0"],
    [500, "Rp500"],
    [1350000, "Rp1.350.000"],
  ])("BR-02: %i tampil %s, tanpa desimal dan tanpa tambahan pajak", (price, text) => {
    expect(formatPrice(price)).toBe(text);
  });
});

describe("data menu", () => {
  it("US-04.AC1: 19 kategori dan 75 item", () => {
    expect(categories).toHaveLength(19);
    expect(items).toHaveLength(75);
  });

  it("US-04.AC1: nama dan harga sama dengan data menu Juni 2026", () => {
    const printed = seed.categories.flatMap((category) =>
      category.items.map((item) => [category.name, item.name, item.price_idr]),
    );
    const shown = categories.flatMap((category) =>
      category.items.map((item) => [category.name, item.name, item.priceIdr]),
    );
    expect(shown).toEqual(printed);
  });

  it("US-04.AC3: tujuh item pedas", () => {
    expect(items.filter((item) => item.isSpicy)).toHaveLength(7);
  });

  it("memisahkan tab Makanan dan Minuman", () => {
    expect(categories.filter((category) => category.section === "food")).toHaveLength(8);
    expect(categories.filter((category) => category.section === "drink")).toHaveLength(11);
  });

  it("kasus tepi 7.4: item yang dimatikan ditandai tidak tersedia", () => {
    const raw = changed((copy) => (copy.categories[0]!.items[0]!.is_available = false));
    expect(parseMenu(raw, { photos: true })[0]?.items[0]?.isAvailable).toBe(false);
  });

  it("ADR 0002: tanpa izin foto, tidak ada alamat foto yang terbawa", () => {
    const hidden = parseMenu(fixture, { photos: false });
    expect(JSON.stringify(hidden)).not.toContain("foto.invalid");
  });

  it.each([
    ["harga bukan rupiah utuh", changed((c) => (c.categories[0]!.items[0]!.price_idr = 28.5)), "price_idr"],
    ["harga negatif", changed((c) => (c.categories[0]!.items[0]!.price_idr = -1)), "price_idr"],
    ["nama item kosong", changed((c) => (c.categories[0]!.items[0]!.name = "")), "name"],
    ["tab tidak dikenal", changed((c) => (c.categories[0]!.section = "snack")), "snack"],
    ["daftar hilang", { categories: null }, "Kategori menu"],
  ])("PRD 13.6: menolak %s", (_label, raw, message) => {
    expect(() => parseMenu(raw, { photos: true })).toThrow(message);
  });
});

describe("loadMenu dan getMenu", () => {
  it("API-01: meminta query menu", async () => {
    const names: string[] = [];
    await loadMenu(
      {
        fetch: async (query) => {
          names.push(query.name);
          return fixture;
        },
      },
      { photos: true },
    );
    expect(names).toEqual(["menu"]);
  });

  it("membaca data uji tetap", async () => {
    process.env.CONTENT_SOURCE = "fixture";
    process.env.BUILD_ENV = "preview";
    await expect(getMenu()).resolves.toHaveLength(19);
    delete process.env.CONTENT_SOURCE;
    delete process.env.BUILD_ENV;
  });
});

describe("aturan tampilan menu", () => {
  it("ADR 0002: foto produk tidak tampil di produksi sampai Q-07 dijawab", () => {
    expect(menuPhotosAllowed("production")).toBe(false);
    expect(menuPhotosAllowed("preview")).toBe(true);
    expect(menuPhotosAllowed(undefined)).toBe(true);
  });

  it("kasus tepi 7.4: kategori tanpa item dan tanpa tambahan tidak tampil", () => {
    const raw = changed((copy) => (copy.categories[0]!.items = []));
    const shown = visibleCategories(parseMenu(raw, { photos: true }));

    expect(shown).toHaveLength(18);
    expect(shown.map((category) => category.name)).toContain("Add-On");
  });

  it("US-04.AC2: setiap kategori punya alamat gulir yang unik", () => {
    expect(categoryAnchors(["Coffee: Kopsu Series", "It's Dessert", "Others", "Others"])).toEqual([
      "kategori-coffee-kopsu-series",
      "kategori-its-dessert",
      "kategori-others",
      "kategori-others-2",
    ]);
  });

  it("ringkasan menyebut jumlah dan rentang harga", () => {
    expect(summaryText(categories)).toBe("75 menu, Rp13.000 sampai Rp57.000.");
  });

  it("ringkasan tanpa harga hanya menyebut jumlah", () => {
    const unpriced = categories.filter((category) => category.name === "Barista Signature V4");
    expect(summaryText(unpriced)).toBe("2 menu.");
  });

  it.each([
    ["300ms", 300],
    [".3s", 300],
    ["", 0],
  ])("PRD 8.7: durasi gulir %j dibaca %i ms", (value, expected) => {
    expect(cssDurationMs(value)).toBe(expected);
  });
});
