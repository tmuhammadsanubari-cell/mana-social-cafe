import { describe, expect, it } from "vitest";
import { trackEvent } from "../../src/lib/analytics";
import fixture from "../../src/lib/content/fixtures/siteShell.json";
import { getOutlet, parseSiteShell } from "../../src/lib/content/siteShell";
import { accessNote, mapEmbedUrl, mapQuery } from "../../src/lib/maps";

const shell = parseSiteShell(fixture);
const buahBatu = getOutlet(shell, "buah-batu");
const dago = getOutlet(shell, "dago");

describe("mapQuery", () => {
  it("US-03.AC1: peta Buah Batu memakai tujuan tombol arah", () => {
    expect(mapQuery(buahBatu)).toBe("ManA Social Cafe, Jl. Buah Batu No.127, Bandung 40265");
  });

  it("US-03.AC2: peta Dago memakai tujuan tombol arah", () => {
    expect(mapQuery(dago)).toBe("Jl. Cibengang No.21, Ciburial, Cimenyan");
  });

  it("tautan Maps tanpa tujuan memakai nama dan alamat outlet", () => {
    const shortLink = { ...dago, mapsUrl: "https://maps.app.goo.gl/abc123" };
    expect(mapQuery(shortLink)).toBe("ManA Dago, Jl. Cibengang No.21, Ciburial, Cimenyan");
  });
});

describe("mapEmbedUrl", () => {
  it("FR-04: memakai Maps Embed API dengan kunci situs", () => {
    const url = new URL(mapEmbedUrl("kunci", dago) ?? "");

    expect(url.origin + url.pathname).toBe("https://www.google.com/maps/embed/v1/place");
    expect(url.searchParams.get("key")).toBe("kunci");
    expect(url.searchParams.get("q")).toBe("Jl. Cibengang No.21, Ciburial, Cimenyan");
    expect(url.searchParams.get("language")).toBe("id");
  });

  it.each([undefined, "", "  "])("tanpa kunci (%j) peta tidak disematkan", (key) => {
    expect(mapEmbedUrl(key, dago)).toBeNull();
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
