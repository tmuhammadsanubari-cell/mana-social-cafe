import { describe, expect, it } from "vitest";
import { trackEvent } from "../../src/lib/analytics";
import { accessNote, osmEmbedUrl } from "../../src/lib/maps";

describe("osmEmbedUrl", () => {
  const point = { latitude: -6.9360055924259605, longitude: 107.62226864418093 };
  const url = new URL(osmEmbedUrl(point));

  it("FR-04: memakai halaman sematan OpenStreetMap tanpa kunci", () => {
    expect(url.origin + url.pathname).toBe("https://www.openstreetmap.org/export/embed");
    expect(url.searchParams.get("layer")).toBe("mapnik");
    expect([...url.searchParams.keys()].sort()).toEqual(["bbox", "layer", "marker"]);
  });

  it("penanda memakai urutan latitude lalu longitude", () => {
    expect(url.searchParams.get("marker")).toBe("-6.9360055924259605,107.62226864418093");
  });

  it("bbox memakai urutan longitude lalu latitude dan mengurung penanda", () => {
    const [west = 0, south = 0, east = 0, north = 0] = (url.searchParams.get("bbox") ?? "")
      .split(",")
      .map(Number);

    expect(west).toBeLessThan(point.longitude);
    expect(east).toBeGreaterThan(point.longitude);
    expect(south).toBeLessThan(point.latitude);
    expect(north).toBeGreaterThan(point.latitude);
    expect(east - west).toBeCloseTo(0.003, 6);
  });
});

describe("accessNote", () => {
  it("PRD 7.3: Dago memuat catatan akses dengan placeholder pemilik (Q-01)", () => {
    expect(accessNote("dago")).toEqual({
      summary: "Jalan menuju Dago menanjak dan sempit.",
      detail: "[CATATAN AKSES DARI PEMILIK: jenis kendaraan yang disarankan, titik parkir]",
    });
  });

  it("Buah Batu tanpa catatan akses", () => {
    expect(accessNote("buah-batu")).toBeNull();
  });
});

describe("trackEvent", () => {
  const params = { outlet: "dago", page: "/dago" };

  it("US-03.AC4: mengirim event bila gtag sudah dimuat setelah persetujuan", () => {
    const calls: unknown[][] = [];
    trackEvent({ gtag: (...args: unknown[]) => calls.push(args) }, "click_directions", params);

    expect(calls).toEqual([["event", "click_directions", params]]);
  });

  it("FR-21: tanpa persetujuan tidak ada yang dikirim", () => {
    const scope = {};
    expect(() => trackEvent(scope, "click_directions", params)).not.toThrow();
    expect(scope).toEqual({});
  });
});
