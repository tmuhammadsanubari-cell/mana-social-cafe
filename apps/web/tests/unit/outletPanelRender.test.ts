// Cabang panel yang ditentukan saat build, jadi tidak bisa dicapai uji E2E dengan satu data uji.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import OutletPanel from "../../src/components/OutletPanel.astro";
import fixture from "../../src/lib/content/fixtures/siteShell.json";
import { getOutlet, parseSiteShell } from "../../src/lib/content/siteShell";
import type { Outlet, SiteSettings } from "../../src/lib/content/types";

const shell = parseSiteShell(fixture);
const dago = getOutlet(shell, "dago");

async function render(outlet: Outlet, settings: SiteSettings = shell.settings): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(OutletPanel, { props: { outlet, settings } });
}

describe("OutletPanel", () => {
  it("kasus tepi 7.1: tutup sementara tetap tampil dengan status khusus tanpa jam", async () => {
    const html = await render({ ...dago, temporarilyClosed: true });

    expect(html).toContain("Tutup sementara. Info terbaru di Instagram @mana.bandung.");
    expect(html).toContain(dago.address);
    expect(html).not.toContain("data-today-hours");
    expect(html).not.toContain("<table");
  });

  it("BR-03: nomor WhatsApp kosong menyembunyikan tautan", async () => {
    const html = await render(dago, { ...shell.settings, whatsappNumber: null });
    expect(html).not.toContain("wa.me");
  });

  it("US-06.AC2: fasilitas tidak tersedia disebut dengan teks", async () => {
    const html = await render({ ...dago, facilities: [{ label: "AC", isAvailable: false }] });
    expect(html).toContain("AC (tidak tersedia)");
  });
});
