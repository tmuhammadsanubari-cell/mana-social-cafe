# 0006: Peran Editor di paket gratis Sanity lewat penjaga Studio

- Tanggal: 2026-11-26
- Status: diterima
- Rujukan PRD: 3.1, 12.2 (API-02, API-03), 13.7, 14, US-11.AC3, Q-11

## Konteks
PRD 12.2 meminta peran Editor kustom: boleh membuat, mengubah, dan menerbitkan semua konten kecuali SiteSettings, dan tidak boleh menghapus Outlet. Paket Free Sanity hanya punya peran Administrator dan Viewer (ADR 0005). Peran Editor bawaan baru ada di paket Growth ($15 per kursi per bulan), dan peran kustom hanya di Enterprise.

## Keputusan
Tetap di paket Free. Semua staf yang mengedit diundang sebagai Administrator di Sanity. Studio membedakan "admin situs" lewat daftar ID pengguna Sanity di `SANITY_STUDIO_SITE_ADMIN_IDS`:

- Pengaturan Situs terkunci (read-only) dan tanpa tombol aksi untuk pengguna yang bukan admin situs (US-11.AC3).
- Tombol hapus Outlet disembunyikan untuk pengguna yang bukan admin situs (API-03).
- Alamat halaman (`slug`) Outlet yang sudah terisi hanya bisa diubah admin situs.
- Pengaturan Situs tidak bisa dihapus, diduplikasi, ditarik dari publikasi, atau dibuat baru oleh siapa pun, karena hanya ada satu.

Logikanya ada di `apps/studio/access/` dan diuji di `apps/studio/tests/access.test.ts`.

## Alasan dan konsekuensi
- Ini penjaga antarmuka, bukan kontrol akses server. Staf yang berperan Administrator tetap bisa mengubah SiteSettings lewat API, CLI, atau pengaturan proyek di sanity.io/manage, dan bisa mengelola anggota. Untuk kafe dengan 1 sampai 3 editor, risiko ini dianggap wajar dibanding biaya Growth.
- Pengguna yang bukan admin situs adalah Administrator Sanity, jadi verifikasi dua langkah (PRD 13.7) sebaiknya diwajibkan untuk semua akun, bukan hanya admin.
- Daftar admin memakai ID pengguna, bukan email, karena variabel `SANITY_STUDIO_*` ikut masuk ke bundle Studio yang bisa diunduh publik.
- Uji US-11.AC3 di Studio dilakukan manual dengan dua akun: satu terdaftar di `SANITY_STUDIO_SITE_ADMIN_IDS`, satu tidak.
- Bila pemilik menjawab Q-11 dengan lebih dari 3 editor atau butuh kontrol akses yang sebenarnya, pindah ke Growth dan pakai peran Editor bawaan. Penjaga Studio tetap berguna karena Editor bawaan Growth masih bisa mengubah SiteSettings.
- PRD 12.2 tidak diubah. Implementasinya menyimpang dan dicatat di sini.
