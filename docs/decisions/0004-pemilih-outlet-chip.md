# 0004: Pemilih outlet di Beranda berupa dua chip dan satu panel

- Tanggal: 2026-11-26
- Status: diterima
- Rujukan PRD: FR-02, US-01.AC2, US-01.AC3, 8.3, 8.6, 8.10

## Konteks
PRD v1.0 meminta dua kartu outlet tampil sekaligus di Beranda. Di Ronde 2 pengguna memilih pemilih outlet dari variasi C2: dua chip "Buah Batu" dan "Dago" di atas satu panel lebar yang berisi foto ruang, status buka, jam, alamat, fasilitas utama, tombol "Petunjuk Arah", tautan WhatsApp, dan tautan ke halaman outlet.

## Keputusan
Beranda memakai dua chip dan satu panel yang berganti sesuai chip aktif. Buah Batu terpilih secara bawaan. PRD diperbarui ke v1.1 (2026-11-26) dengan persetujuan pengguna.

## Alasan dan konsekuensi
- Satu panel memberi ruang untuk foto ruang dan fasilitas tanpa membuat Beranda panjang, dan pengunjung hanya membaca info outlet yang ia tuju.
- Chip memakai `<button>` dengan `aria-pressed`; panel berganti di sisi klien tanpa memuat ulang halaman. Teks status tetap dihitung di browser dengan WIB (BR-01).
- Tanpa JavaScript, chip disembunyikan dan panel kedua outlet tampil berurutan (kasus tepi 7.1), jadi HTML statis tetap berisi data dua outlet dan bisa diindeks.
- Status outlet yang tidak dipilih tidak terlihat sampai chip ditekan. Bila nanti terbukti membingungkan, status singkat bisa ditambahkan di dalam chip.
