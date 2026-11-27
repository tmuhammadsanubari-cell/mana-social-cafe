# 0007: Data uji tetap untuk E2E dan CI

- Tanggal: 2026-11-27
- Status: diterima
- Rujukan PRD: 13.5, 15, 16.1, BR-06

## Konteks
Situs membaca Sanity saat build. Bila uji E2E memakai dataset `staging`, hasilnya berubah setiap kali staf mengedit harga atau jam, dan kasus tepi (jam kosong, nomor WhatsApp kosong) tidak bisa disiapkan tanpa merusak data CMS.

## Keputusan
Variabel `CONTENT_SOURCE=fixture` membuat build membaca JSON di `apps/web/src/lib/content/fixtures/` alih-alih Sanity. Dipakai oleh Playwright dan CI. Kosong (bawaan) berarti membaca Sanity.

## Alasan dan konsekuensi
- CI tidak membutuhkan jaringan ke Sanity maupun variabel proyek.
- Build dengan `BUILD_ENV=production` dan `CONTENT_SOURCE=fixture` sengaja gagal.
- Query GROQ tidak teruji terhadap Sanity asli di CI. Pemeriksaannya lewat build lokal atau deploy preview (dataset `staging`).
- Isi data uji disalin dari `seed/`. Query baru perlu menambahkan data uji yang sepadan.
- Ditolak: server tiruan API Sanity (kode tambahan tanpa manfaat sepadan) dan E2E langsung ke `staging` (tidak stabil).
