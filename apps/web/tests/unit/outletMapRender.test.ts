// Kunci Maps dibaca saat build, jadi keadaan tanpa kunci diuji dengan merender komponennya.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { afterEach, describe, expect, it, vi } from "vitest";
import OutletMap from "../../src/components/OutletMap.astro";
import fixture from "../../src/lib/content/fixtures/siteShell.json";
import { getOutlet, parseSiteShell } from "../../src/lib/content/siteShell";

const dago = getOutlet(parseSiteShell(fixture), "dago");
const MESSAGE = "Peta tidak dapat dimuat. Gunakan tombol Petunjuk Arah.";

async function render(): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(OutletMap, { props: { outlet: dago } });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("OutletMap", () => {
  it("kasus tepi 7.3: tanpa kunci Maps tampil pesan dan alamat, tanpa peta", async () => {
    vi.stubEnv("PUBLIC_MAPS_EMBED_KEY", "");
    const html = await render();

    expect(html).toContain(MESSAGE);
    expect(html).toContain(dago.address);
    expect(html).not.toContain("maps/embed");
  });

  it("US-03.AC3: dengan kunci, HTML awal belum memuat iframe", async () => {
    vi.stubEnv("PUBLIC_MAPS_EMBED_KEY", "kunci-uji");
    const html = await render();

    expect(html).toContain("maps/embed");
    expect(html).not.toContain("<iframe");
  });
});
