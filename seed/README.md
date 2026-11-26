# seed

Data awal yang diimpor ke Sanity saat M-01 (PRD 11.5). Skrip impor dijalankan ke dataset `staging` lebih dulu.

| File | Isi | Sumber | Status |
|------|-----|--------|--------|
| `menu-buah-batu-2026-06.json` | 19 kategori dan 75 item menu Buah Batu | Lampiran A di `docs/prompt-ui-ux-mana-social-cafe.md` (dari menu digital Juni 2026) | ada; deskripsi baru 4 item, lihat di bawah |
| `images/menu/` | 58 foto produk WebP dan `manifest.json` (nama file ke nama item) | Dipotong dari PDF menu Juni 2026 saat desain | ada, hanya untuk pengembangan sampai Q-07 dijawab |
| `cottage-dummy.json` | Couple Cottage dan Family Cottage, semua `is_placeholder: true` | PRD 7.7 | ada |
| `site-base.json` | Dua outlet, jam buka 7 hari, Pengaturan Situs | PRD 11.3, US-03, BR-03, US-10, ADR 0002 | ada |

## Aturan data

- Nama field mengikuti skema PRD 11.3: `price_idr`, `is_spicy`, `is_new`, `badge`, `is_available`, `is_recommended`, `sort_order`.
- `price_idr` berupa integer rupiah penuh (`28000`, bukan `28`). Lampiran A menulis harga dalam ribuan, jadi kalikan 1.000.
- Item tanpa harga (Upside Cloud, Harvest Bloom) memakai `price_idr: null`, yang nanti tampil "Tanya barista".
- Teks nama dan deskripsi disalin persis dari menu cetak. Jangan memperbaiki ejaan atau gaya bahasanya.

## Cara hitung menu

Sudah dicocokkan dengan PDF (2026-11-26): 31 makanan + 44 minuman = 75 item dalam 19 kategori. Add-On (2 entri) disimpan sebagai chip, bukan item. Now Blooming adalah catatan di Classic Series, bukan kategori. Lihat `docs/progress.md`.

## Impor

Dari root proyek, setelah `apps/studio/.env` terisi dan `npx sanity login` dari `apps/studio`:

```sh
npm run seed                          # buat dokumen yang belum ada; isian staf tidak tersentuh
npm run seed:replace                  # timpa semua dokumen seed dengan isi file
```

ID dokumen tetap (`menuItem-buah-batu-nasi-goreng-mana`, `outlet-dago`), jadi impor ulang tidak menggandakan. Foto produk hanya diunggah bila dataset bukan `production` (Q-07). Jam buka diisi sama untuk 7 hari karena PRD 11.3 belum membedakan per hari.

## Belum lengkap

- **Deskripsi item:** baru 4 item dari contoh Lampiran A (Nasi Goreng ManA, Es Kopi Susu Mana, Pisang Goreng ManA, Mix Platter). Deskripsi lain ada di PDF menu sebagai gambar dan belum disalin. Staf bisa mengisinya di Studio, atau salin dari PDF lalu jalankan `npm run seed:replace` sebelum ada isian staf.
- **Nama item** mengikuti Lampiran A. Beberapa berbeda dari nama di `images/menu/manifest.json` (misalnya "Aglio e Olio" dan "Spaghetti Aglio e Olio"). Cocokkan dengan PDF bila ada yang perlu disamakan.
- **Biji Strawberry Blossom +Rp4.000** dari Lampiran A disimpan sebagai upgrade di Coffee: Classic Series. Harganya masih ditanyakan di Q-08.
