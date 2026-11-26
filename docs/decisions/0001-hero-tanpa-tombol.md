# 0001: Hero Beranda tanpa tombol "Lihat Menu" dan "Pilih Outlet"

- Tanggal: 2026-11-26
- Status: diterima
- Rujukan PRD: FR-01, US-01.AC1, 8.6, 8.8

## Konteks
FR-01 dan US-01.AC1 meminta hero berisi logo, kalimat positioning, foto ruang, dan dua tombol "Lihat Menu" dan "Pilih Outlet". Di desain, kedua tombol itu mengulang hal yang sudah ada: tautan Menu di navigasi atas dan panel pemilih outlet yang langsung terlihat di bawah hero. Di ponsel, foto ruang di hero membuat panel outlet turun di bawah lipatan.

## Keputusan
Pengguna memilih menghapus kedua tombol hero dan foto ruang di hero ponsel. Hero berisi logo dan kalimat positioning; foto ruang pertama tampil di panel outlet.

## Alasan dan konsekuensi
Satu jalan per aksi, dan panel outlet (keputusan utama di layar pertama) naik ke atas. PRD diperbarui ke v1.1 (2026-11-26) dengan persetujuan pengguna: FR-01, US-01.AC1, kasus tepi 7.1, 8.2, 8.6, dan 8.8. Uji E2E US-01 mengikuti AC versi baru.
