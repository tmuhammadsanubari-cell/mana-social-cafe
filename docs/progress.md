# Progres proyek

Perbarui file ini setiap kali story selesai, keputusan diambil, atau pemilik menjawab pertanyaan. Claude membaca file ini di awal setiap sesi.

Status: `todo` · `doing` · `done` · `blocked (alasan)`

## Milestone aktif

**M-02 MVP**, target 2026-12-31. M-01 selesai 2026-11-26.

## M-01 Fondasi (target 2026-12-12): selesai 2026-11-26

Kriteria selesai: staf bisa login ke Studio dan mengubah satu harga; 75 item menu terimpor; CI hijau.

| Tugas | Rujukan | Status |
|-------|---------|--------|
| Cek versi stabil Astro, Sanity, dan batas paket gratis; catat ADR | PRD 13.2, A-06, R-07 | done (ADR 0005; Astro 7, PRD 13.2 diubah) |
| `git init` dan push ke GitHub (minta izin pengguna dulu) | PRD 16.2 | done (repo privat `tmuhammadsanubari-cell/mana-social-cafe`) |
| Scaffold `apps/web` (Astro, TypeScript strict) | PRD 13.2, 13.4 | done |
| Scaffold `apps/studio` dan skema E-01 sampai E-12 | PRD 11.3 | done (proyek Sanity `ibk6rfdz`, Studio di https://mana-social-cafe.sanity.studio) |
| Peran Editor dan Administrator di Sanity | PRD 12.2, US-11.AC3 | done di kode (ADR 0006: penjaga Studio di paket gratis); admin situs: `pUPqPqD1Q`; uji manual dua akun menunggu akun staf |
| `seed/menu-buah-batu-2026-06.json` dan skrip impor | PRD 11.5, seed/README.md | done (75 item, 19 kategori, teruji); terimpor ke `staging` 2026-11-26: 113 dokumen, 58 foto |
| `seed/cottage-dummy.json` dengan `is_placeholder = true` | PRD 7.7 | done |
| Token desain di `tokens.css` | PRD 8.2 | done (design system v1, lihat `docs/design/`) |
| Lint, format, type check, Vitest, gitleaks di GitHub Actions | PRD 13.8, 16.2 | done (`.github/workflows/ci.yml`); CI hijau di `main` 2026-11-26 |
| Isi tabel Perintah di `CLAUDE.md` | - | done |
| Buat proyek Sanity, dataset `staging` dan `production`, isi `apps/studio/.env` | PRD 16.1 | done (`ibk6rfdz`, dua dataset publik, login CLI lewat GitHub) |
| Impor seed ke `staging`, deploy Studio | Kriteria M-01 | done (Studio dua workspace: Produksi dan Staging) |
| Uji ubah satu harga di Studio | Kriteria M-01 | done 2026-11-26 (pengguna, Staging: Es Kopi Susu Mana 28000 ke 29000 dan kembali) |
| Undang staf, uji Pengaturan Situs terkunci dengan akun bukan admin | US-11.AC3, ADR 0006 | todo (menunggu editor ditunjuk, Q-11) |
| Impor seed ke `production` | PRD 11.5 | done 2026-11-26 (113 dokumen, 58 foto, `npm run seed:production -w apps/studio`) |
| knip dan jscpd di CI | PRD 13.8 | todo (ditambah saat ada kode di `src/lib`) |

## M-02 MVP, semua fitur Must (target 2026-12-31)

| Tugas fondasi | Rujukan | Status |
|---------------|---------|--------|
| Pembaca konten Sanity saat build, dengan validasi | API-01, PRD 13.6 | done (`apps/web/src/lib/content/`; build dari `staging` berhasil) |
| Header, footer, dan kerangka halaman `/buah-batu`, `/dago`, `/menu` | PRD 8.4, 8.10 | done (tautan FAQ menyusul di US-18, kebijakan privasi di US-13) |
| Playwright, axe, job E2E di CI | PRD 15, ADR 0007 | done; 2026-11-27 CI lulus 51 uji di Chromium, Firefox, dan WebKit (PR #2). Lokal: 17 uji di Google Chrome |
| Lighthouse CI dan deploy preview (Netlify atau Vercel) | Kriteria M-02, PRD 16.1 | todo |
| `placeholderGuard.ts` (build produksi gagal bila ada data contoh) | BR-06 | todo (bersama US-08) |
| knip dan jscpd di CI | PRD 13.8 | todo (`src/lib` sudah ada) |

| Story | Fitur | FR | Status |
|-------|-------|----|--------|
| US-01 | Hero dan pemilih outlet | FR-01, FR-02 | done secara lokal (AC1 sampai AC3 lulus di Chromium); CI tiga browser menunggu push. Kalimat positioning masih sementara (Q-12); foto ruang masih placeholder (Q-06) |
| US-02 | Jam buka dan status buka | FR-03 | done di S-02 dan S-03 (CI lulus 87 uji di tiga browser, PR #3). S-01 terpasang bersama US-01; tautan tanya jam saat jam kosong di US-07 |
| US-03 | Lokasi dan petunjuk arah | FR-04 | todo |
| US-04 | Menu Buah Batu | FR-05 | todo |
| US-05 | Galeri ruang | FR-06 | todo |
| US-06 | Fasilitas outlet | FR-07 | todo |
| US-07 | Tombol WhatsApp | FR-08 | todo |
| US-08 | Info cottage Dago | FR-09 | todo |
| US-09 | Permintaan booking cottage | FR-10 | todo |
| US-10 | Tautan Instagram | FR-11 | todo |
| US-11 | Editor konten | FR-12 | todo |
| US-12 | SEO dan data terstruktur | FR-13 | todo |
| US-13 | Analitik dengan persetujuan cookie | FR-21 | todo |

## M-03 Should, UAT, rilis produksi (target 2027-01-15)

| Story | Fitur | FR | Status |
|-------|-------|----|--------|
| US-14 | Rekomendasi menu | FR-14 | todo |
| US-15 | Testimoni Google | FR-15 | todo |
| US-16 | Tentang ManA | FR-16 | todo |
| US-17 | Tautan GoFood | FR-17 | todo |
| US-18 | FAQ | FR-18 | todo |
| - | Ganti data cottage DUMMY dengan data asli | Q-01 | blocked (menunggu pemilik) |
| - | Gerbang rilis PRD 15 terpenuhi | PRD 15 | todo |

## M-04 Pasca-rilis (target 2027-03-15)

| Story | Fitur | FR | Status |
|-------|-------|----|--------|
| US-19 | Banner promo | FR-19 | todo |
| US-20 | Event dan komunitas | FR-20 | todo |

## Pertanyaan terbuka untuk pemilik

Detail pertanyaan di PRD 20.3. Saat dijawab, tulis jawabannya di sini dan tanyakan ke pengguna apakah PRD perlu diperbarui.

| ID | Topik | Menghambat | Jawaban |
|----|-------|------------|---------|
| Q-01 | Data cottage asli, catatan akses jalan, tautan Trip.com | FR-09, FR-10 | belum |
| Q-02 | Menu Dago | FR-05 | belum |
| Q-03 | Nomor WhatsApp terpisah dan jam balas | FR-08, FR-10 | belum |
| Q-04 | Domain | FR-13 | belum |
| Q-05 | Kuning final #F9EE54 atau #DACF56; lisensi web Acumin | PRD 8.2 | belum |
| Q-06 | Jadwal sesi foto ruang | FR-06 | belum |
| Q-07 | Izin dan file asli foto produk menu | FR-05, FR-14 | belum |
| Q-08 | Pajak di harga; harga Barista Signature V4 dan Strawberry Blossom | FR-05 | belum |
| Q-09 | Akun TikTok resmi | FR-11 | belum |
| Q-10 | URL GoFood; delivery Dago | FR-17 | belum |
| Q-11 | Pemilik produk dan editor konten setelah rilis | FR-12 | belum |
| Q-12 | Kalimat positioning hero | FR-01 | belum dari pemilik. Sementara memakai "Dua tempat ngobrol di Bandung", ditulis Claude atas persetujuan pengguna 2026-11-27; ganti setelah bertemu pemilik |

## Temuan yang perlu dicek

- ~~**Jumlah item menu tidak cocok.**~~ Selesai 2026-11-26 setelah dicocokkan dengan PDF: 31 makanan + 44 minuman = 75 item dalam 19 kategori, sesuai FR-05. Add-On (2 entri) jadi chip, bukan item. Now Blooming jadi catatan di Classic Series, bukan kategori. Dipakai juga untuk seed.
- ~~**Desain menyimpang dari PRD.**~~ PRD diperbarui ke v1.1 pada 2026-11-26 atas persetujuan pengguna (ADR 0001, 0002): hero tanpa tombol, tautan menu PDF, pita kategori di desktop. Dago dua mode (ADR 0003) tidak mengubah PRD.
- ~~**Pemilih outlet di Beranda.**~~ PRD v1.1 mengikuti desain: dua chip dan satu panel (FR-02, US-01.AC2, US-01.AC3, ADR 0004).
- **Foto produk** di `seed/images/menu/` hanya untuk desain dan pengembangan sampai Q-07 dijawab. 2026-11-26: atas keputusan pengguna, foto juga diunggah ke dataset `production` agar pemilik melihat Studio sudah lengkap. Q-07 tetap perlu dijawab sebelum situs publik menampilkan foto ini (ADR 0002).
- **Fasilitas belum ada di Sanity.** Tidak ada dokumen Fasilitas, jadi panel Beranda dari `staging` menampilkan `[FASILITAS ... DARI PEMILIK]`, termasuk Buah Batu yang daftarnya sudah ada di brief. Isi lewat seed di US-06.
- **Galeri dan teaser cottage di Beranda belum punya story.** PRD 8.6 memintanya, tetapi US-05 dan US-08 hanya mencakup halaman outlet. Diputuskan 2026-11-27: dikerjakan bersama US-05 (galeri) dan US-08 (teaser cottage).
- **Foto, video, dan daftar harga cottage** ditambahkan pengguna di `seed/images/cottage/` (18 JPG, 2 MP4, ekspor Instagram, belum di-commit). Dua gambar adalah daftar harga unggahan 2022: Couple 2 orang Rp500.000 (hari kerja) dan Rp600.000 (akhir pekan), Family 4 orang Rp1.000.000 dan Rp1.200.000, harga coret Rp1.000.000 dan Rp2.000.000; Family bisa tambah 2 orang x Rp75.000; fasilitas AC, TV, pemanas air, pengering rambut, handuk, sabun dan sampo, sarapan 2 orang, welcome drink. Ini berbeda dari data DUMMY (Rp850.000 dan Rp1.350.000) dan skema belum membedakan harga hari kerja dan akhir pekan. Data DUMMY tidak diubah sampai pemilik mengonfirmasi (Q-01).
- **Deskripsi menu** di seed baru 4 item (contoh Lampiran A). Sisanya ada di PDF sebagai gambar. Lihat `seed/README.md`.
- **Paket gratis Sanity tanpa peran Editor.** Semua staf jadi Administrator di Sanity; Studio mengunci Pengaturan Situs dan hapus Outlet untuk yang bukan admin situs (ADR 0006). Bila Q-11 butuh kontrol akses sungguhan, pertimbangkan paket Growth.

## Catatan sesi

Tambahkan satu baris per sesi, terbaru di atas: tanggal, yang dikerjakan, yang tersisa.

- 2026-11-27: US-01. Hero tanpa tombol dan pemilih outlet (dua chip, satu panel) di Beranda; `whatsapp.ts` (BR-03, dipakai ulang di US-07); sumber foto dan fasilitas panel di ADR 0008. US-01.AC1 sampai AC3 dan kasus tepi 7.1 lulus (70 uji unit web, 40 uji E2E Chromium; build dari `staging` berhasil). Kalimat pendamping hero dan kicker "Kafe kota" dari desain tidak dipakai karena belum disetujui pemilik. Di branch `feat/us-01-pemilih-outlet`. Berikutnya: US-03.

- 2026-11-27: US-02. `openStatus.ts` (BR-01, WIB), status buka dan tabel jam di `/buah-batu` dan `/dago`. US-02.AC1 sampai AC4 lulus (53 uji unit web, 29 uji E2E Chromium). Kalimat "Jam hari libur dan Ramadan diumumkan di Instagram" dari desain tidak dipakai karena belum dikonfirmasi pemilik. Di branch `feat/us-02-status-buka`. Berikutnya: US-01.

- 2026-11-27: fondasi web M-02. Pembaca Sanity, header, footer, kerangka tiga halaman, data uji tetap (ADR 0007), Playwright dan job `e2e` di CI. Unduhan browser Playwright terlalu lambat, jadi E2E lokal memakai `PLAYWRIGHT_CHANNEL=chrome` (proyek `chromium` saja). US-10 baru sebagian (footer; AC-nya sudah ada di `shell.spec.ts`). Dikerjakan di branch `feat/m02-fondasi-web`. Berikutnya: US-02, lalu US-01.

- 2026-11-26: M-01 selesai. Ketiga kriteria terpenuhi: ubah harga di Studio berhasil (diuji pengguna), 75 item terimpor ke `staging` dan `production`, CI hijau. Catatan: login CLI Sanity wajib lewat GitHub (`npx sanity login --provider github`); akun Google pengguna adalah identitas Sanity lain tanpa akses proyek. Berikutnya: M-02, mulai US-01.

- 2026-11-26: scaffold M-01. npm workspaces, Astro 7 dan Sanity 6 (ADR 0005), skema E-01 sampai E-12, penjaga Editor di Studio (ADR 0006), seed menu 75 item, cottage DUMMY, outlet dan Pengaturan Situs, skrip impor, CI GitHub Actions. Lint, format, type check, 20 uji unit, build web, dan build Studio hijau lokal. Repo privat di GitHub, CI hijau. Lanjutan: proyek Sanity `ibk6rfdz`, dataset `staging` terisi 113 dokumen dan 58 foto, Studio tayang di mana-social-cafe.sanity.studio. Dataset `production` juga terisi, termasuk foto produk atas keputusan pengguna. Tersisa: undang staf dan uji ubah satu harga.

- 2026-11-26: desain UI Ronde 1 sampai 5 selesai di canvas. Disalin ke repo: `tokens.css` (design system v1), `docs/design/` (README, design system, keputusan, 19 tangkapan layar), ADR 0001 sampai 0003, 58 foto produk di `seed/images/menu/`. PRD diperbarui ke v1.1 (FR-01, FR-05, US-01.AC1, US-04.AC5, 8.10). Pemilih outlet chip juga masuk PRD (FR-02, US-01.AC2/AC3, ADR 0004). Tersisa: scaffold M-01.
- 2026-11-26: struktur folder, `CLAUDE.md`, dan dokumen pendukung dibuat. Belum ada kode aplikasi.
