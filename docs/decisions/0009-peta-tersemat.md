# 0009: Peta tersemat dan penanganan gagal muat

- Tanggal: 2026-11-27
- Status: diterima; bagian Maps Embed API dan kunci diganti oleh 0010
- Rujukan PRD: FR-04, US-03, kasus tepi 7.3, 12.3, 13.5

## Konteks
Peta memakai Maps Embed API di dalam iframe lintas domain. Halaman tidak bisa membaca isi iframe, jadi tidak ada cara pasti untuk tahu apakah Google menampilkan peta atau halaman galat. Kunci `PUBLIC_MAPS_EMBED_KEY` juga belum dibuat.

## Keputusan
- Iframe dibuat oleh `IntersectionObserver` saat area peta masuk layar, bukan lewat atribut `loading="lazy"`, karena browser memuat iframe lazy jauh sebelum terlihat (US-03.AC3).
- Bila iframe belum selesai dimuat dalam 10 detik, iframe dibuang dan tampil alamat serta pesan kasus tepi 7.3.
- Tanpa kunci, peta tidak disematkan; alamat dan pesan yang sama tampil sejak awal.
- Isi pencarian peta diambil dari parameter `destination` di tautan Maps outlet. Tautan pendek memakai nama dan alamat outlet.

## Alasan dan konsekuensi
- Kunci yang salah atau diblokir domainnya membuat Google menampilkan halaman galatnya sendiri di dalam iframe, dan itu tidak terdeteksi. Cek peta setelah deploy preview.
- Alamat dan tombol "Petunjuk Arah" ada di luar area peta, jadi pengunjung tetap bisa berangkat apa pun keadaan petanya.
- Embed tanpa kunci (`output=embed`) ditolak karena bukan API resmi.
