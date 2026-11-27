# 0008: Sumber foto dan fasilitas utama di panel outlet

- Tanggal: 2026-11-27
- Status: diterima
- Rujukan PRD: FR-02, US-01, 11.1 (E-06, E-07)

## Konteks
FR-02 meminta panel outlet berisi foto ruang dan fasilitas utama, tetapi skema tidak punya field khusus untuk "foto panel" maupun penanda "fasilitas utama".

## Keputusan
Foto panel adalah foto galeri outlet dengan `sort_order` terkecil. Fasilitas utama adalah enam fasilitas pertama menurut `sort_order`. Bila belum ada data, panel menampilkan placeholder berlabel.

## Alasan dan konsekuensi
- Tanpa field baru dan tanpa migrasi; staf mengatur keduanya lewat kolom "Urutan".
- Menaruh foto atau fasilitas di urutan teratas juga mengubah panel Beranda. Ini perlu disebut di panduan editor.
- Ikon panel hanya membedakan tersedia dan tidak tersedia. Desain memakai ikon peringatan untuk catatan seperti "Tanpa AC", tetapi skema belum bisa membedakannya. Diputuskan di US-06.
