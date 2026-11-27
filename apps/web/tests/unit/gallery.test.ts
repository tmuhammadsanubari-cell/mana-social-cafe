import { describe, expect, it } from "vitest";
import type { Outlet, OutletSlug, Photo } from "../../src/lib/content/types";
import { galleryPhotos, homeGalleryPhotos, slideLabel, slideTarget } from "../../src/lib/gallery";

const photos = (count: number, name = "foto"): Photo[] =>
  Array.from({ length: count }, (_, index) => ({
    url: `https://foto.invalid/${name}-${index + 1}.jpg`,
    alt: `${name} ${index + 1}`,
  }));

const outlet = (slug: OutletSlug, count: number) => ({ slug, gallery: photos(count, slug) }) as Outlet;
const alts = (list: Photo[]) => list.map((photo) => photo.alt);

describe("galleryPhotos (FR-06)", () => {
  it("US-05.AC1: 12 foto tampil semua sesuai urutan", () => {
    expect(galleryPhotos(photos(12))).toEqual(photos(12));
  });

  it.each([0, 1, 5])("kasus tepi 7.5: %i foto menyembunyikan galeri", (count) => {
    expect(galleryPhotos(photos(count))).toEqual([]);
  });

  it("FR-06: tepat 6 foto sudah tampil", () => {
    expect(galleryPhotos(photos(6))).toHaveLength(6);
  });

  it("FR-06: paling banyak 24 foto pertama", () => {
    expect(galleryPhotos(photos(30))).toEqual(photos(24));
  });
});

describe("homeGalleryPhotos (PRD 8.6)", () => {
  it("4 foto Buah Batu lalu 2 foto Dago", () => {
    expect(alts(homeGalleryPhotos([outlet("buah-batu", 8), outlet("dago", 6)]))).toEqual([
      "buah-batu 1",
      "buah-batu 2",
      "buah-batu 3",
      "buah-batu 4",
      "dago 1",
      "dago 2",
    ]);
  });

  it("kekurangan Dago diisi foto Buah Batu", () => {
    const shown = alts(homeGalleryPhotos([outlet("buah-batu", 8), outlet("dago", 1)]));
    expect(shown).toHaveLength(6);
    expect(shown.slice(4)).toEqual(["buah-batu 5", "dago 1"]);
  });

  it("kekurangan Buah Batu diisi foto Dago", () => {
    const shown = alts(homeGalleryPhotos([outlet("buah-batu", 0), outlet("dago", 9)]));
    expect(shown).toHaveLength(6);
    expect(shown[0]).toBe("dago 1");
  });

  it("kasus tepi 7.5: gabungan di bawah 6 foto menyembunyikan galeri", () => {
    expect(homeGalleryPhotos([outlet("buah-batu", 3), outlet("dago", 2)])).toEqual([]);
  });
});

describe("tampilan penuh (US-05.AC2)", () => {
  it("geser berhenti di foto pertama dan terakhir", () => {
    expect(slideTarget(-1, 12)).toBe(0);
    expect(slideTarget(5, 12)).toBe(5);
    expect(slideTarget(12, 12)).toBe(11);
  });

  it("label posisi dihitung dari 1", () => {
    expect(slideLabel(2, 12)).toBe("3 dari 12");
  });
});
