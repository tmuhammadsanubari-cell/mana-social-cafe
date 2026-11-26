# apps/web: situs Astro

Situs publik S-01 sampai S-05 dan S-07. Konten dibaca dari Sanity lewat GROQ saat build (API-01). Tidak ada endpoint server.

## Peta halaman

| File di `src/pages/` | Layar | Fitur | Story |
|----------------------|-------|-------|-------|
| `index.astro` | S-01 Beranda | FR-01, FR-02, FR-14, FR-15, FR-16, FR-19, FR-20 | US-01, US-14 sampai US-16, US-19, US-20 |
| `buah-batu.astro` | S-02 Outlet Buah Batu | FR-03, FR-04, FR-06, FR-07, FR-17 | US-02, US-03, US-05, US-06, US-17 |
| `dago.astro` | S-03 Outlet Dago dan Cottage | FR-03, FR-04, FR-06, FR-07, FR-09, FR-10 | US-02, US-03, US-05, US-06, US-08, US-09 |
| `menu.astro` | S-04 Menu Buah Batu | FR-05, FR-17 | US-04, US-17 |
| `faq.astro` | S-05 FAQ | FR-18 | US-18 |
| `404.astro` | S-07 | FR-01 | - |

Komponen yang ada di semua halaman: header, `WhatsAppButton` (FR-08), footer dengan Instagram (FR-11), banner cookie (FR-21), meta SEO dan JSON-LD (FR-13).

## Lapisan

- `pages` boleh mengimpor `components`, `layouts`, dan `lib`.
- `components` boleh mengimpor `lib`.
- `lib` tidak boleh mengimpor `components`, `pages`, atau apa pun dari Astro. Isinya fungsi TypeScript murni yang bisa diuji tanpa browser.

## `src/lib`: satu file per aturan bisnis

| File | Aturan | Hal yang mudah salah |
|------|--------|----------------------|
| `openStatus.ts` | BR-01 | Hitung dalam WIB, bukan zona waktu browser. Jam tutup lewat tengah malam masuk hari berikutnya. Jam kosong berarti status tidak ditampilkan. |
| `formatPrice.ts` | BR-02 | `Rp28.000`: titik pemisah ribuan, tanpa spasi, tanpa desimal. Harga kosong (`null`) jadi `Tanya barista`. Tidak menambah pajak. |
| `whatsapp.ts` | BR-03 | Nomor dari `SiteSettings`. Pesan menyebut outlet dan diakhiri `(dari website)`. Teks di-encode dengan `encodeURIComponent`. |
| `cottage.ts` | BR-04 | Check-in paling cepat hari ini (WIB), 1 sampai 14 malam, tamu tidak melebihi kapasitas. Tanggal pesan berformat `20 Des 2026`. Estimasi = harga x malam. |
| `promo.ts` | BR-05 | Aktif bila `starts_at <= now < ends_at` (WIB). Bila ada beberapa yang aktif, ambil yang `starts_at`-nya paling baru. |
| `placeholderGuard.ts` | BR-06 | Dijalankan saat build. Bila `BUILD_ENV=production` dan ada `is_placeholder = true`, build berhenti dengan pesan yang menyebut jumlah dan nama dokumennya. |

Sebelum mengubah file di `lib`, baca BR terkait di PRD bagian 6 dan AC story-nya. Setiap contoh di kolom "Contoh" bagian 6 wajib menjadi kasus uji.

## Pengujian

- `tests/unit/`: Vitest untuk `src/lib`, cakupan minimal 90%. Nama uji diawali ID AC atau BR, misalnya `it("BR-01: 22.40 tampil Segera tutup", ...)`.
- `tests/e2e/`: Playwright di tiga browser untuk semua AC berprioritas Must. Satu file per layar, misalnya `dago.spec.ts`.
- Waktu dalam uji selalu dipalsukan (`vi.setSystemTime`, `page.clock`). Jangan bergantung pada jam mesin.
- Aksesibilitas: axe-core di setiap spec E2E, tanpa pelanggaran serius.

## Performa (NFR-01 sampai NFR-03)

- Foto hero di HTML dengan `fetchpriority="high"`, tanpa lazy-load. Gambar di bawah layar pertama memakai `loading="lazy"`.
- Semua gambar punya `width` dan `height` atau `aspect-ratio`. Format AVIF atau WebP dari Sanity Image CDN.
- Peta Google tersemat baru dimuat saat area peta masuk viewport (US-03.AC3).
- Script GA4 baru dimuat setelah "Setuju" dan tidak memblokir render (US-13).
- JavaScript klien hanya untuk status buka, form cottage, galeri layar penuh, navigasi kategori menu, dan banner cookie. Selebihnya HTML statis.

## Standar kode (PRD 13.8)

Fungsi maksimal 40 baris, file komponen maksimal 200 baris, file lain maksimal 300 baris, kompleksitas siklomatik maksimal 10. Tanpa `any`, tanpa catch kosong, tanpa `console.log`. Komponen PascalCase, fungsi dan file utilitas camelCase.

## Variabel lingkungan

Lihat [.env.example](.env.example). Semua variabel `PUBLIC_*` boleh terlihat di browser. Jangan pernah menaruh token Sanity di sini.
