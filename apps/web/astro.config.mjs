// @ts-check
import { defineConfig } from "astro/config";

// Situs statis penuh (PRD 13.1): tidak ada adapter server.
export default defineConfig({
  output: "static",
});
