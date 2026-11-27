/** Nama akun diambil dari URL di Pengaturan Situs, misalnya "@mana.bandung". */
export function instagramHandle(url: string): string | null {
  const handle = new URL(url).pathname.split("/").find(Boolean);
  return handle ? `@${handle}` : null;
}

/** Label tautan Instagram (US-10.AC1). */
export function instagramLabel(url: string): string {
  const handle = instagramHandle(url);
  return handle ? `Instagram ${handle}` : "Instagram";
}
