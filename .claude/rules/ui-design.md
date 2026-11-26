---
paths:
  - "apps/web/src/components/**"
  - "apps/web/src/layouts/**"
  - "apps/web/src/pages/**"
  - "apps/web/src/styles/**"
---

# Aturan UI, teks, dan anti-slop

Sumber: PRD bagian 8 dan brief `docs/prompt-ui-ux-mana-social-cafe.md` bagian 4, 7, dan 9. Bila ragu, baca sumbernya.

## Arah desain

- Dial ENERGY 2 / RHYTHM 2 / MOTION 1. Foto ruang adalah bintangnya; kuning dan huruf condensed tidak boleh mengalahkannya.
- Tema terang saja.
- Warna dan durasi hanya lewat token di `src/styles/tokens.css`. Jangan menulis hex atau milidetik langsung di komponen.
- Kuning `--color-brand` hanya untuk tombol utama, chip outlet aktif, pita judul kategori menu, dan latar hero cadangan. Teks di atas kuning selalu `--color-ink`. Teks putih di atas kuning dilarang.
- Motif identitas (ilustrasi line-art orang, garis bergelombang krem) dipakai di satu atau dua tempat yang bermakna saja, misalnya hero cadangan atau 404.
- Ikon Lucide, garis 1,5 px, ukuran 20 atau 24 px.

## Teks UI

- Bahasa Indonesia santai dan sopan, memakai "kamu".
- Tanpa emoji, tanpa tanda pisah panjang, tanpa jargon pemasaran ("terbaik", "premium", "tak terlupakan").
- Pakai teks persis dari PRD 8.8 dan dari tabel kasus tepi di bagian 7. Jangan memparafrasekan tombol seperti "Petunjuk Arah", "Chat WhatsApp", "Kirim via WhatsApp".
- Jujur soal kekurangan: tulis "Tanpa AC" dan "Zona merokok di lantai 1".
- Pesan kesalahan menyebut penyebab dan langkah berikutnya.
- Konten yang belum ada memakai placeholder berlabel dari Lampiran B, misalnya `[FOTO RUANG: void melingkar Buah Batu]` di kotak `--color-cream`. Jangan memakai foto stok atau isian palsu.

## Dilarang

- Gradient ungu, biru, pink, atau neon; glow atau orb blur.
- Glassmorphism (maksimal satu elemen, dengan alasan tertulis).
- Semua elemen berbentuk pil; bayangan besar di semua kartu.
- Background grid atau dot grid dekoratif.
- Bento grid, deretan kartu fitur identik dengan ikon, "Cara kerja 3 langkah".
- Bilah "Dipercaya oleh", logo media, angka statistik, atau testimoni karangan.
- Badge kapsul di atas H1; titik status berkedip; panah kecil di setiap tombol; garis warna di tepi kiri kartu.
- Animasi berulang (pulse, float, bounce) dan fade-up di setiap elemen.
- Tombol atau tautan navigasi tanpa tujuan nyata.

## Aksesibilitas (WCAG 2.2 AA)

- Kontras teks minimal 4,5:1. Target sentuh minimal 44 x 44 px. Focus state selalu terlihat.
- Isi teks minimal 16 px.
- Ketersediaan (fasilitas, item menu) dibedakan dengan ikon dan teks, bukan warna saja.
- Ikon bermakna punya teks alternatif, misalnya ikon pedas dengan "Pedas".
- Semua interaksi bisa dipakai dengan keyboard: galeri ditutup dengan Escape, FAQ dibuka dengan Enter.
- Hormati `prefers-reduced-motion`: gulir kategori langsung lompat tanpa animasi.

## Responsif (PRD 8.10)

- Di bawah 640 px: satu kolom, navigasi kategori menu bergulir horizontal dan menempel di atas.
- 640 sampai 1023 px: kartu outlet berdampingan, galeri 2 kolom.
- Mulai 1024 px: lebar konten maksimal 1200 px, galeri 3 kolom, navigasi kategori menu di sisi kiri.
