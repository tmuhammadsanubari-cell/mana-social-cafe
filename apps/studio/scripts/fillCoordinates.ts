// Migrasi PRD 1.2 (ADR 0010): isi latitude dan longitude outlet dari seed/site-base.json. Hanya field
// yang masih kosong yang diisi, jadi aman dijalankan ulang. Jalankan di staging lebih dulu (PRD 11.5):
//   npm run migrate:coordinates                    -> dataset staging
//   npm run migrate:coordinates -- -- --production -> dataset production
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { API_VERSION } from "../env";
import type { SiteBaseSeed } from "../seeding/seedTypes";

const SEED_FILE = path.resolve(process.cwd(), "../../seed/site-base.json");

const cliClient = getCliClient({ apiVersion: API_VERSION });
const client = cliClient.withConfig({
  dataset: process.argv.includes("--production") ? "production" : "staging",
  perspective: "raw",
});
const log = (line: string) => process.stdout.write(`${line}\n`);

async function main() {
  const { dataset } = client.config();
  const base = JSON.parse(await readFile(SEED_FILE, "utf8")) as SiteBaseSeed;

  for (const { slug, latitude, longitude } of base.outlets) {
    // Draf ikut diisi supaya menerbitkannya tidak menghapus koordinat.
    const ids = await client.fetch<string[]>("*[_id in $ids]._id", {
      ids: [`outlet-${slug}`, `drafts.outlet-${slug}`],
    });
    for (const id of ids) {
      const saved = await client.patch(id).setIfMissing({ latitude, longitude }).commit();
      log(`Dataset ${dataset}: ${id} latitude ${saved.latitude}, longitude ${saved.longitude}`);
    }
    if (ids.length === 0) log(`Dataset ${dataset}: outlet-${slug} tidak ditemukan.`);
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`Migrasi gagal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
