---
name: implement-story
description: Kerjakan satu user story PRD ManA (US-01 sampai US-20) dari awal sampai selesai, yaitu membaca AC, menulis uji, implementasi, verifikasi, lalu memperbarui progress. Pakai saat pengguna meminta mengerjakan ID story atau FR, misalnya "kerjakan US-09" atau "implement FR-03".
argument-hint: US-xx atau FR-xx
---

# Implement story: $ARGUMENTS

1. **Cari story-nya.** Bila argumen berupa FR, cari story pasangannya di tabel PRD bagian 5. Grep `#### US-xx` di `docs/PRD-mana-social-cafe-v1.0.md`, lalu baca story itu beserta tabel "Kasus tepi dan status UI" di bawahnya.
2. **Kumpulkan aturan terkait.** Untuk setiap BR yang disebut di baris `Rules`, baca barisnya di PRD bagian 6. Untuk setiap layar di baris `Screens`, cek teks UI di PRD 8.8. Bila story menyentuh CMS, baca skema entitasnya di 11.3.
3. **Cek hambatan.** Buka `docs/progress.md`. Bila story bergantung pada pertanyaan Q-xx yang belum dijawab, pakai placeholder berlabel dan sebutkan hal itu ke pengguna. Jangan mengarang data.
4. **Tulis uji lebih dulu.**
   - Logika di `apps/web/src/lib`: uji Vitest di `apps/web/tests/unit/`, satu kasus per AC dan per contoh BR.
   - Perilaku halaman: spec Playwright di `apps/web/tests/e2e/`, satu `test()` per AC, diberi nama `US-xx.ACn: ...`.
5. **Implementasi** sesuai `apps/web/CLAUDE.md` (lapisan, ukuran file) dan `.claude/rules/ui-design.md` (teks, token, aksesibilitas).
6. **Verifikasi.** Jalankan uji, lint, dan type check dari tabel Perintah di `CLAUDE.md`. Bila perintahnya belum ada, katakan bahwa verifikasi belum bisa dijalankan. Jangan mengklaim lulus.
7. **Perbarui progres.** Ubah status story di `docs/progress.md` dan tambahkan satu baris di "Catatan sesi".
8. **Laporkan** ke pengguna: AC mana yang lulus, mana yang belum, placeholder yang dipakai, dan pertanyaan Q-xx yang perlu dijawab pemilik.
