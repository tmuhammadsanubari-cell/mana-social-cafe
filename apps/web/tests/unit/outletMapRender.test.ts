// Koordinat dibaca saat build, jadi keadaan tanpa koordinat diuji dengan merender komponennya.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import OutletMap from "../../src/components/OutletMap.astro";
import fixture from "../../src/lib/content/fixtures/siteShell.json";
import { getOutlet, parseSiteShell } from "../../src/lib/content/siteShell";
import type { Outlet } from "../../src/lib/content/types";

const dago = getOutlet(parseSiteShell(fixture), "dago");
const MESSAGE = "Peta tidak dapat dimuat. Gunakan tombol Petunjuk Arah.";

async function render(outlet: Outlet): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(OutletMap, { props: { outlet } });
}

describe("OutletMap", () => {
  it("kasus tepi 7.3: tanpa koordinat tampil pesan dan alamat, tanpa peta", async () => {
    const html = await render({ ...dago, coordinates: null });

    expect(html).toContain(MESSAGE);
    expect(html).toContain(dago.address);
    expect(html).not.toContain("openstreetmap.org");
  });

  it("US-03.AC3: dengan koordinat, HTML awal belum memuat iframe", async () => {
    const html = await render(dago);

    expect(html).toContain("openstreetmap.org/export/embed");
    expect(html).not.toContain("<iframe");
  });
});
