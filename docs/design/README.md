# Desain UI ManA Social Cafe

Hasil Ronde 1 sampai 5 (selesai 2026-11-26). Sumber utama ada di canvas Claude Design; folder ini menyimpan salinan untuk developer.

- Canvas: https://claude.ai/artifact/AVSQvPnTengSHqsWbjaMAk (tekan Play untuk mencoba alur klik)
- Token: [`apps/web/src/styles/tokens.css`](../../apps/web/src/styles/tokens.css)
- Aturan komponen dan state: [design-system.md](design-system.md)
- Pilihan per ronde dan perubahan yang berdampak ke PRD: [keputusan-desain-ui.md](keputusan-desain-ui.md)
- Penyimpangan dari PRD: [ADR 0001 sampai 0004](../decisions/)

Bila tangkapan layar dan PRD bertentangan, PRD yang berlaku, kecuali bagian yang sudah dicatat sebagai ADR berstatus "diterima".

## Layar final

| Layar | Artboard di canvas | Tangkapan layar |
|-------|--------------------|-----------------|
| S-01 Beranda | `Pemenang.dc.html`, `Status-Beranda.dc.html` | [desktop](screens/01-beranda-desktop.jpg), [ponsel](screens/01-beranda-ponsel.jpg), [status dan error](screens/02-beranda-status-dan-error.jpg) |
| S-02 Buah Batu | `S02-Buah-Batu.dc.html` | [desktop](screens/03-buah-batu-desktop.jpg), [ponsel](screens/03-buah-batu-ponsel.jpg) |
| S-04 Menu, tab Makanan | `S04-Menu.dc.html` | [desktop](screens/04-menu-makanan-desktop.jpg), [ponsel](screens/04-menu-makanan-ponsel.jpg) |
| S-04 Menu, tab Minuman | `S04-Menu-Minuman.dc.html` | [desktop](screens/05-menu-minuman-desktop.jpg), [ponsel](screens/05-menu-minuman-ponsel.jpg) |
| S-03 Dago, mode kafe | `S03-Dago-A.dc.html` | [desktop](screens/06-dago-kafe-desktop.jpg), [ponsel](screens/06-dago-kafe-ponsel.jpg) |
| S-03 Dago, mode cottage | `S03-Dago-A-Cottage.dc.html` | [desktop](screens/07-dago-cottage-desktop.jpg), [ponsel](screens/07-dago-cottage-ponsel.jpg) |
| S-05 FAQ | `S05-FAQ.dc.html` | [desktop](screens/08-faq-desktop.jpg), [ponsel](screens/08-faq-ponsel.jpg) |
| S-07 404 | `S07-404.dc.html` | [desktop](screens/09-404-desktop.jpg), [ponsel](screens/09-404-ponsel.jpg) |
| Design system | `DS-Fondasi.dc.html`, `DS-Komponen.dc.html` | [fondasi](screens/10-design-system-fondasi.jpg), [komponen](screens/11-design-system-komponen.jpg) |

Tangkapan layar dirender ulang dari canvas dengan lebar 1440 px (desktop) dan 390 px (ponsel), satu halaman penuh. Status buka di gambar mengikuti jam saat render. Artboard variasi yang tidak dipilih (Main, B, C, C1 sampai C3, S04-Menu-A sampai C, S03-Dago-B dan C) masih ada di canvas sebagai arsip.

## Alur utama

1. Beranda → pilih outlet di panel → Petunjuk Arah (Google Maps) atau WhatsApp.
2. Beranda → Menu → tab Makanan atau Minuman → pita kategori menempel di atas → "Lihat menu versi PDF" (Google Drive).
3. Beranda → Dago dan Cottage → "Menginap di cottage" → pilih kamar → tanggal dan jumlah tamu → estimasi biaya → "Kirim via WhatsApp" (pesan sesuai US-09.AC1, validasi BR-04).

Contoh pesan WhatsApp booking di desain:
`Halo ManA Dago, saya ingin booking Family Cottage untuk 3 tamu, check-in 20 Des 2026, check-out 22 Des 2026 (2 malam). (dari website)`

## Aset

| Aset | Lokasi | Catatan |
|------|--------|---------|
| Logo, motif garis, ilustrasi orang | `apps/web/src/assets/brand/` | Sudah ada sebelum desain |
| 58 foto produk menu (WebP) + `manifest.json` | `seed/images/menu/` | Dipotong dari PDF menu Juni 2026. **Belum boleh dipakai di produksi** sampai Q-07 (izin dan file asli) dijawab |
| Foto ruang dan cottage | belum ada | Pakai kotak cream berlabel `[FOTO RUANG: ...]` dari Lampiran B. Menunggu Q-06 |

`manifest.json` memetakan nama file ke nama item menu persis seperti di PDF.

## Catatan untuk implementasi

- Canvas tidak punya media query, jadi tata letak ponsel di sana berganti di lebar 720 px. Di kode pakai breakpoint PRD 8.10 (640 px dan 1024 px).
- Kontainer di canvas 1240 px termasuk padding samping; di kode `--content-max: 1200px` sesuai PRD 8.10, padding pakai `--gutter`.
- Font di canvas: Anton dan Archivo. Acumin dipakai bila lisensi web tersedia (Q-05).
- Kategori aktif di navigasi menu dan menu ponsel yang menutup dengan Escape belum terlihat di canvas, tapi wajib di kode.
- Bingkai ponsel di canvas dibatasi 8.000 px, jadi bagian bawah halaman Menu ponsel terpotong di canvas. Tangkapan layar di `screens/` tidak terpotong.
- Semua teks yang belum ada dari pemilik tetap placeholder berlabel. Daftarnya di [keputusan-desain-ui.md](keputusan-desain-ui.md#placeholder-yang-masih-menunggu-pemilik).
