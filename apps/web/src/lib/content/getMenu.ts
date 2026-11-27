import { menuPhotosAllowed } from "../menu";
import { createContentSource } from "./contentSource";
import { loadMenu } from "./menu";
import type { MenuCategory } from "./types";

export function getMenu(): Promise<MenuCategory[]> {
  // Sama seperti getSiteShell: variabel dari CI dan hosting (process.env) menang atas .env.
  const env: Record<string, unknown> = { ...import.meta.env, ...process.env };
  return loadMenu(createContentSource(env), { photos: menuPhotosAllowed(env.BUILD_ENV) });
}
