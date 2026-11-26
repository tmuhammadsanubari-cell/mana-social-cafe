# apps/studio: Sanity Studio

Editor konten untuk staf ManA (S-06, FR-12, US-11). Penggunanya tidak punya latar teknis, jadi label field, deskripsi, dan pesan validasi harus berbahasa Indonesia yang jelas.

## Peta skema

Satu file per entitas di `schemas/`. Field lengkap ada di PRD bagian 11.3, relasi di 11.2.

| File | Entitas | Catatan |
|------|---------|---------|
| `outlet.ts` | E-01 Outlet | `slug` hanya `buah-batu` atau `dago` dan tidak boleh diubah setelah rilis. Hapus hanya untuk Administrator. |
| `openingHours.ts` | E-02 OpeningHours | `weekday` 1 (Senin) sampai 7 (Minggu). Jam `HH:mm` dalam WIB, `closes_at` boleh lewat tengah malam. |
| `menuCategory.ts` | E-03 MenuCategory | Punya `sort_order` dan referensi outlet. |
| `menuItem.ts` | E-04 MenuItem | `price_idr` integer rupiah, kosong berarti "Tanya barista". `name` wajib, pesan: "Nama menu wajib diisi." |
| `cottageRoomType.ts` | E-05 CottageRoomType | `is_placeholder` default `true`. Kapasitas 1 sampai 8. |
| `galleryImage.ts` | E-06 GalleryImage | `alt_text` wajib. Ukuran unggahan maksimal 10 MB, pesan: "Ukuran foto maksimal 10 MB." |
| `facility.ts` | E-07 Facility | `is_available = false` tetap ditampilkan sebagai "Tidak tersedia". |
| `testimonial.ts` | E-08 Testimonial | `source_url` wajib (BR-07). Teks tidak boleh diubah dari aslinya. |
| `promo.ts` | E-09 Promo | `starts_at` dan `ends_at` disimpan UTC. |
| `faqItem.ts` | E-10 FaqItem | Referensi outlet opsional. |
| `siteSettings.ts` | E-11 SiteSettings | Singleton. Hanya Administrator yang boleh mengubah (US-11.AC3). |
| `event.ts` | E-12 Event | Event yang sudah lewat tidak tampil (US-20.AC1). |

## Peran (PRD 12.2, ADR 0006)

- **Administrator:** semua dokumen, pengaturan proyek, anggota.
- **Editor** (peran kustom): create, update, publish semua jenis kecuali `SiteSettings`; tidak boleh menghapus `Outlet`.

Paket gratis Sanity tidak punya peran Editor. Semua staf berperan Administrator di Sanity, dan Studio membedakan admin situs lewat `SANITY_STUDIO_SITE_ADMIN_IDS` (ID pengguna, bukan email). Aturannya di `access/` dan diuji di `tests/access.test.ts`. Ini penjaga antarmuka, bukan keamanan server.

## Struktur

| Path | Isi |
|------|-----|
| `sanity.config.ts`, `sanity.cli.ts`, `env.ts` | Konfigurasi Studio (dua workspace: `/production` dan `/staging`) dan variabel lingkungan. Studio tayang di https://mana-social-cafe.sanity.studio |
| `structure.ts` | Menu kiri Studio; Pengaturan Situs sebagai satu dokumen tetap |
| `access/` | `isSiteAdmin` dan aturan tombol aksi dokumen |
| `schemas/fields.ts` | Field bersama: referensi outlet, urutan, jam `HH:mm`, foto maks 10 MB, `is_placeholder` |
| `seeding/` | Mengubah `seed/*.json` jadi dokumen Sanity (murni, teruji) |
| `scripts/importSeed.ts` | `npm run seed`: tulis dokumen, unggah foto produk bila dataset bukan `production` (Q-07) |
| `tests/` | Vitest |

## Alur data

- Publish di Studio memicu webhook ke build hook hosting (API-04, JOB-01). Target tayang 10 menit (NFR-05).
- Dataset `staging` untuk preview dan uji migrasi, `production` untuk situs publik.
- Perubahan field memakai skrip migrasi Sanity yang dijalankan di `staging` lebih dulu.
- Data awal diimpor dari folder `seed/` di root proyek.
