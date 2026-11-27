import { describe, expect, it } from "vitest";
import fixture from "../../src/lib/content/fixtures/siteShell.json";
import { getOutlet, loadSiteShell, parseSiteShell } from "../../src/lib/content/siteShell";

type Fixture = typeof fixture;

function changed(change: (copy: Fixture) => void): Fixture {
  const copy = structuredClone(fixture);
  change(copy);
  return copy;
}

describe("parseSiteShell", () => {
  it("API-01: memetakan outlet, jam, dan pengaturan situs", () => {
    const shell = parseSiteShell(fixture);

    expect(shell.outlets.map((outlet) => outlet.slug)).toEqual(["buah-batu", "dago"]);
    expect(getOutlet(shell, "dago").hours).toHaveLength(7);
    expect(getOutlet(shell, "buah-batu")).toMatchObject({
      name: "ManA Buah Batu",
      gofoodUrl: null,
      temporarilyClosed: false,
    });
    expect(shell.settings.instagramUrl).toBe("https://www.instagram.com/mana.bandung/");
  });

  it("mengurutkan outlet tetap Buah Batu lalu Dago", () => {
    const shell = parseSiteShell(changed((copy) => copy.outlets.reverse()));
    expect(shell.outlets.map((outlet) => outlet.slug)).toEqual(["buah-batu", "dago"]);
  });

  it("kasus tepi 7.2: hari tanpa jam tidak masuk daftar", () => {
    const raw = changed((copy) => {
      copy.outlets[0]!.hours[0]!.opens_at = "";
    });
    const hours = getOutlet(parseSiteShell(raw), "buah-batu").hours;
    expect(hours.map((day) => day.weekday)).toEqual([2, 3, 4, 5, 6, 7]);
  });

  it("FR-02, FR-06: memetakan foto galeri sesuai urutan dan fasilitas outlet", () => {
    const outlet = getOutlet(parseSiteShell(fixture), "buah-batu");

    expect(outlet.gallery).toHaveLength(12);
    expect(outlet.gallery[0]).toEqual({
      url: "https://foto.invalid/ruang-buah-batu.jpg",
      alt: "[DATA UJI] Void melingkar Buah Batu",
    });
    expect(outlet.facilities).toContainEqual({ label: "Tanpa AC", isAvailable: true });
  });

  it("FR-04: memetakan koordinat peta", () => {
    expect(getOutlet(parseSiteShell(fixture), "dago").coordinates).toEqual({
      latitude: -6.853527158415028,
      longitude: 107.64640213744224,
    });
  });

  it("kasus tepi 7.3: koordinat yang belum diisi tetap valid", () => {
    const raw = changed((copy) =>
      copy.outlets.forEach((outlet) => Object.assign(outlet, { latitude: null, longitude: null })),
    );
    expect(getOutlet(parseSiteShell(raw), "dago").coordinates).toBeNull();
  });

  it("outlet tanpa foto dan fasilitas tetap valid", () => {
    expect(getOutlet(parseSiteShell(fixture), "dago")).toMatchObject({ gallery: [], facilities: [] });
  });

  it("US-06.AC2: fasilitas yang dimatikan ditandai tidak tersedia", () => {
    const raw = changed((copy) => {
      copy.outlets[0]!.facilities[0]!.is_available = false;
    });
    expect(getOutlet(parseSiteShell(raw), "buah-batu").facilities[0]?.isAvailable).toBe(false);
  });

  it("foto tanpa file dilewati", () => {
    const raw = changed((copy) => {
      copy.outlets[0]!.gallery[0]!.url = "";
    });
    expect(getOutlet(parseSiteShell(raw), "buah-batu").gallery).toHaveLength(11);
  });

  it("kasus tepi 7.6: nomor WhatsApp dan URL menu PDF boleh kosong", () => {
    const raw = changed((copy) => {
      copy.settings.whatsapp_number = "";
      copy.settings.menu_pdf_url = "";
    });
    expect(parseSiteShell(raw).settings).toMatchObject({ whatsappNumber: null, menuPdfUrl: null });
  });
});

describe("parseSiteShell menolak konten rusak (PRD 13.6)", () => {
  it.each([
    ["Pengaturan Situs hilang", { ...fixture, settings: null }, "Pengaturan Situs"],
    ["daftar outlet hilang", { ...fixture, outlets: null }, "Outlet"],
    ["outlet Dago tidak ada", changed((copy) => copy.outlets.pop()), 'outlet "dago"'],
    ["outlet ganda", changed((copy) => copy.outlets.push(copy.outlets[0]!)), "ditemukan 2"],
    ["slug asing", changed((copy) => (copy.outlets[0]!.slug = "lembang")), "lembang"],
    ["alamat kosong", changed((copy) => (copy.outlets[0]!.address = " ")), "address"],
    ["jam salah format", changed((copy) => (copy.outlets[0]!.hours[0]!.opens_at = "8 pagi")), "HH:mm"],
    ["hari di luar 1 sampai 7", changed((copy) => (copy.outlets[0]!.hours[0]!.weekday = 8)), "hari"],
    ["Instagram kosong", changed((copy) => (copy.settings.instagram_url = "")), "instagram_url"],
    ["hanya latitude terisi", changed((c) => Object.assign(c.outlets[0]!, { longitude: null })), "bersama"],
    ["latitude di luar rentang", changed((c) => (c.outlets[0]!.latitude = 107.6)), "latitude"],
    ["longitude di luar rentang", changed((c) => (c.outlets[0]!.longitude = 200)), "longitude"],
    [
      "US-05.AC1: foto tanpa teks alternatif",
      changed((copy) => (copy.outlets[0]!.gallery[3]!.alt_text = " ")),
      "alt_text",
    ],
    [
      "URL bukan http",
      changed((copy) => (copy.outlets[0]!.maps_url = "javascript:alert(1)")),
      "http:// atau https://",
    ],
  ])("%s", (_label, raw, message) => {
    expect(() => parseSiteShell(raw)).toThrow(message);
  });
});

describe("loadSiteShell", () => {
  it("meminta query siteShell ke sumber konten", async () => {
    const names: string[] = [];
    const shell = await loadSiteShell({
      fetch: async (query) => {
        names.push(query.name);
        return fixture;
      },
    });

    expect(names).toEqual(["siteShell"]);
    expect(shell.outlets).toHaveLength(2);
  });
});
