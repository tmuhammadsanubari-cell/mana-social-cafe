// Paket gratis Sanity tidak punya peran Editor (ADR 0006). Semua staf berperan Administrator di
// Sanity, lalu Studio membedakan "admin situs" lewat daftar ID pengguna. Ini penjaga antarmuka,
// bukan keamanan server: akun mana pun tetap bisa menulis lewat API.

interface StudioUser {
  id: string;
}

export function parseSiteAdminIds(raw: string): ReadonlySet<string> {
  const ids = raw
    .split(",")
    .map((id) => id.trim())
    .filter((id) => id.length > 0);
  return new Set(ids);
}

export function isSiteAdmin(user: StudioUser | null | undefined, adminIds: ReadonlySet<string>): boolean {
  return user != null && adminIds.has(user.id);
}
