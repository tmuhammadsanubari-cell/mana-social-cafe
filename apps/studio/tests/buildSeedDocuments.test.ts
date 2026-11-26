import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildSeedDocuments } from "../seeding/buildSeedDocuments";
import type { CottageSeed, MenuSeed, SanityDoc, SiteBaseSeed } from "../seeding/seedTypes";

const SEED_DIR = path.resolve(import.meta.dirname, "../../../seed");
const readSeed = <T>(file: string) => JSON.parse(readFileSync(path.join(SEED_DIR, file), "utf8")) as T;

const { documents, images } = buildSeedDocuments(
  readSeed<SiteBaseSeed>("site-base.json"),
  readSeed<MenuSeed>("menu-buah-batu-2026-06.json"),
  readSeed<CottageSeed>("cottage-dummy.json"),
);
const ofType = (type: string) => documents.filter((doc) => doc._type === type);
const byId = (id: string) => documents.find((doc) => doc._id === id) as SanityDoc;

function itemsInSection(section: string) {
  const categoryIds = new Set(
    ofType("menuCategory")
      .filter((c) => c.section === section)
      .map((c) => c._id),
  );
  return ofType("menuItem").filter((item) => categoryIds.has((item.category as { _ref: string })._ref));
}

describe("seed menu Buah Batu Juni 2026 (FR-05, US-04.AC1)", () => {
  it("US-04.AC1: 19 kategori dan 75 item", () => {
    expect(ofType("menuCategory")).toHaveLength(19);
    expect(ofType("menuItem")).toHaveLength(75);
  });

  it("31 makanan dan 44 minuman", () => {
    expect(itemsInSection("food")).toHaveLength(31);
    expect(itemsInSection("drink")).toHaveLength(44);
  });

  it("harga rupiah penuh Rp13.000 sampai Rp57.000", () => {
    const prices = ofType("menuItem").flatMap((item) =>
      typeof item.price_idr === "number" ? [item.price_idr] : [],
    );
    expect(Math.min(...prices)).toBe(13000);
    expect(Math.max(...prices)).toBe(57000);
  });

  it("BR-02: Es Kopi Susu Mana 28000", () => {
    expect(byId("menuItem-buah-batu-es-kopi-susu-mana").price_idr).toBe(28000);
  });

  it("US-04.AC4: Upside Cloud dan Harvest Bloom tanpa harga", () => {
    for (const key of ["upside-cloud", "harvest-bloom"]) {
      expect(byId(`menuItem-buah-batu-${key}`)).not.toHaveProperty("price_idr");
    }
  });

  it("US-04.AC3: item bertanda (P) di Lampiran A ditandai pedas", () => {
    expect(ofType("menuItem").filter((item) => item.is_spicy)).toHaveLength(7);
  });

  it("Add-On jadi chip di kategorinya, bukan item", () => {
    const addOn = byId("menuCategory-buah-batu-add-on");
    expect(addOn.add_ons).toHaveLength(2);
    expect(ofType("menuItem").some((item) => item.name === "Extra shot")).toBe(false);
  });

  it("ID dokumen unik, jadi impor ulang tidak menggandakan", () => {
    expect(new Set(documents.map((doc) => doc._id)).size).toBe(documents.length);
  });

  it("setiap foto seed menunjuk dokumen yang ada", () => {
    const ids = new Set(documents.map((doc) => doc._id));
    expect(images.every((image) => ids.has(image.documentId))).toBe(true);
  });
});

describe("seed outlet, jam, pengaturan, dan cottage", () => {
  it("dua outlet dengan 7 hari jam buka masing-masing", () => {
    expect(ofType("outlet").map((doc) => doc.slug)).toEqual(["buah-batu", "dago"]);
    expect(ofType("openingHours")).toHaveLength(14);
  });

  it("US-03.AC1: tujuan Maps Buah Batu sesuai PRD", () => {
    const url = new URL(byId("outlet-buah-batu").maps_url as string);
    expect(url.searchParams.get("destination")).toBe("ManA Social Cafe, Jl. Buah Batu No.127, Bandung 40265");
  });

  it("BR-03: nomor WhatsApp di SiteSettings", () => {
    expect(byId("siteSettings").whatsapp_number).toBe("6285724785388");
  });

  it("BR-06: semua tipe cottage DUMMY bertanda is_placeholder", () => {
    const cottages = ofType("cottageRoomType");
    expect(cottages.map((doc) => doc.name)).toEqual(["Couple Cottage", "Family Cottage"]);
    expect(cottages.every((doc) => doc.is_placeholder === true)).toBe(true);
  });
});
