// Ukuran gambar lewat parameter Sanity Image CDN (NFR-01 sampai NFR-03).
const SMALL_WIDTH = 480;
const DEFAULT_WIDTH = 960;
const LARGE_WIDTH = 1440;
const WIDTHS = [SMALL_WIDTH, DEFAULT_WIDTH, LARGE_WIDTH];

function resized(url: string, width: number): string {
  const result = new URL(url);
  result.searchParams.set("w", String(width));
  result.searchParams.set("auto", "format");
  result.searchParams.set("fit", "max");
  return result.toString();
}

const THUMB_WIDTH = 480;
const THUMB_SMALL_WIDTH = 240;

/** Foto produk di halaman menu tampil kecil. */
export function thumbSources(url: string): { src: string; srcset: string } {
  return {
    src: resized(url, THUMB_WIDTH),
    srcset: [THUMB_SMALL_WIDTH, THUMB_WIDTH].map((width) => `${resized(url, width)} ${width}w`).join(", "),
  };
}

export function photoSources(url: string): { src: string; srcset: string } {
  return {
    src: resized(url, DEFAULT_WIDTH),
    srcset: WIDTHS.map((width) => `${resized(url, width)} ${width}w`).join(", "),
  };
}
