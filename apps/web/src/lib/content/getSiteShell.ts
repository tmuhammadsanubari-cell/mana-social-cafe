import { createContentSource } from "./contentSource";
import { loadSiteShell } from "./siteShell";
import type { SiteShell } from "./types";

export function getSiteShell(): Promise<SiteShell> {
  // Vite memuat .env ke import.meta.env; variabel dari CI dan hosting (process.env) menang.
  return loadSiteShell(createContentSource({ ...import.meta.env, ...process.env }));
}
