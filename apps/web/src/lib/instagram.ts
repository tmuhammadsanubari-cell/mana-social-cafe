/** Label tautan Instagram diambil dari URL di Pengaturan Situs (US-10.AC1). */
export function instagramLabel(url: string): string {
  const handle = new URL(url).pathname.split("/").find(Boolean);
  return handle ? `Instagram @${handle}` : "Instagram";
}
