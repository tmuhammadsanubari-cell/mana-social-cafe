import { createClient } from "@sanity/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createContentSource } from "../../src/lib/content/contentSource";
import { getSiteShell } from "../../src/lib/content/getSiteShell";
import { SITE_SHELL_QUERY } from "../../src/lib/content/siteShell";

const sanityFetch = vi.fn(async () => "hasil");
vi.mock("@sanity/client", () => ({ createClient: vi.fn(() => ({ fetch: sanityFetch })) }));

const sanityEnv = { PUBLIC_SANITY_PROJECT_ID: "abc123xy", PUBLIC_SANITY_DATASET: "staging" };

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("createContentSource", () => {
  it("API-01: membaca dokumen terbit dari Sanity tanpa token dan tanpa CDN", async () => {
    const source = createContentSource(sanityEnv);

    await expect(source.fetch(SITE_SHELL_QUERY)).resolves.toBe("hasil");
    expect(sanityFetch).toHaveBeenCalledWith(SITE_SHELL_QUERY.groq);
    expect(createClient).toHaveBeenCalledWith({
      projectId: "abc123xy",
      dataset: "staging",
      apiVersion: expect.any(String),
      useCdn: false,
      perspective: "published",
    });
  });

  it("gagal dengan pesan jelas bila variabel Sanity belum diisi", () => {
    expect(() => createContentSource({ PUBLIC_SANITY_DATASET: "staging" })).toThrow(
      "PUBLIC_SANITY_PROJECT_ID",
    );
  });

  it("BR-06: data uji ditolak di build produksi", () => {
    expect(() => createContentSource({ CONTENT_SOURCE: "fixture", BUILD_ENV: "production" })).toThrow(
      "produksi",
    );
  });
});

describe("getSiteShell", () => {
  it("memakai variabel lingkungan proses", async () => {
    vi.stubEnv("CONTENT_SOURCE", "fixture");
    vi.stubEnv("BUILD_ENV", "preview");

    const shell = await getSiteShell();

    expect(shell.outlets.map((outlet) => outlet.name)).toEqual(["ManA Buah Batu", "ManA Dago"]);
  });
});
