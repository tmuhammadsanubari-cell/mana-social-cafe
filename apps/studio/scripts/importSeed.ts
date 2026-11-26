// Impor data awal dari seed/ ke Sanity (PRD 11.5). Jalankan dari apps/studio:
//   npm run seed                 -> hanya membuat dokumen yang belum ada; isian staf tidak tersentuh
//   npm run seed:replace         -> menimpa semua dokumen seed dengan isi file (hati-hati)
//   npm run seed:production      -> seperti seed, ke dataset production, termasuk foto produk
// Tanpa --production, dataset diambil dari SANITY_STUDIO_DATASET (bawaan: staging).
// Memakai token login kamu (sanity login), jadi tidak ada token yang disimpan.
// Foto produk ke production hanya dengan --with-images (dipakai seed:production atas keputusan
// pengguna 2026-11-26, walau izin Q-07 belum dijawab).

import { createReadStream } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { getCliClient } from "sanity/cli";
import { API_VERSION } from "../env";
import { buildSeedDocuments } from "../seeding/buildSeedDocuments";
import type { CottageSeed, MenuSeed, SeedImage, SiteBaseSeed } from "../seeding/seedTypes";

const SEED_DIR = path.resolve(process.cwd(), "../../seed");
const IMAGE_DIR = path.join(SEED_DIR, "images/menu");

const replace = process.argv.includes("--replace");
const withImages = process.argv.includes("--with-images");
const cliClient = getCliClient({ apiVersion: API_VERSION });
const client = process.argv.includes("--production")
  ? cliClient.withConfig({ dataset: "production" })
  : cliClient;
const log = (line: string) => process.stdout.write(`${line}\n`);

async function readJson<T>(file: string): Promise<T> {
  return JSON.parse(await readFile(path.join(SEED_DIR, file), "utf8")) as T;
}

async function uploadImages(images: SeedImage[]): Promise<number> {
  const assetIds = new Map<string, string>();
  for (const image of images) {
    let assetId = assetIds.get(image.file);
    if (!assetId) {
      const asset = await client.assets.upload("image", createReadStream(path.join(IMAGE_DIR, image.file)), {
        filename: image.file,
      });
      assetId = asset._id;
      assetIds.set(image.file, assetId);
    }
    await client
      .patch(image.documentId)
      .setIfMissing({ [image.field]: { _type: "image", asset: { _type: "reference", _ref: assetId } } })
      .commit();
  }
  return assetIds.size;
}

async function main() {
  const { dataset } = client.config();
  const { documents, images } = buildSeedDocuments(
    await readJson<SiteBaseSeed>("site-base.json"),
    await readJson<MenuSeed>("menu-buah-batu-2026-06.json"),
    await readJson<CottageSeed>("cottage-dummy.json"),
  );

  const transaction = client.transaction();
  documents.forEach((doc) =>
    replace ? transaction.createOrReplace(doc) : transaction.createIfNotExists(doc),
  );
  await transaction.commit();
  log(
    `Dataset ${dataset}: ${documents.length} dokumen seed ${replace ? "ditimpa" : "dibuat bila belum ada"}.`,
  );

  if (dataset === "production" && !withImages) {
    log("Foto produk dilewati di production. Tambahkan --with-images untuk mengunggahnya.");
    return;
  }
  const uploaded = await uploadImages(images);
  log(`${uploaded} foto diunggah, ${images.length} field foto dipasang bila masih kosong.`);
}

main().catch((error: unknown) => {
  process.stderr.write(`Impor gagal: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
