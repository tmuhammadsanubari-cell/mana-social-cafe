// Peta tersemat dan catatan akses (FR-04, US-03). Tombol arah memakai tautan Google Maps dari CMS.
import type { Coordinates, OutletSlug } from "./content/types";

const EMBED_URL = "https://www.openstreetmap.org/export/embed";
/** Setengah lebar area peta dalam derajat, sekitar 165 m ke tiap arah. */
const HALF_SPAN = 0.0015;

/** bbox ditulis longitude lalu latitude, sedangkan marker latitude lalu longitude. */
export function osmEmbedUrl({ latitude, longitude }: Coordinates): string {
  const bbox = [longitude - HALF_SPAN, latitude - HALF_SPAN, longitude + HALF_SPAN, latitude + HALF_SPAN];
  const url = new URL(EMBED_URL);
  url.search = new URLSearchParams({
    bbox: bbox.join(","),
    layer: "mapnik",
    marker: `${latitude},${longitude}`,
  }).toString();
  return url.toString();
}

export interface AccessNote {
  summary: string;
  detail: string;
}

// PRD 7.3: jalan ke Dago menanjak dan sempit; rinciannya menunggu pemilik (Q-01).
const ACCESS_NOTES: Partial<Record<OutletSlug, AccessNote>> = {
  dago: {
    summary: "Jalan menuju Dago menanjak dan sempit.",
    detail: "[CATATAN AKSES DARI PEMILIK: jenis kendaraan yang disarankan, titik parkir]",
  },
};

export function accessNote(slug: OutletSlug): AccessNote | null {
  return ACCESS_NOTES[slug] ?? null;
}
