// Satu tempat membaca variabel lingkungan Studio. Sanity menyisipkan SANITY_STUDIO_* ke process.env.
export const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? "";
export const dataset = process.env.SANITY_STUDIO_DATASET ?? "staging";
export const siteAdminIdsRaw = process.env.SANITY_STUDIO_SITE_ADMIN_IDS ?? "";

export const API_VERSION = "2026-11-26";
