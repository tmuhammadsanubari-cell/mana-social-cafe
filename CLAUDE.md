# ManA Social Cafe: Website Landing Page

Website statis mobile-first untuk merek ManA Social Cafe (Bandung) dengan dua outlet: **Buah Batu** (kafe kota) dan **Dago** (kafe view kota + 6 cottage). Tidak ada server aplikasi, database sendiri, akun pengunjung, atau pembayaran. Konten dikelola staf di Sanity, dibangun jadi HTML statis oleh Astro, dan semua aksi keluar ke wa.me, Google Maps, GoFood, dan Instagram.

## Mulai setiap sesi dari sini

1. Baca [docs/progress.md](docs/progress.md): milestone aktif, story yang sedang dikerjakan, dan jawaban pemilik untuk pertanyaan terbuka.
2. Buka hanya bagian PRD yang relevan (peta di bawah). Jangan membaca PRD utuh.
3. Setelah menyelesaikan story atau mengambil keputusan, perbarui `docs/progress.md`.

## Sumber kebenaran

| File | Isi | Cara pakai |
|------|-----|------------|
| [docs/PRD-mana-social-cafe-v1.0.md](docs/PRD-mana-social-cafe-v1.0.md) | Kebutuhan lengkap (81 KB, 1.200 baris) | Grep judul bagian (`^## 6\.`, `^### 7\.7`) atau ID (`FR-05`, `BR-01`, `US-09.AC3`), lalu Read dengan offset |
| [docs/prompt-ui-ux-mana-social-cafe.md](docs/prompt-ui-ux-mana-social-cafe.md) | Brief UI/UX, konten nyata, **Lampiran A** (menu Juni 2026), **Lampiran B** (placeholder) | Rujukan teks UI, menu, dan aturan anti-slop |
| [docs/progress.md](docs/progress.md) | Status milestone, story, pertanyaan Q-01 sampai Q-12 | Dibaca dan diperbarui tiap sesi |
| [docs/design/](docs/design/README.md) | Hasil desain UI final, design system, 19 tangkapan layar, tautan canvas | Rujukan tampilan saat membangun komponen dan halaman |
| [docs/decisions/](docs/decisions/) | Keputusan teknis yang menyimpang dari PRD atau melengkapinya | Tulis ADR baru bila ada keputusan penting |
| `../Menu Digital ManA Social Cafe.pdf` | Menu cetak asli (31 MB, di luar folder proyek) | Baca per halaman (`pages`), hanya untuk verifikasi harga |

Bila kode dan PRD bertentangan, PRD yang berlaku. Bila PRD sepertinya perlu diubah, tanyakan ke pengguna dulu, jangan langsung mengedit PRD.

### Peta PRD

| Yang dibutuhkan | Bagian PRD |
|-----------------|------------|
| Daftar fitur, prioritas MoSCoW, milestone per fitur | 4.4 |
| Kebutuhan fungsional FR-01 sampai FR-21 | 5 |
| Aturan bisnis BR-01 sampai BR-07 beserta contoh | 6 |
| Story, acceptance criteria, kasus tepi per fitur | 7.1 sampai 7.10 |
| Design Read, palet, tipografi, layar S-01 sampai S-07, teks UI, responsif | 8 |
| Alur pengguna dan booking cottage | 9 |
| Target performa, aksesibilitas, SEO (NFR) | 10 |
| Entitas E-01 sampai E-12 dan skema field | 11 |
| Operasi CMS, integrasi, background job | 12 |
| Stack, struktur folder, variabel lingkungan, standar kode | 13 |
| Keamanan dan privasi | 14 |
| Level pengujian, definition of done, gerbang rilis | 15 |
| Event analitik GA4 | 17 |
| Milestone M-01 sampai M-04 | 18 |
| Pertanyaan terbuka Q-01 sampai Q-12 | 20.3 |
| Matriks keterlacakan FR ke story, layar, entitas | 21 |

## Struktur folder

```text
.
├── CLAUDE.md                  # file ini
├── README.md
├── docs/
│   ├── PRD-mana-social-cafe-v1.0.md
│   ├── prompt-ui-ux-mana-social-cafe.md
│   ├── progress.md            # pelacak kerja lintas sesi
│   ├── design/                # hasil desain UI: README, design system, tangkapan layar
│   └── decisions/             # ADR
├── apps/
│   ├── web/                   # Astro (punya CLAUDE.md sendiri)
│   │   ├── src/
│   │   │   ├── assets/brand/  # logo, ilustrasi line-art, motif garis krem
│   │   │   ├── components/
│   │   │   ├── layouts/
│   │   │   ├── lib/           # logika BR-01..BR-05, murni dan teruji
│   │   │   ├── pages/
│   │   │   └── styles/tokens.css
│   │   └── tests/{unit,e2e}/
│   └── studio/                # Sanity Studio (punya CLAUDE.md sendiri)
│       └── schemas/
├── seed/                      # data awal untuk impor ke Sanity
├── .github/workflows/         # CI (bagian 16.2 PRD)
└── .claude/
    ├── rules/ui-design.md     # aturan UI, teks, anti-slop; aktif untuk file tampilan
    └── skills/implement-story # /implement-story US-xx
```

## Stack

Astro 7 + TypeScript 6 `strict`, Sanity (Studio di-hosting Sanity), CSS custom properties tanpa framework CSS, Vitest, Playwright (Chromium, WebKit, Firefox), axe-core, Lighthouse CI, GA4 dengan Consent Mode v2, hosting Netlify atau Vercel.

Versi dan batas paket gratis dicek di M-01: lihat [ADR 0005](docs/decisions/0005-versi-stack-m01.md). Paket gratis Sanity tidak punya peran Editor, jadi pembatasan Editor dibuat di Studio: lihat [ADR 0006](docs/decisions/0006-peran-editor-sanity-gratis.md). Node 24 (`.nvmrc`), npm workspaces.

## Perintah

Jalankan dari root proyek.

| Tujuan | Perintah |
|--------|----------|
| Dev server web | `npm run dev` |
| Uji unit (web dan Studio) | `npm run test` |
| Uji E2E (data uji tetap, ADR 0007) | `npm run test:e2e` (pertama kali: `npx playwright install chromium firefox webkit` di `apps/web`). Tanpa unduhan: set `PLAYWRIGHT_CHANNEL=chrome` lalu `npm run test:e2e -- --project=chromium` |
| Lint, format, type check | `npm run lint`, `npm run format:check`, `npm run typecheck` |
| Semua pemeriksaan CI lokal | `npm run check` |
| Build produksi (`BUILD_ENV=production`) | `BUILD_ENV=production npm run build` |
| Dev Studio | `npm run dev:studio` |
| Deploy Studio ke sanity.studio | `npm run deploy -w apps/studio` |
| Impor data awal ke Sanity | `npm run seed` (isi `apps/studio/.env` dan `npx sanity login` dulu) |

## Aturan kerja

- **Jangan mengarang konten.** Kalimat positioning, teks Tentang ManA, ulasan, foto ruang, URL GoFood, dan fasilitas Dago belum ada. Pakai placeholder berlabel dari Lampiran B, misalnya `[KALIMAT POSITIONING]`. Ulasan hanya dari sumber nyata dengan tautan (BR-07).
- **Data cottage adalah DUMMY.** Simpan dengan `is_placeholder = true`. Build produksi wajib gagal selama data ini masih ada (BR-06).
- **Tanpa nilai ajaib.** Nomor WhatsApp, URL, dan teks pengaturan diambil dari `SiteSettings` di CMS. Warna, durasi animasi, dan ukuran diambil dari `tokens.css`.
- **Waktu selalu WIB (UTC+7)**, apa pun zona waktu browser (US-02.AC4).
- **Privasi:** tidak ada data pribadi yang dikirim ke server mana pun. Analitik baru dimuat setelah pengunjung menekan "Setuju".
- **Lacak ke PRD.** Sebut ID di nama uji (`it("US-02.AC2: ...")`), di komentar bila perlu alasan, dan di pesan commit.
- **Commit** memakai Conventional Commits, misalnya `feat(web): status buka outlet (FR-03, BR-01)`.
- **Definition of done** (PRD 15): semua AC story lulus, uji unit dan E2E ditulis, lint dan type check hijau, `docs/progress.md` diperbarui.

## Bahasa

- Teks UI dan dokumentasi: Bahasa Indonesia, santai dan sopan, memakai "kamu".
- Kode, nama file, nama komponen, dan nama field skema: bahasa Inggris sesuai PRD (`Outlet`, `MenuItem`, `openStatus.ts`).
