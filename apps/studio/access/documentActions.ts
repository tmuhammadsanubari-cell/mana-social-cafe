// Aturan tombol aksi dokumen di Studio (PRD 12.2, API-03, ADR 0006). Murni agar bisa diuji.

interface NamedAction {
  action?: string;
}

// Pengaturan Situs adalah singleton: tidak boleh dihapus, diduplikasi, atau ditarik dari publikasi.
const SINGLETON_BLOCKED = new Set(["delete", "duplicate", "unpublish"]);

export function allowedActions<T extends NamedAction>(
  actions: readonly T[],
  schemaType: string,
  siteAdmin: boolean,
): T[] {
  if (schemaType === "siteSettings") {
    if (!siteAdmin) return [];
    return actions.filter((item) => !SINGLETON_BLOCKED.has(item.action ?? ""));
  }
  if (schemaType === "outlet" && !siteAdmin) {
    return actions.filter((item) => item.action !== "delete");
  }
  return [...actions];
}
