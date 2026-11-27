// Cabang galeri yang ditentukan saat build, jadi tidak bisa dicapai uji E2E dengan satu data uji.
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, expect, it } from "vitest";
import Gallery from "../../src/components/Gallery.astro";
import type { Photo } from "../../src/lib/content/types";

const photos = (count: number): Photo[] =>
  Array.from({ length: count }, (_, index) => ({
    url: `https://foto.invalid/ruang-${index + 1}.jpg`,
    alt: `Ruang ${index + 1}`,
  }));

async function render(count: number): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(Gallery, {
    props: { id: "gallery", title: "Galeri Dago", photos: photos(count) },
  });
}

describe("Gallery", () => {
  it("kasus tepi 7.5: 5 foto tidak merender bagian galeri sama sekali", async () => {
    const html = await render(5);
    expect(html).not.toContain("Galeri Dago");
    expect(html).not.toContain("<dialog");
  });

  it("FR-06: 30 foto hanya merender 24 pilihan", async () => {
    const html = await render(30);
    expect(html.match(/data-gallery-open/g)).toHaveLength(24);
    expect(html).not.toContain("ruang-25.jpg");
  });

  it("US-05.AC2: tampilan penuh punya tombol Tutup", async () => {
    expect(await render(6)).toMatch(/<button[^>]*data-viewer-close[^>]*>\s*Tutup\s*<\/button>/);
  });
});
