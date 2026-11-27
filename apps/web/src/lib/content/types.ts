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
  /** Foto galeri pertama; null bila belum ada foto (Q-06). */
  photo: Photo | null;
  facilities: Facility[];
}

export interface SiteSettings {
  whatsappNumber: string | null;
  instagramUrl: string;
  menuPdfUrl: string | null;
}

/** Konten outlet dan pengaturan: navigasi, footer, Beranda, dan halaman outlet. */
export interface SiteShell {
  outlets: Outlet[];
  settings: SiteSettings;
}
