# Prompt AI: Generate UI/UX Landing Page ManA Social Cafe

> **Cara pakai**
> 1. Salin semua isi file ini, mulai dari bagian "PROMPT" sampai akhir, ke tool AI desain atau coding (Claude, Claude Design, v0, Lovable, Bolt, Figma Make, Cursor).
> 2. Lampirkan dua file referensi bila tool-nya menerima lampiran: logo `manA Social Cafe` (PNG) dan `Menu_Digital_ManA_Social_Cafe.pdf`.
> 3. AI akan bekerja per ronde dan berhenti di setiap tanda **[STOP]** untuk menunggu pilihanmu. Jawab dengan huruf opsi (A, B, atau C) atau beri koreksi.
> 4. Sumber isi prompt: PRD Website ManA Social Cafe v1.0 (26 Nov 2026), laporan riset, dan menu digital Juni 2026. Data cottage masih DUMMY.

---

## PROMPT

### 1. Peran dan tugas

Kamu adalah product designer senior sekaligus front-end engineer. Tugasmu merancang dan membangun UI/UX website landing page **ManA Social Cafe**, merek kafe di Bandung dengan dua outlet: **Buah Batu** (kafe kota) dan **Dago** (kafe dengan view kota dan 6 cottage).

Hasil akhirnya adalah halaman yang terlihat dibuat khusus untuk ManA, bukan template kafe generik. Kerjakan dengan metode **rule of three**: setiap ronde desain menghasilkan tepat 3 opsi, lalu saya yang memilih. Jangan memilih untuk saya, dan jangan lanjut ke ronde berikutnya sebelum saya menjawab di setiap **[STOP]**.

Bahasa untuk semua teks UI: **Bahasa Indonesia**, santai dan sopan, memakai "kamu".

### 2. Konteks bisnis (ringkas)

- **Masalah yang diselesaikan:** ManA belum punya website. Info resmi hanya ada di bio Instagram @mana.bandung (sekitar 57 ribu pengikut). Di internet beredar lima versi jam buka dan menu tahun 2023 yang sudah usang. Publik juga sering mencampur data kedua outlet.
- **Tujuan website:** menjadi satu sumber resmi untuk jam, menu, lokasi, dan kontak, lalu mengarahkan pengunjung ke empat aksi:
  1. **Petunjuk Arah** (Google Maps), konversi utama
  2. **Chat WhatsApp** untuk reservasi dan pertanyaan grup
  3. **Kirim permintaan booking cottage Dago** lewat WhatsApp
  4. **Pesan di GoFood** (Buah Batu)
- **Daya tarik nomor satu ManA adalah ruangnya.** Outlet Buah Batu punya bangunan dua lantai dengan void (lubang) melingkar di tengah, tribun setengah lingkaran semi-outdoor di lantai 2, banyak tanaman gantung, dan cahaya alami. Outlet Dago punya view lampu kota, jendela besar, dan movie night "Teras Mana Cinema".
- **Kejujuran adalah nilai jual.** Website harus terang-terangan soal kekurangan yang sering dikeluhkan: tanpa AC (terasa panas menjelang siang), zona merokok di lantai 1, dan parkir mobil terbatas.

### 3. Pengguna (persona)

| Persona | Siapa | Yang dicari di website | Pemicu batal datang |
|---------|-------|------------------------|---------------------|
| Nadia, 22 | Mahasiswi, datang dari TikTok atau Instagram, memakai ponsel Android | Foto ruang, harga menu, jam buka, lokasi | Panas siang hari, antre akhir pekan |
| Raka, 27 | Desainer freelance, kerja dari kafe (WFC) 3 jam | WiFi, colokan, area tanpa rokok, jam buka pagi | Asap rokok, tidak ada info fasilitas |
| Dimas, 30 | Koordinator komunitas, 10–30 orang | Kapasitas, cara reservasi grup lewat WhatsApp | Tidak ada respons atau info grup |
| Sari dan Bima, 29 | Pasangan dari Jakarta, staycation | Tipe cottage, harga, cara booking | Info kamar dan harga tidak jelas |
| Staf ManA | Mengelola konten lewat CMS | Mengubah harga, jam, dan foto tanpa developer | (pengguna CMS, bukan desain publik) |

Prioritas desain: **mobile-first**. Mayoritas pengunjung datang dari media sosial di ponsel.

### 4. Arah desain (wajib diikuti)

**Design Read:** landing page merek kafe untuk anak muda Bandung dan tamu cottage, dengan identitas kuning-hitam yang berani di atas fotografi ruang yang tenang.

**Dial:** ENERGY 2 / RHYTHM 2 / MOTION 1

| Dial | Nilai | Artinya untuk proyek ini |
|------|-------|--------------------------|
| ENERGY | 2 (seimbang) | Kuning dan huruf condensed boleh berani, tetapi tidak boleh mengalahkan foto ruang |
| RHYTHM | 2 (variasi antarbagian) | Bagian beranda isinya berbeda (outlet, menu, galeri, cottage), jadi komposisinya juga berbeda, di atas grid yang sama |
| MOTION | 1 (fungsional) | Animasi hanya untuk umpan balik: tekan tombol, buka galeri, gulir ke kategori. Tidak ada animasi yang berulang terus |

**Identitas:** sosial, hangat, jujur. Hindari kesan mewah, korporat, dan "template AI".

**Palet** (diambil dari menu digital; konfirmasi akhir masih menunggu pemilik):

| Peran | Hex | Aturan pemakaian |
|-------|-----|------------------|
| Teks dan latar gelap | `#2D2C1E` | Teks utama, latar footer |
| Latar netral | `#EFEFEF` | Latar halaman |
| Kartu | `#FFFFFF` | Permukaan kartu |
| Aksen merek | `#DACF56` (kuning zaitun) | Hanya di tombol utama, chip outlet aktif, pita judul kategori menu, dan latar hero cadangan. Teks di atasnya selalu `#2D2C1E` (kontras sekitar 8,8:1). **Teks putih di atas kuning dilarang** |
| Pendukung | `#ECE7AA` (krem) | Motif garis bergelombang, placeholder foto |

Catatan: file logo memakai kuning lebih terang `#F9EE54`. Pakai `#DACF56` sebagai default dan siapkan token `--color-brand` agar mudah diganti.

**Tipografi:**
- Judul: **Anton** (Google Fonts), huruf kapital untuk judul bagian.
- Teks: **Acumin Variable Concept** (Adobe Fonts) jika ada lisensi web; cadangan **Archivo**.
- Skala: 14 / 16 / 20 / 28 / 40 / 64 px.

**Logo:** wordmark `manA` (m-a-n huruf kecil, A kapital) hitam tebal, dengan "Social" rata kiri dan "Cafe" rata kanan di bawahnya. Jangan digambar ulang dan jangan diubah penulisannya. Pakai file yang dilampirkan; bila tidak ada, tampilkan placeholder berlabel `[LOGO]`.

**Motif identitas (pembeda dari kafe lain):**
1. Ilustrasi line-art orang yang sedang bersosialisasi (dipakai di sampul menu dan sablon gelas).
2. Pola garis bergelombang krem `#ECE7AA` dari sampul menu.

Pakai motif ini di satu atau dua tempat yang bermakna, misalnya hero cadangan, pembatas bagian, atau halaman 404. Jangan ditaburkan di setiap bagian.

**Fotografi:**
- Hero dan galeri: foto ruang dengan cahaya alami, seperti void melingkar dilihat dari bawah ke langit, tribun lantai 2, tanaman, dan view kota Dago.
- Menu: foto produk berlatar terang dengan bayangan tegas, seperti di menu digital.
- Foto ruang profesional belum tersedia. Pakai kotak placeholder berwarna `#ECE7AA` dengan label `[FOTO RUANG: deskripsi]`. Jangan pakai foto stok dan jangan membuat foto palsu.

**Ikon:** garis 1,5 px, ukuran 20/24 px. Ikon pedas berupa ikon api seperti di menu. Pilih ikon karena relevan, bukan karena default library.

### 5. Halaman dan keputusan pengguna

Setiap halaman dibangun di sekitar **satu keputusan** pengguna. Titik fokus melayani keputusan itu.

| ID | Halaman | Keputusan pengguna | Titik fokus |
|----|---------|--------------------|-------------|
| S-01 | Beranda | Outlet mana yang saya datangi? | Dua kartu outlet dengan status buka |
| S-02 | Outlet Buah Batu | Datang sekarang atau hubungi dulu? | Status buka + tombol "Petunjuk Arah" |
| S-03 | Outlet Dago dan Cottage | Datang ke kafe atau booking cottage? | Kartu tipe cottage + form permintaan booking |
| S-04 | Menu Buah Batu | Apa yang mau saya pesan dan berapa biayanya? | Navigasi kategori + daftar item dengan harga |
| S-05 | FAQ | Apakah outlet cocok dengan kebutuhan saya? | Daftar pertanyaan |
| S-07 | 404 | Ke mana saya kembali? | Tombol "Kembali ke Beranda" |

(S-06 adalah Studio CMS untuk staf dan tidak perlu didesain.)

**Navigasi:** logo di kiri, lalu Buah Batu, Dago dan Cottage, Menu, FAQ. Di ponsel, item ini masuk ke tombol menu. Tombol WhatsApp melayang di kanan bawah semua halaman publik. Footer berisi alamat dan jam kedua outlet, Instagram, dan tautan kebijakan privasi. Setiap item navigasi wajib punya tujuan yang benar-benar ada.

**Urutan bagian Beranda (S-01).** Setiap bagian ada karena kontennya ada:

| Bagian | Isi | Status |
|--------|-----|--------|
| Hero | Logo, satu kalimat positioning, foto ruang, tombol "Lihat Menu" dan "Pilih Outlet" | Wajib. Kalimat positioning belum ada: pakai `[KALIMAT POSITIONING]` |
| Pilih outlet | Dua kartu outlet: nama, alamat, jam hari ini, status buka, tombol ke halaman outlet | Wajib |
| Rekomendasi menu | 4–6 item dengan foto, nama, harga, label "Must Try" atau "New Menu" | Opsional |
| Galeri | 6–9 foto ruang dari kedua outlet | Wajib |
| Teaser cottage Dago | 1 foto, "mulai Rp850.000/malam" (DUMMY), tombol ke S-03 | Wajib |
| Tentang ManA | Maksimal 120 kata dari pemilik | Opsional: placeholder `[TEKS DARI PEMILIK]` |
| Ulasan | Rating 4,7 dari 835 ulasan Google (Buah Batu) dan 4,6 dari 1.895 ulasan (Dago) + 3 kutipan ulasan | Kutipan: `[ULASAN GOOGLE ASLI + NAMA + TAUTAN]` |
| Footer | Alamat, jam, Instagram, privasi | Wajib |

Kamu boleh mengubah urutan bila ada alasan yang ditulis, tetapi tidak boleh menambah bagian yang tidak ada kontennya, misalnya statistik, logo mitra, "Dipercaya oleh", atau "Cara kerja 3 langkah".

### 6. Konten nyata yang wajib dipakai

**Outlet**

| | ManA Buah Batu | ManA Dago |
|---|---|---|
| Alamat | Jl. Buah Batu No.127, Cijagra, Lengkong, Bandung 40265 | Jl. Cibengang No.21, Ciburial, Cimenyan, Kab. Bandung |
| Jam | Setiap hari 08.00–23.00 WIB | Setiap hari 11.00–22.00 WIB |
| Karakter | Kafe kota, dua lantai, void melingkar, tribun lantai 2 | Kafe view lampu kota, 6 cottage, movie night |
| Fasilitas | WiFi, stopkontak, mushola, toilet, zona merokok lantai 1, area tanpa rokok lantai 2, **Tanpa AC**, parkir motor (mobil terbatas) | `[FASILITAS DAGO DARI PEMILIK]` |
| Delivery | GoFood: `[URL GOFOOD]` | Belum diketahui |

**Kontak:** WhatsApp `+62 857-2478-5388` (sementara untuk semua outlet). Instagram `@mana.bandung`.

**Pesan WhatsApp otomatis** (wajib menyebut outlet):
- Tombol umum di halaman Buah Batu: `Halo ManA Buah Batu, saya ingin bertanya. (dari website)`
- Tombol umum di halaman Dago: `Halo ManA Dago, saya ingin bertanya. (dari website)`
- Form cottage: `Halo ManA Dago, saya ingin booking {tipe} untuk {tamu} tamu, check-in {tgl}, check-out {tgl} ({n} malam). (dari website)`

**Status buka** (dihitung dalam WIB):
- `Buka, tutup pukul 23.00`
- `Segera tutup, tutup pukul 23.00` (30 menit terakhir)
- `Tutup, buka pukul 08.00`

**Cottage Dago: DATA DUMMY.** Setiap kartu wajib diberi label kecil "Data contoh".

| Tipe | Kapasitas | Harga per malam | Fasilitas |
|------|-----------|-----------------|-----------|
| Couple Cottage | 2 tamu | Rp850.000 | Kasur queen, kamar mandi dalam, air panas, WiFi |
| Family Cottage | 4 tamu | Rp1.350.000 | 2 kasur, kamar mandi dalam, air panas, WiFi |

Check-in 15.00, check-out 12.00. Total 6 unit.

**Form permintaan booking cottage:**
- Kolom: tipe kamar, tanggal check-in, tanggal check-out, jumlah tamu.
- Aturan: check-in paling cepat hari ini; check-out setelah check-in; 1–14 malam; jumlah tamu tidak melebihi kapasitas.
- Sebelum dikirim, tampilkan ringkasan: `Estimasi Rp2.700.000 untuk 2 malam. Harga final dikonfirmasi lewat WhatsApp.`
- Tombol: `Kirim via WhatsApp`. Tidak ada data yang disimpan di server.

**Menu Buah Batu (resmi, Juni 2026):** 19 kategori, 75 item, Rp13.000–57.000. Data lengkapnya ada di **Lampiran A**. Format harga `Rp28.000`. Item tanpa harga tampil `Tanya barista`. Pakai penanda: ikon pedas, label "New Menu", "Must Try", "Now Blooming", dan chip "Add-On".

### 7. Status UI dan teks yang wajib didesain

| Konteks | Teks yang tampil |
|---------|------------------|
| Tombol utama hero | Lihat Menu |
| Tombol kedua hero | Pilih Outlet |
| Tombol peta | Petunjuk Arah |
| Tombol WhatsApp melayang | Chat WhatsApp |
| Tombol GoFood | Pesan di GoFood |
| Outlet tutup sementara | Tutup sementara. Info terbaru di Instagram @mana.bandung. |
| Jam belum diisi | Jam hari ini belum tersedia. Tanyakan lewat WhatsApp. |
| Peta gagal dimuat | Peta tidak dapat dimuat. Gunakan tombol Petunjuk Arah. |
| Item menu habis | Sedang tidak tersedia |
| Menu Dago belum ada | Menu ManA Dago sedang disiapkan. Tanyakan menu hari ini lewat WhatsApp. |
| Form cottage: tanggal terbalik | Tanggal check-out harus setelah check-in. |
| Form cottage: tamu berlebih | Family Cottage menampung maksimal 4 tamu. |
| Form cottage: tanggal lampau | Tanggal check-in paling cepat hari ini. |
| Form cottage: terlalu lama | Untuk lebih dari 14 malam, hubungi kami lewat WhatsApp. |
| Form cottage: kolom kosong | Lengkapi tipe kamar, tanggal, dan jumlah tamu. |
| Banner cookie | Kami memakai cookie analitik untuk tahu tombol mana yang paling dipakai. Kamu bisa menolak. [Setuju] [Tolak] |
| Halaman 404 | Halaman ini tidak ada. Kembali ke Beranda untuk memilih outlet. |

Aturan teks: tanpa emoji, tanpa tanda pisah panjang, tanpa jargon pemasaran ("terbaik", "premium", "pengalaman tak terlupakan"). Pesan kesalahan selalu menyebut penyebab dan langkah berikutnya.

**Interaksi dan gerak (MOTION 1):**

| Interaksi | Perilaku |
|-----------|----------|
| Tekan tombol | Latar menggelap 8% selama 120 ms |
| Klik kategori menu | Gulir ke kategori dalam 300 ms; lompat langsung jika `prefers-reduced-motion` |
| Galeri layar penuh | Fade 150 ms; bisa digeser; ditutup dengan tombol "Tutup" atau Escape |
| Validasi form | Pesan muncul tanpa animasi saat kolom kehilangan fokus |

**Responsif:**

| Lebar | Perubahan |
|-------|-----------|
| < 640 px | Satu kolom; kartu outlet bertumpuk; navigasi kategori menu bergulir horizontal dan menempel di atas |
| 640–1023 px | Kartu outlet berdampingan; galeri 2 kolom |
| >= 1024 px | Lebar konten maksimal 1200 px; galeri 3 kolom; navigasi kategori menu di sisi kiri |

### 8. Alur kerja: rule of three

Tampilkan di awal setiap balasan di posisi mana kamu berada, misalnya: `Ronde 1 · Arah desain (melebar)`.

**Ronde 1: Tiga arah desain untuk Beranda (S-01)**
Buat 3 arah yang lengkap, berkualitas tinggi, dan setia pada brief: prioritas konten sama, aksi utama sama. Ketiganya berbeda dalam:
- **Tata letak:** cara mengekspresikan prioritas "pilih outlet"
- **Bahasa visual:** porsi kuning, kepadatan, bentuk, cara memakai foto
- **Signature:** satu elemen yang membuat desain ini milik ManA, misalnya bentuk lingkaran yang meniru void bangunan Buah Batu, ilustrasi line-art, atau pola garis krem

Beri setiap arah nama, satu kalimat ide, persona yang paling terlayani, dan trade-off-nya.
**[STOP]** Tunggu saya memilih A, B, atau C, atau menolak ketiganya. Jika ditolak, tanyakan apa yang salah dari masing-masing, lalu buat 3 arah baru tanpa mengulang ide yang ditolak.

**Ronde 2: Tiga variasi dari arah terpilih**
Bahasa desainnya sama. Jangan membuat versi yang lebih aman, dan jangan membuat arah baru. Setiap variasi mendorong satu hal lebih jauh:
- **Hierarki:** fokus lebih tajam ke kartu outlet dan tombol "Petunjuk Arah"
- **Signature:** interaksi, gerak tata letak, atau detail yang lebih khas
- **Craft:** tipografi, spasi, ritme, dan detail kecil yang lebih halus

**[STOP]** Tunggu saya memilih pemenang atau menyebut elemen yang ingin digabung.

**Ronde 3: Kritik dan perbaikan**
Kritik desain terpilih dengan jujur:
- Apakah aksi utama paling jelas di layar?
- Apakah urutan konten sesuai bagian 5?
- Apakah status kosong, memuat, dan error sudah didesain?
- Kontras WCAG 2.2 AA, target sentuh minimal 44x44 px, focus state terlihat, ukuran teks minimal 16 px untuk isi
- Perilaku di tiga breakpoint
- Ceklis anti-slop di bagian 9

Urutkan masalah berdasarkan tingkat keparahan, beserta usulan perbaikan.
**[STOP]** Terapkan hanya perbaikan yang saya setujui.

**Ronde 4: Kunci design system**
Ubah layar yang disetujui menjadi design system: token warna beserta perannya, skala tipe, skala spasi, radius (maksimal 3 nilai), elevasi (maksimal 2 level), gaya ikon, dan komponen inti dengan semua state-nya. Komponen inti mencakup tombol, input tanggal, select, kartu outlet, kartu menu, kartu cottage, chip, navigasi, dan tombol WhatsApp melayang. Sertakan panduan pemakaian singkat.

**Ronde 5: Gulirkan ke semua halaman**
Kerjakan sesuai urutan perjalanan pengguna: S-02, S-04, S-03, S-05, S-07.
- **Halaman kunci** (S-03 dan S-04): 3 variasi di dalam design system. **[STOP]** Saya memilih.
- **Halaman pendukung** (S-02, S-05, S-07): satu versi masing-masing.

Setiap beberapa halaman, cek konsistensi semua halaman yang sudah disetujui. Akhiri dengan semua halaman pemenang sesuai urutan perjalanan, dengan alur utama yang bisa diklik: Beranda, lalu outlet, lalu Petunjuk Arah atau WhatsApp.

### 9. Aturan anti-slop (wajib)

Desain gagal jika memakai salah satu pola ini tanpa alasan tertulis yang terkait dengan ManA.

**Dilarang:**
- Gradient biru-ungu, ungu-pink, atau neon; glow atau orb blur di belakang hero
- Glassmorphism di banyak elemen (maksimal 1 elemen, dengan alasan)
- Semua elemen berbentuk pil; bayangan besar di semua kartu; glow di mana-mana
- Background grid atau dot grid dekoratif
- Dark mode tanpa alasan (proyek ini memakai tema terang)
- Lebih dari 3 warna inti + 1 aksen; kuning dipakai di semua elemen
- Bento grid, deretan kartu fitur identik dengan ikon, "Cara kerja 3 langkah"
- Bilah "Dipercaya oleh" atau logo media yang tidak terkonfirmasi
- Badge kapsul di atas judul H1; titik status yang berkedip tanpa menandai apa pun
- Emoji di judul, tombol, atau daftar; panah kecil di setiap tombol
- Garis warna di tepi kiri kartu sebagai hiasan
- Ilustrasi stok (Undraw, Storyset, karakter 3D) yang tidak terkait ManA
- Animasi berulang terus (pulse, float, bounce); fade-up di setiap elemen
- Angka statistik, testimoni, nama orang, atau ulasan karangan. Pakai `[REAL DATA]` atau placeholder berlabel
- Isian palsu seperti "John Doe" atau "johndoe@example.com". Placeholder form harus jujur, misalnya `Pilih tanggal`
- Navigasi atau tombol tanpa tujuan; tombol yang tidak berfungsi

**Wajib:**
- Aksen kuning hanya di momen kunci (tombol utama dan chip aktif)
- Variasi komposisi antarbagian sesuai RHYTHM 2: selang-seling bagian berat teks dan berat visual
- Ruang kosong sebagai struktur, dengan skala spasi bertingkat, bukan satu nilai seragam
- Semua gambar punya `width` dan `height` atau `aspect-ratio`; foto hero dimuat di HTML dengan `fetchpriority="high"` dan tanpa lazy-load; gambar di bawah layar pertama memakai lazy-load
- Peta Google dimuat hanya saat pengunjung menggulir ke area peta
- Script analitik baru dimuat setelah pengunjung menekan "Setuju" dan tidak memblokir render
- Ketersediaan fasilitas dibedakan dengan ikon dan teks, bukan warna saja

### 10. Kualitas teknis (jika membangun kode)

- Stack yang direkomendasikan PRD: **Astro 5 + TypeScript strict**, CSS custom properties untuk token, konten dari Sanity. Untuk prototipe boleh memakai data statis JSON dari Lampiran A.
- Target: LCP <= 2,5 s di ponsel, CLS <= 0,1, INP <= 200 ms, berat awal beranda <= 1,5 MB, skor Lighthouse SEO >= 95, WCAG 2.2 AA.
- Data terstruktur schema.org: `CafeOrCoffeeShop` per outlet, `LodgingBusiness` untuk cottage, `Menu` untuk halaman menu.
- Semua halaman bisa dipakai dengan keyboard saja, dan focus state terlihat jelas.

### 11. Format balasan setiap ronde

1. Header posisi (ronde dan fase).
2. Tiga opsi berlabel **A · [nama]**, **B · [nama]**, **C · [nama]**, masing-masing dengan ide satu kalimat, persona yang paling terlayani, dan trade-off. Pengecualian: ronde dengan satu hasil, yaitu kritik, design system, dan halaman pendukung.
3. Desain atau kode lengkap yang bisa dilihat langsung (artboard, preview, atau file HTML per opsi).
4. Ceklis singkat bagian 9: lulus atau gagal per butir, beserta alasannya.
5. **[STOP]** dengan pertanyaan yang jelas.

Mulai sekarang dari **Ronde 1**.

---

## Lampiran A: Menu resmi ManA Social Cafe Buah Batu (Juni 2026)

Harga dalam ribu rupiah. (P) = pedas. Data ini adalah konten nyata; jangan diubah.

| Kategori | Item dan harga |
|----------|----------------|
| New Menu: Beef | Nasi Beef Oseng Daun Jeruk 45 (P), Nasi Beef Teriyaki 45 |
| New Menu: Light meal | Pisang Madu ManA 29 |
| All About Rice: Asian | Nasi Goreng ManA 40, Pattaya Mango Chicken 39, Chicken Manchurian 39 (P), Chicken Nanban 39 |
| All About Rice: Nusantara | Nasi Goreng Tektek 40 (P), Nasi Goreng Kampung 40, Nasi Ayam Sambal Iris 39 (P), Nasi Ayam Saus Kari 39 |
| The Noodles | Yamien Manis 40, Yamien Asin 40, Mie Tek Tek 39, Mie Kari 39 |
| The Spaghetti | Bolognese 40, Aglio e Olio 40 (P), Carbonara 40 |
| Light Meals | French Fries 30, Cheesy Fries 33, Roti Bakar 29, Tahu Lada Garam 30 (P), Gyoza Chilli Oil 30 (P), Pisang Goreng ManA 29, Bakso Goreng 29, Cireng 29, Mix Platter 57 |
| It's Dessert | Tiramisu 30, Tiramisu Matcha 30, Panna Cotta (strawberry/matcha/chocolate) 26, Fudgy Brownies 30 |
| Coffee: Classic Series (hot/ice) | Black 27, White 28, Flavoured Latte 30, Dirty Latte 30, Filter Coffee biji lokal 32, Filter Coffee biji impor 38, Vietnamese 24 |
| Coffee: Kopsu Series | Es Kopi Susu Mana 28, Es Kopi Susu Original 26, Caramel 28, Seasalt 31, Salted Caramel 31, Cinnamon 32 |
| ManA Black Series (kaleng, "Must Try") | Mango, Apple, Lemon, Lychee, masing-masing 30 |
| Barista Signature V4 | Upside Cloud, Harvest Bloom (harga: Tanya barista) |
| Now Blooming | Biji Strawberry Blossom, upgrade untuk classic coffee +4 |
| Mocktail Session | Berry Bliss 30, Tropical Coco Mango 30, Slow Berry 30, Lemonade Coffee 30, Milkyway 30, Candy Cloud 30, Strawberry Cinnamon (blended) 35 |
| Matcha Series | Mango Midori 38, Dirty Matcha 38, Kyoto Matcha 38 |
| Artisan Tea by TEMA | Hot 28, Iced 28 (varian: tanya barista) |
| ManA Milk (hot/ice) | Choco Candy 30, Chocolate 30, Matcha 30, Red Velvet 30 |
| Yakult Drink | Mixed Berry 28, Green Apple 28, Lychee 28 |
| Others (hot/ice) | Lychee Tea 26, Lemon Tea 26, Thai Tea 26, Milk Tea 26, Tea 23, Air Mineral 550 ml 13 |
| Add-On | Extra shot 5, Oatside (susu oat) 7 |

**Contoh deskripsi** (gaya bahasa menu asli, pakai bila perlu):
- Nasi Goreng ManA: Nasi goreng khas ManA disajikan dengan topping telur, sosis, dan bakso sapi.
- Es Kopi Susu Mana: Palm sugar with vanilla choco ice cream hint.
- Pisang Goreng ManA: Pisang goreng khas ManA yang disajikan dengan parutan keju cheddar dan gula palem.
- Mix Platter: Kombinasi kentang goreng, chicken popcorn, jamur krispi, disajikan dengan saus mayones dan sambal.

## Lampiran B: Placeholder yang masih menunggu data pemilik

Tampilkan placeholder ini apa adanya. Jangan diisi dengan karangan.

| Placeholder | Keterangan |
|-------------|------------|
| `[KALIMAT POSITIONING]` | Kalimat hero dari pemilik |
| `[TEKS DARI PEMILIK]` | Cerita "Tentang ManA" |
| `[FOTO RUANG: ...]` | Foto ruang Buah Batu, Dago, dan cottage |
| `[ULASAN GOOGLE ASLI + NAMA + TAUTAN]` | Kutipan ulasan nyata |
| `[URL GOFOOD]` | Tautan merchant GoFood |
| `[FASILITAS DAGO DARI PEMILIK]` | Fasilitas outlet Dago |
| Data cottage | DUMMY, wajib berlabel "Data contoh" |
| Warna kuning final | `#DACF56` (menu) atau `#F9EE54` (file logo) |
