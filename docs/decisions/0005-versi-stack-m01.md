# 0005: Versi stack dan batas paket gratis saat M-01

- Tanggal: 2026-11-26
- Status: diterima (versi); diusulkan (hosting)
- Rujukan PRD: 13.2, A-06, R-07

## Konteks
PRD 13.2 menulis Astro 5 dan meminta versi serta harga dicek ulang saat M-01. Pengecekan dilakukan 2026-11-26 lewat `npm view` dan halaman harga resmi.

## Keputusan
Memakai versi stabil terbaru, kecuali TypeScript yang ditahan di 6.0 karena typescript-eslint dan `@astrojs/check` belum mendukung 7.0. PRD 13.2 diubah dari Astro 5 ke Astro 7 atas persetujuan pengguna.

| Paket | Versi | Catatan |
|-------|-------|---------|
| Node.js | 24 (`.nvmrc`) | Astro 7 butuh Node >= 22.23.4 |
| astro | ^7.4.13 | Astro 5 terakhir di 5.18.2 |
| @astrojs/check | ^0.9.12 | Mendukung TypeScript 5 dan 6 |
| typescript | ~6.0.3 | typescript-eslint 8.74 mendukung < 6.1 |
| sanity, @sanity/vision | ^6.25.0 | Butuh React 19 dan styled-components 6 |
| vitest, @vitest/coverage-v8 | ^5.1.2 | |
| eslint | ^10.15.0 | Konfigurasi flat |
| typescript-eslint | ^8.74.0 | |
| eslint-plugin-astro | ^3.2.1 | |
| eslint-plugin-boundaries | ^7.4.5 | Sintaks `boundaries/dependencies` dengan `policies` |
| prettier, prettier-plugin-astro | ^3.10.1, ^1.1.2 | |
| @commitlint/cli | ^21.2.4 | |
| actions/checkout, actions/setup-node, gitleaks-action | v7, v7, v3 | |

`npm audit` menemukan dua temuan high di `@vercel/frameworks` (js-yaml 3.13.1, smol-toml 1.5.2), dependensi CLI Sanity. Keduanya dinaikkan lewat `overrides` di `package.json` root ke js-yaml 3.15.2 dan smol-toml 1.9.1. Sisa 15 temuan moderate berasal dari dependensi alat pengembangan dan tidak menghambat gerbang PRD 13.8 (hanya high). Hapus `overrides` setelah Sanity memperbarui CLI-nya.

### Batas paket gratis Sanity (sanity.io/pricing, dicek 2026-11-26)

| Batas | Free | Growth ($15 per kursi per bulan) |
|-------|------|----------------------------------|
| Kursi pengguna | 20 | 50 |
| Peran | 2: Administrator, Viewer | 5: Administrator, Viewer, Editor, Developer, Contributor |
| Peran kustom | Tidak | Tidak (hanya Enterprise) |
| Dataset | 2, publik saja | 2, publik atau privat |
| Dokumen | 10.000 | 25.000 |
| Permintaan API CDN per bulan | 1 juta | 1 juta |
| Permintaan API per bulan | 250.000 | 250.000 |
| Bandwidth per bulan | 100 GB | 100 GB |
| Aset | 100 GB | 100 GB |
| Webhook GROQ | 2 | |

Kebutuhan proyek muat di paket Free: dua dataset (`staging`, `production`) sesuai 16.1, sekitar 150 dokumen, dan build statis yang hanya membaca saat build. Kekurangannya, peran Editor tidak ada; lihat ADR 0006.

### Hosting (usulan, diputuskan saat deploy pertama di M-02)
- Vercel Hobby hanya untuk penggunaan pribadi non-komersial. Situs kafe adalah penggunaan komersial, jadi Vercel butuh paket Pro.
- Netlify Free boleh dipakai untuk situs komersial dalam batasnya. Akun baru memakai model kredit (300 kredit per bulan, batas keras); akun lama memakai 100 GB bandwidth dan 300 menit build per bulan.
- Usulan: Netlify Free. Cek model kredit di dashboard akun sebelum memasang build hook Sanity (JOB-01), karena setiap publish memicu build.

## Alasan dan konsekuensi
- Astro 7 dipilih agar proyek tidak mulai dua versi mayor di belakang. Konsekuensinya, contoh kode Astro 5 di internet mungkin perlu disesuaikan.
- TypeScript 7 ditunda sampai alat lint dan `astro check` mendukungnya.
- Angka harga dan batas di atas bisa berubah. Cek ulang sebelum rilis M-03 (R-07).

Sumber: [Sanity pricing](https://www.sanity.io/pricing), [Vercel Hobby plan](https://vercel.com/docs/plans/hobby), [Netlify credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/).
