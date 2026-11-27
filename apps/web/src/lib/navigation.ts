// Navigasi utama (PRD 8.4). Hanya halaman yang sudah ada; FAQ ditambahkan bersama US-18.
export const NAV_ITEMS = [
  { label: "Buah Batu", href: "/buah-batu" },
  { label: "Dago dan Cottage", href: "/dago" },
  { label: "Menu", href: "/menu" },
] as const;

const TRAILING_SLASH = /\/+$/;

/** Kasus tepi 7.4: di halaman Dago, "Menu" menuju catatan menu Dago, bukan menu Buah Batu. */
export function navItemsFor(pathname: string): ReadonlyArray<{ label: string; href: string }> {
  if (!isActivePath(pathname, "/dago")) return NAV_ITEMS;
  return NAV_ITEMS.map((item) => (item.href === "/menu" ? { ...item, href: "/dago#menu-dago" } : item));
}

export function isActivePath(pathname: string, href: string): boolean {
  return pathname.replace(TRAILING_SLASH, "") === href;
}
