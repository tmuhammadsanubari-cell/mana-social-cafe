# 0012: Susunan galeri ruang dan sumber foto sementara

- Tanggal: 2026-11-27
- Status: diterima
- Rujukan PRD: FR-06, US-05, kasus tepi 7.5, 8.6, 8.7, 8.10, Q-06; melengkapi ADR 0008

## Konteks
PRD 8.6 meminta galeri 6 sampai 9 foto campuran di Beranda, tetapi tidak mengatur cara memilihnya. Desain S-02 menampilkan kisi tujuh kolom di desktop dan dua kolom di ponsel, berbeda dari PRD 8.10. Judul galeri Beranda di desain, "Sudut Favorit Pengunjung", menyatakan hal yang belum dikonfirmasi pemilik. Dari 14 foto yang tersedia, 8 dibuat ulang oleh AI (metadata C2PA `trainedAlgorithmicMedia`).

## Keputusan
- Kolom mengikuti PRD 8.10: satu di bawah 640 px, dua di 640 sampai 1023 px, tiga mulai 1024 px.
- Beranda menampilkan 4 foto Buah Batu lalu 2 foto Dago menurut `sort_order`. Bila satu outlet kekurangan, outlet lain mengisi. Di ponsel berupa kartu geser, di layar lebar kolase (desain C1). Judulnya "Galeri".
- Tampilan penuh memakai `<dialog>` dan scroll-snap, tanpa pustaka. Foto berhenti di ujung, tidak berputar.
- Tanpa JavaScript tiap foto adalah tautan ke file fotonya.
- Keputusan pengguna: 8 foto buatan AI diperlakukan seperti foto asli, tanpa tanda data contoh, sehingga ikut build produksi. Ini mengesampingkan larangan foto buatan di aturan UI sampai ada foto asli dari pemilik.

## Alasan dan konsekuensi
- Staf mengatur isi Beranda hanya lewat urutan foto.
- BR-06 dan `placeholderGuard.ts` tidak akan mendeteksi foto AI. Penggantiannya harus dilacak manual: di `seed/gallery.json` semua file `.png` adalah buatan AI.
- Foto asli diletakkan lebih dulu di tiap outlet, jadi panel Beranda dan galeri Beranda saat ini hanya menampilkan foto asli.
