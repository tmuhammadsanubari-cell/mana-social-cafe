// Peta tersemat dan catatan akses (FR-04, US-03). Tombol arah memakai tautan dari CMS apa adanya.
import type { Outlet, OutletSlug } from "./content/types";

const EMBED_URL = "https://www.google.com/maps/embed/v1/place";

/** Tujuan di tautan arah; tautan pendek tidak memuatnya, jadi dipakai nama dan alamat. */
export function mapQuery(outlet: Outlet): string {
  const destination = new URL(outlet.mapsUrl).searchParams.get("destination");
  return destination ?? `${outlet.name}, ${outlet.address}`;
}

/** null bila kunci Maps Embed API belum diisi (PRD 13.5). */
export function mapEmbedUrl(key: string | undefined, outlet: Outlet): string | null {
  if (!key?.trim()) return null;
  const url = new URL(EMBED_URL);
  url.search = new URLSearchParams({ key: key.trim(), q: mapQuery(outlet), language: "id" }).toString();
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
