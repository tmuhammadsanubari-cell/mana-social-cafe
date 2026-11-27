// Bentuk file JSON di folder seed/ (lihat seed/README.md).

export interface MenuSeedItem {
  key: string;
  name: string;
  price_idr: number | null;
  description?: string;
  options?: string;
  is_spicy?: boolean;
  is_new?: boolean;
  badge?: string;
  image?: string;
}

export interface MenuSeedAddOn {
  key: string;
  name: string;
  price_idr: number | null;
  badge?: string;
  note?: string;
  image?: string;
}

export interface MenuSeedCategory {
  key: string;
  name: string;
  section: "food" | "drink";
  subtitle?: string;
  image?: string;
  add_ons?: MenuSeedAddOn[];
  items: MenuSeedItem[];
}

export interface MenuSeed {
  outlet: string;
  categories: MenuSeedCategory[];
}

export interface CottageSeed {
  outlet: string;
  room_types: Array<{
    key: string;
    name: string;
    units: number;
    capacity: number;
    price_per_night_idr: number;
    facilities: string[];
    check_in_time: string;
    check_out_time: string;
    is_placeholder: boolean;
  }>;
}

export interface GallerySeed {
  outlets: Array<{
    outlet: string;
    /** Folder di seed/images. */
    folder: string;
    /** Urutan daftar menjadi sort_order; foto pertama tampil di panel Beranda (ADR 0008). */
    photos: Array<{ key: string; file: string; alt_text: string }>;
  }>;
}

export interface SiteBaseSeed {
  outlets: Array<{
    slug: string;
    name: string;
    address: string;
    maps_destination: string;
    latitude: number | null;
    longitude: number | null;
    gofood_url: string | null;
    opens_at: string;
    closes_at: string;
  }>;
  site_settings: Record<string, string | null>;
}

export interface SanityDoc {
  _id: string;
  _type: string;
  [field: string]: unknown;
}

/** Foto yang diunggah skrip impor lalu dipasang ke field dokumen. */
export interface SeedImage {
  documentId: string;
  field: string;
  /** Path relatif terhadap seed/images. */
  file: string;
}

export interface SeedResult {
  documents: SanityDoc[];
  images: SeedImage[];
}
