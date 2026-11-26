# 0002: Halaman Menu meniru PDF menu cetak

- Tanggal: 2026-11-26
- Status: diterima
- Rujukan PRD: FR-05, BR-02, 8.10, Q-07

## Konteks
Pengguna ingin halaman Menu (S-04) terasa sama dengan menu digital Juni 2026 yang sudah dikenal pelanggan. PRD 8.10 menaruh navigasi kategori di sisi kiri pada lebar 1024 px ke atas, dan FR-05 tidak menyebut tautan ke PDF.

## Keputusan
S-04 memakai gaya PDF: pita judul kuning, teks asli, foto produk dari PDF, tab Makanan dan Minuman, dan pita kategori yang menempel di atas di semua lebar layar. Tombol "Lihat menu versi PDF" membuka https://drive.google.com/file/d/11J0ZPLBY_zVp2iFSTEs1H9k17RMwYzKc/view di tab baru. Tombol unduh tidak dipakai.

## Alasan dan konsekuensi
- Pita kategori di atas menggantikan navigasi kiri di desktop; ini menyimpang dari PRD 8.10.
- URL Google Drive disimpan di `SiteSettings` (bukan ditulis di kode) dan perlu field baru, misalnya `menu_pdf_url`, di skema E-11 SiteSettings (PRD 11.3).
- 58 foto produk hasil potongan PDF ada di `seed/images/menu/` hanya untuk desain dan pengembangan. Foto tidak boleh tampil di produksi sebelum Q-07 (izin dan file asli) dijawab; tanpa foto, kartu tetap tampil dengan teks saja.
- Cara hitung menu: 75 item (31 makanan + 44 minuman) dalam 19 kategori, Add-On sebagai chip, Now Blooming sebagai catatan di Classic Series. Sesuai angka FR-05.
- PRD diperbarui ke v1.1 (2026-11-26) dengan persetujuan pengguna: FR-05, US-04.AC5 baru, kasus tepi 7.4, 8.8, 8.10, E-11, dan matriks 21.
