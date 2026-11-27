// Sumber konten saat build: Sanity, atau data uji tetap untuk E2E dan CI (ADR 0007).
import { createClient } from "@sanity/client";
import menuFixture from "./fixtures/menu.json";
import siteShellFixture from "./fixtures/siteShell.json";
import { readSanityConfig } from "./sanityConfig";
import { ContentError, type RawRecord } from "./validate";

export interface ContentQuery {
  name: "siteShell" | "menu";
  groq: string;
}

export interface ContentSource {
  fetch(query: ContentQuery): Promise<unknown>;
}

// Tanggal versi API Sanity, disamakan dengan apps/studio/env.ts.
const API_VERSION = "2026-11-26";

const fixtures: Record<ContentQuery["name"], unknown> = { siteShell: siteShellFixture, menu: menuFixture };

function fixtureSource(env: RawRecord): ContentSource {
  if (env.BUILD_ENV === "production") {
    throw new ContentError("CONTENT_SOURCE=fixture dilarang untuk build produksi.");
  }
  return { fetch: async (query) => fixtures[query.name] };
}

function sanitySource(env: RawRecord): ContentSource {
  const client = createClient({
    ...readSanityConfig(env),
    apiVersion: API_VERSION,
    // Build dipicu webhook publish, jadi tidak boleh membaca cache CDN yang basi (US-11).
    useCdn: false,
    // API-01: hanya dokumen terbit, tanpa token.
    perspective: "published",
  });
  return { fetch: (query) => client.fetch(query.groq) };
}

export function createContentSource(env: RawRecord): ContentSource {
  return env.CONTENT_SOURCE === "fixture" ? fixtureSource(env) : sanitySource(env);
}
