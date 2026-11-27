# 0011: Susunan halaman menu dan foto produk

- Tanggal: 2026-11-27
- Status: diterima
- Rujukan PRD: FR-05, US-04, kasus tepi 7.4, 8.7, 8.10, Q-07; melengkapi ADR 0002

## Konteks
Desain S-04 mengelompokkan kategori dalam pita besar ("New Menu", "All About Rice") dengan judul pendek. Data CMS hanya punya nama kategori, misalnya "All About Rice: Asian". Foto produk belum boleh tampil di produksi (ADR 0002), dan kasus tepi 7.4 meminta "Menu" di halaman Dago menampilkan catatan, bukan menu Buah Batu.

## Keputusan
- Tiap kategori punya pita judul kuning sendiri berisi nama lengkap dari CMS. Pengelompokan menurut desain tidak dibuat.
- Tab Makanan dan Minuman berupa dua tombol `aria-pressed`. Tanpa JavaScript keduanya tersembunyi dan semua kategori tampil.
- Foto produk disingkirkan saat build bila `BUILD_ENV=production`, termasuk alamatnya. Kategori tanpa foto tampil sebagai daftar.
- Di halaman Dago, tautan "Menu" di navigasi menuju `/dago#menu-dago`, yang berisi catatan, tombol WhatsApp, dan tautan ke menu Buah Batu.

## Alasan dan konsekuensi
- Judul halaman, navigasi kategori, dan data selalu sama; staf mengganti nama tanpa mengubah kode.
- Setelah Q-07 dijawab, hapus penahan foto di `menuPhotosAllowed` (`apps/web/src/lib/menu.ts`).
- Dari halaman Dago, menu Buah Batu butuh satu ketukan tambahan.
- Gulir ke kategori memakai animasi sendiri agar lamanya mengikuti `--duration-scroll` dan langsung melompat saat `prefers-reduced-motion`.
