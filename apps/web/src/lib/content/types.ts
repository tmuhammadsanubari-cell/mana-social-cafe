// Bentuk konten yang dipakai halaman (PRD 11.3). Nama field Sanity (snake_case) berhenti di pemetaan.

export const OUTLET_SLUGS = ["buah-batu", "dago"] as const;
export type OutletSlug = (typeof OUTLET_SLUGS)[number];

/** Jam satu hari dalam WIB. weekday 1 = Senin, 7 = Minggu. */
export interface DayHours {
  weekday: number;
  opensAt: string;
  closesAt: string;
}

export interface Photo {
  url: string;
  alt: string;
}

export interface Facility {
  label: string;
  isAvailable: boolean;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Outlet {
  slug: OutletSlug;
  name: string;
  address: string;
  mapsUrl: string;
  /** Titik peta tersemat; null bila belum diisi (kasus tepi 7.3). */
  coordinates: Coordinates | null;
  gofoodUrl: string | null;
  temporarilyClosed: boolean;
  /** Hari yang jamnya belum diisi tidak ada di daftar (kasus tepi 7.2). */
  hours: DayHours[];
  /** Foto ruang menurut sort_order; yang pertama dipakai panel Beranda (ADR 0008). */
  gallery: Photo[];
  facilities: Facility[];
}

export interface SiteSettings {
  whatsappNumber: string | null;
  instagramUrl: string;
  menuPdfUrl: string | null;
}

export type MenuSection = "food" | "drink";

export interface MenuItem {
  name: string;
  /** null tampil "Tanya barista" (BR-02). */
  priceIdr: number | null;
  description: string | null;
  options: string | null;
  isSpicy: boolean;
  isNew: boolean;
  badge: string | null;
  isAvailable: boolean;
  imageUrl: string | null;
}

/** Tambahan dan upgrade; tidak dihitung sebagai item menu (ADR 0002). */
export interface MenuAddOn {
  name: string;
  priceIdr: number | null;
  badge: string | null;
  note: string | null;
  imageUrl: string | null;
}

export interface MenuCategory {
  name: string;
  anchor: string;
  section: MenuSection;
  subtitle: string | null;
  imageUrl: string | null;
  items: MenuItem[];
  addOns: MenuAddOn[];
}

/** Konten outlet dan pengaturan: navigasi, footer, Beranda, dan halaman outlet. */
export interface SiteShell {
  outlets: Outlet[];
  settings: SiteSettings;
}
