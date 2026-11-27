import { ContentError, optionalText, type RawRecord } from "./validate";

export interface SanityConfig {
  projectId: string;
  dataset: string;
}

export function readSanityConfig(env: RawRecord): SanityConfig {
  const projectId = optionalText(env, "PUBLIC_SANITY_PROJECT_ID");
  const dataset = optionalText(env, "PUBLIC_SANITY_DATASET");
  if (projectId === null || dataset === null) {
    throw new ContentError(
      "PUBLIC_SANITY_PROJECT_ID dan PUBLIC_SANITY_DATASET wajib diisi. Salin apps/web/.env.example ke apps/web/.env.",
    );
  }
  return { projectId, dataset };
}
