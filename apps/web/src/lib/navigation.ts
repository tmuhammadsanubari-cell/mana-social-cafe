// Navigasi utama (PRD 8.4). Hanya halaman yang sudah ada; FAQ ditambahkan bersama US-18.
export const NAV_ITEMS = [
  { label: "Buah Batu", href: "/buah-batu" },
  { label: "Dago dan Cottage", href: "/dago" },
  { label: "Menu", href: "/menu" },
] as const;

const TRAILING_SLASH = /\/+$/;

export function isActivePath(pathname: string, href: string): boolean {
  return pathname.replace(TRAILING_SLASH, "") === href;
}
