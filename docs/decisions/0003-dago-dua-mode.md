# 0003: Halaman Dago dengan dua mode, kafe dan cottage

- Tanggal: 2026-11-26
- Status: diterima
- Rujukan PRD: S-03, FR-09, FR-10, BR-04, BR-06

## Konteks
S-03 harus menjawab "datang ke kafe atau booking cottage?". Menaruh info kafe dan form booking dalam satu halaman panjang membuat form booking jauh di bawah, terutama di ponsel.

## Keputusan
Pengguna memilih variasi A: di bawah judul "ManA Dago" ada dua tombol pilih, "Nongkrong di kafe" dan "Menginap di cottage". Mode kafe berisi status buka, jam, lokasi, galeri, dan fasilitas. Mode cottage berisi kartu tipe kamar (label "Data contoh"), form tanggal dan jumlah tamu, estimasi biaya, dan "Kirim via WhatsApp".

## Alasan dan konsekuensi
- Kedua mode tetap satu halaman (S-03), jadi tidak ada layar baru di PRD 8.3.
- Mode bawaan: kafe. Usulan untuk implementasi (belum diputuskan): mode cottage bisa dibuka langsung lewat hash, misalnya `/dago#cottage`, agar bisa ditautkan dari Beranda dan Instagram.
- Konten kedua mode tetap ada di HTML statis dan bisa diindeks; tombol hanya menyembunyikan satu panel (`aria-pressed`, `hidden`).
- Validasi dan pesan WhatsApp mengikuti BR-04 dan US-09.AC1. Build produksi tetap gagal selama data cottage `is_placeholder = true` (BR-06).
