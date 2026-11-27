# 0010: Peta tersemat memakai OpenStreetMap

- Tanggal: 2026-11-27
- Status: diterima
- Rujukan PRD: FR-04, US-03.AC3, kasus tepi 7.3, 11.3, 12.3, 13.5, 14, R-07

## Konteks
Maps Embed API (ADR 0009) butuh akun penagihan Google Cloud dengan kartu pembayaran, yang belum tersedia. Tanpa kunci, halaman outlet hanya menampilkan pesan peta tidak dapat dimuat.

## Keputusan
Peta di halaman outlet memakai halaman sematan OpenStreetMap (`/export/embed`) dengan penanda di koordinat outlet. Koordinat disimpan di field `latitude` dan `longitude` pada Outlet. Pengguna menyetujui perubahan ini dan PRD naik ke versi 1.2. Tombol "Petunjuk Arah" tetap tautan Google Maps.

## Alasan dan konsekuensi
- Gratis, tanpa kunci, dan tanpa kartu. `PUBLIC_MAPS_EMBED_KEY` dihapus.
- Peta tidak menerima alamat, jadi staf mengisi koordinat di Studio. Bila kosong, hanya alamat yang tampil.
- Nama ManA tidak tertulis di peta, hanya penanda. Di sekitar Dago detail petanya lebih sedikit.
- OpenStreetMap layanan publik tanpa jaminan ketersediaan. Bila lalu lintas situs besar, baca aturan pemakaiannya.
- Peramban pengunjung menghubungi openstreetmap.org saat area peta digulir. Sebutkan di kebijakan privasi (US-13).
- Dari ADR 0009 yang tetap berlaku: iframe dibuat oleh `IntersectionObserver`, dan batas tunggu 10 detik. Pembacaan `destination` dari tautan Maps dan kunci API tidak berlaku lagi.
- Ditolak: menyembunyikan area peta (menghilangkan FR-04).
