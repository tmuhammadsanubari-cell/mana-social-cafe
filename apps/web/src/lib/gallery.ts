// Aturan galeri ruang (FR-06, US-05).
import type { Outlet, OutletSlug, Photo } from "./content/types";

const GALLERY_MIN = 6;
const GALLERY_MAX = 24;

/** Beranda (PRD 8.6): foto per outlet, mengikuti susunan desain C1. */
const HOME_QUOTA: Record<OutletSlug, number> = { "buah-batu": 4, dago: 2 };

/** Daftar kosong berarti bagian galeri disembunyikan (kasus tepi 7.5). */
export function galleryPhotos(photos: readonly Photo[]): Photo[] {
  return photos.length < GALLERY_MIN ? [] : photos.slice(0, GALLERY_MAX);
}

/** Campuran kedua outlet; bila satu outlet kekurangan foto, outlet lain mengisi tempatnya. */
export function homeGalleryPhotos(outlets: readonly Outlet[]): Photo[] {
  let shortfall = outlets.reduce(
    (total, { slug, gallery }) => total + Math.max(0, HOME_QUOTA[slug] - gallery.length),
    0,
  );
  const photos = outlets.flatMap(({ slug, gallery }) => {
    const extra = Math.min(shortfall, Math.max(0, gallery.length - HOME_QUOTA[slug]));
    shortfall -= extra;
    return gallery.slice(0, HOME_QUOTA[slug] + extra);
  });
  return galleryPhotos(photos);
}

/** Tampilan penuh berhenti di ujung, tidak berputar. */
export function slideTarget(index: number, count: number): number {
  return Math.min(Math.max(index, 0), count - 1);
}

export function slideLabel(index: number, count: number): string {
  return `${index + 1} dari ${count}`;
}
