# Keputusan desain UI

Ronde 1 sampai 5, selesai 2026-11-26. Canvas: https://claude.ai/artifact/AVSQvPnTengSHqsWbjaMAk

## Pilihan per ronde

| Ronde | Pilihan pengguna |
|-------|------------------|
| 1 | Arah C, "Teman Ngobrol" |
| 2 | C1 (hierarki), pemilih outlet dari C2, bagian menu gaya B |
| 3 | Semua perbaikan 1 sampai 10 |
| 4 | Design system v1 ([design-system.md](design-system.md)) |
| 5 | S-02 satu versi; S-04 diganti gaya PDF menu; S-03 variasi A; S-05 dan S-07 satu versi |

## Perubahan atas permintaan pengguna

| Topik | Keputusan | Dampak ke PRD (sudah di PRD v1.1) | ADR |
|-------|-----------|---------------|-----|
| Tombol hero "Lihat Menu" dan "Pilih Outlet" | Dihapus. Navigasi atas dan panel pemilih outlet di bawah hero menggantikannya | FR-01, US-01.AC1, PRD 8.6 dan 8.8 | [0001](../decisions/0001-hero-tanpa-tombol.md) |
| Foto ruang di hero ponsel | Dihapus. Foto ruang pertama tampil di panel outlet | FR-01 dipenuhi lewat panel outlet | [0001](../decisions/0001-hero-tanpa-tombol.md) |
| Galeri Beranda | Desktop kolase 3 kolom (C1), ponsel kartu digeser horizontal | - | - |
| Halaman Menu | Meniru PDF menu: teks asli, foto produk dari PDF, tab Makanan dan Minuman, pita kategori menempel di atas, tombol "Lihat menu versi PDF" ke Google Drive | FR-05, PRD 8.10 (navigasi kategori kiri), Q-07 | [0002](../decisions/0002-menu-gaya-pdf.md) |
| Pemilih outlet Beranda | Dua chip (Buah Batu, Dago) dan satu panel yang berganti, Buah Batu bawaan | FR-02, US-01.AC2, US-01.AC3, 8.3, 8.6, 8.10 | [0004](../decisions/0004-pemilih-outlet-chip.md) |
| Halaman Dago | Variasi A: dua mode, "Nongkrong di kafe" dan "Menginap di cottage" | S-03 | [0003](../decisions/0003-dago-dua-mode.md) |

## Cara hitung menu

Dipakai di desain dan untuk seed: 31 makanan + 44 minuman = **75 item** dalam **19 kategori**. Add-On (2 entri) ditampilkan sebagai chip terpisah, bukan item. Now Blooming adalah catatan di dalam Classic Series, bukan kategori sendiri.

## Placeholder yang masih menunggu pemilik

Kalimat positioning (Q-12), foto ruang dan cottage (Q-06), ulasan Google asli, URL GoFood (Q-10), fasilitas Dago, catatan akses jalan Dago (Q-01), jadwal movie night, data cottage asli (Q-01, sekarang DUMMY berlabel "Data contoh"), jawaban FAQ soal AC dan rokok di Dago, pajak (Q-08), hewan peliharaan, kapasitas grup, jam balas WhatsApp (Q-03), teks Tentang ManA.

## Usulan yang belum disetujui

- Saat outlet tutup sementara, tombol Petunjuk Arah diganti tautan Instagram @mana.bandung.
