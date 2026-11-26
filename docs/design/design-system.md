# Design system ManA Social Cafe v1

Dikunci di Ronde 4, 2026-11-26. Nilai token ada di [`apps/web/src/styles/tokens.css`](../../apps/web/src/styles/tokens.css); dokumen ini menjelaskan cara memakainya. Gambar: [fondasi](screens/10-design-system-fondasi.jpg), [komponen](screens/11-design-system-komponen.jpg).

## Nama token di canvas dan di kode

Canvas memakai beberapa nama lain. Di kode selalu pakai nama di kolom kanan.

| Canvas | `tokens.css` |
|--------|--------------|
| `--color-paper` | `--color-bg` |
| `--font-text` | `--font-body` |
| `--text-14`, `16`, `20`, `28`, `40`, `64` | `--text-sm`, `base`, `lg`, `xl`, `2xl`, `3xl` |
| `--container: 1240px` (termasuk padding) | `--content-max: 1200px` + `--gutter` |

## Warna

| Token | Nilai | Dipakai untuk | Kontras |
|-------|-------|---------------|---------|
| `--color-ink` | #2D2C1E | Teks utama, tombol gelap, latar cottage dan banner cookie | 8,75:1 di brand |
| `--color-bg` | #EFEFEF | Latar halaman | |
| `--color-surface` | #FFFFFF | Kartu, panel | |
| `--color-brand` | #DACF56 | Tombol utama, chip outlet aktif, hero, pita judul menu (Q-05) | |
| `--color-cream` | #ECE7AA | Motif, placeholder foto, footer, label "Data contoh" | |
| `--color-ink-muted` | #5A5847 | Teks sekunder | 6,25:1 di bg, 7,19:1 di surface, 5,67:1 di cream |
| `--color-line-strong` | #7D7A63 | Garis input dan select | 4,34:1 di surface |
| `--color-line` | #D6D4C4 | Pembatas dekoratif | |
| `--color-line-soft` | #E2E0D2 | Latar nonaktif, garis kartu tipis | |
| `--color-tint` | #F1F0EA | Hover tombol garis dan chip, latar input error | |
| `--color-on-dark` | #EFEFEF | Teks di latar ink | 12,25:1 |
| `--color-on-dark-muted` | #C9C6AF | Teks sekunder di latar ink | 8,17:1 |

Hover dan tekan: `--color-brand-hover` dan `--color-ink-hover` gelap 4%, `--color-brand-press` dan `--color-ink-press` gelap 8% dalam `--duration-press`.

## Tipografi

- Display dan judul: Anton, huruf kapital. Line-height `--leading-display` (1,0) untuk display, `--leading-heading` (1,1) untuk judul.
- Isi: Archivo (atau Acumin bila lisensi ada), line-height `--leading-body` (1,5), minimal 16 px.
- Kicker: 14 px tebal kapital, letter-spacing `--tracking-kicker`.
- Skala di ponsel: display hero dan nama outlet 36 sampai 40 px, h2 28 px.

## Spasi, radius, elevasi

- Spasi 4, 8, 12, 16, 24, 32, 48, 64, 96 px (`--space-1` sampai `--space-24`).
- Radius tiga nilai saja: `--radius-sm` 8 px (item menu ponsel, garis fokus tautan), `--radius-md` 12 px (tombol, kartu, input, chip, foto), `--radius-full` (titik status, WhatsApp ponsel).
- Elevasi dua level saja: `--shadow-1` (panel outlet di atas hero, menu ponsel, daftar select), `--shadow-2` (WhatsApp melayang, banner cookie).
- Fokus: garis 3 px ink dengan jarak 2 px; di latar gelap (`[data-dark]`) garis kuning.

## Komponen dan state

| Komponen | Varian | State | Aturan |
|----------|--------|-------|--------|
| Tombol | Utama (brand), Gelap (ink), Garis, Tautan | default, hover, tekan, fokus, nonaktif (latar line-soft, teks ink-muted) | L 56 px teks 20 px, M 52 px, S 48 px. Satu tombol kuning per layar atau per kartu. Di atas hero kuning pakai varian Gelap |
| Input tanggal | - | kosong ("Pilih tanggal"), terisi ("20 Des 2026"), fokus, error, nonaktif | Label di atas kolom. Error: garis 3 px ink, latar tint, ikon peringatan, pesan tebal di bawah kolom saat kehilangan fokus. Tidak memakai merah |
| Select | Tipe kamar, jumlah tamu | kosong, terbuka (pilihan aktif cream dan tebal), error | Select bawaan browser di ponsel |
| Chip outlet | - | default, aktif (brand), hover (tint), fokus | 48 px, garis 2 px ink, `aria-pressed` |
| Label | Must Try, New Menu, Now Blooming (garis ink), Add-On (ink), Data contoh (cream), Sedang tidak tersedia (bg + ink-muted) | - | 14 px tebal |
| Kartu menu | Kartu foto 3:5 (Beranda), baris daftar (halaman menu) | default, pedas (ikon api + teks "Pedas" untuk pembaca layar), berlabel, tidak tersedia (foto abu + label), tanpa harga ("Tanya barista") | Harga ditulis "Rp28.000" |
| Kartu cottage | - | default, dipilih (garis ink, shadow-1, tombol kuning "Dipilih") | Label "Data contoh" wajib selama BR-06 |
| Kartu outlet | Panel lebar berfoto (Beranda), ringkas (halaman lain) | buka, segera tutup, tutup, tutup sementara, jam kosong | Ikon status penuh, setengah, kosong, selalu dengan teks |
| Navigasi | Desktop (deret tautan), ponsel (tombol Menu) | tertutup, terbuka, halaman aktif (garis bawah 3 px di desktop, cream di ponsel, `aria-current`) | Escape menutup menu ponsel |
| WhatsApp melayang | Desktop berteks, ponsel ikon 56 px | default, fokus, naik di atas banner cookie | Pesan menyebut outlet + "(dari website)". Sembunyikan bila nomor kosong |
| Banner cookie | Desktop satu baris, ponsel bertumpuk | tampil sampai dipilih | "Tolak" dan "Setuju" sama besar. GA4 dimuat setelah Setuju |

## Aturan pakai

- Kuning hanya di tombol utama, chip outlet aktif, hero, dan pita judul menu. Teks di atas kuning selalu ink.
- Motif garis dan ilustrasi orang hanya di hero, pita menu, dan bagian cottage.
- Status dan ketersediaan selalu memakai ikon dan teks, tidak hanya warna.
- Tidak ada gradien, emoji, atau bayangan selain `--shadow-1` dan `--shadow-2`.
- Foto belum ada: kotak cream berlabel `[FOTO RUANG: ...]`, tidak memakai foto stok.
