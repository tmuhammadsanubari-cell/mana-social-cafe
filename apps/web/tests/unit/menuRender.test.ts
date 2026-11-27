// Keadaan yang tidak ada di data uji tetap diuji dengan merender komponennya.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import MenuCategory from "../../src/components/MenuCategory.astro";
import MenuIntro from "../../src/components/MenuIntro.astro";
import menuFixture from "../../src/lib/content/fixtures/menu.json";
import shellFixture from "../../src/lib/content/fixtures/siteShell.json";
import { parseMenu } from "../../src/lib/content/menu";
import { parseSiteShell } from "../../src/lib/content/siteShell";

const shell = parseSiteShell(shellFixture);
const categories = parseMenu(menuFixture, { photos: false });
const beef = categories[0]!;

async function render(component: Parameters<AstroContainer["renderToString"]>[0], props: object) {
  const container = await AstroContainer.create();
  return container.renderToString(component, { props: { ...props } });
}

describe("MenuCategory", () => {
  it("kasus tepi 7.4: item tidak tersedia tetap tampil berlabel", async () => {
    const items = beef.items.map((item) => ({ ...item, isAvailable: false }));
    const html = await render(MenuCategory, { category: { ...beef, items } });

    expect(html).toContain("Nasi Beef Teriyaki");
    expect(html).toContain("Sedang tidak tersedia");
  });

  it("ADR 0002: tanpa foto, item tetap tampil sebagai teks", async () => {
    const html = await render(MenuCategory, { category: beef });

    expect(html).toContain("Rp45.000");
    expect(html).not.toContain("<img");
  });
});

describe("MenuIntro", () => {
  const props = { categories, dago: shell.outlets[1], settings: shell.settings };

  it("kasus tepi 7.4: URL menu PDF kosong menyembunyikan tombol", async () => {
    const html = await render(MenuIntro, { ...props, settings: { ...shell.settings, menuPdfUrl: null } });
    expect(html).not.toContain("Lihat menu versi PDF");
  });

  it("BR-03: nomor WhatsApp kosong menyisakan teks tanpa tautan", async () => {
    const html = await render(MenuIntro, { ...props, settings: { ...shell.settings, whatsappNumber: null } });

    expect(html).toContain("Menu ManA Dago sedang disiapkan.");
    expect(html).not.toContain("wa.me");
  });
});
