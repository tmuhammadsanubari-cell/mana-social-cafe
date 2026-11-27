// Teks dan batas panel outlet di Beranda (FR-02, US-01). Placeholder dari Lampiran B menunggu
// foto ruang (Q-06) dan fasilitas Dago dari pemilik.
import type { Facility, OutletSlug } from "./content/types";

interface PanelCopy {
  chip: string;
  linkLabel: string;
  photoPlaceholder: string;
}

export const OUTLET_PANEL_COPY: Record<OutletSlug, PanelCopy> = {
  "buah-batu": {
    chip: "Buah Batu",
    linkLabel: "Lihat Buah Batu",
    photoPlaceholder: "[FOTO RUANG: void melingkar Buah Batu, dilihat dari lantai 1]",
  },
  dago: {
    chip: "Dago",
    linkLabel: "Lihat Dago dan Cottage",
    photoPlaceholder: "[FOTO RUANG: Dago, view lampu kota malam]",
  },
};

const MAIN_FACILITY_COUNT = 6;

/** Staf menentukan fasilitas utama lewat urutan di CMS. */
export function mainFacilities(facilities: readonly Facility[]): Facility[] {
  return facilities.slice(0, MAIN_FACILITY_COUNT);
}

export function facilityPlaceholder(slug: OutletSlug): string {
  return `[FASILITAS ${OUTLET_PANEL_COPY[slug].chip.toUpperCase()} DARI PEMILIK]`;
}
