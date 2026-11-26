import { defineField, defineType } from "sanity";
import { isSiteAdmin, parseSiteAdminIds } from "../access/siteAdmin";
import { siteAdminIdsRaw } from "../env";

export const SITE_SETTINGS_ID = "siteSettings";
const ABOUT_MAX_WORDS = 120; // US-16.AC1
const WHATSAPP_PATTERN = /^62\d{8,13}$/;
const GA4_PATTERN = /^G-[A-Z0-9]+$/;
const adminIds = parseSiteAdminIds(siteAdminIdsRaw);

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// E-11 SiteSettings (PRD 11.1). Singleton; hanya admin situs yang boleh mengubah (US-11.AC3, ADR 0006).
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Pengaturan Situs",
  type: "document",
  readOnly: ({ currentUser }) => !isSiteAdmin(currentUser, adminIds),
  fields: [
    defineField({
      name: "whatsapp_number",
      title: "Nomor WhatsApp",
      description: "Format internasional tanpa + dan spasi, misalnya 6285724785388.",
      type: "string",
      validation: (rule) =>
        rule
          .regex(WHATSAPP_PATTERN, { name: "nomor WhatsApp" })
          .error("Tulis nomor diawali 62 tanpa + dan spasi, misalnya 6285724785388."),
    }),
    defineField({
      name: "instagram_url",
      title: "Tautan Instagram",
      type: "url",
      validation: (rule) => rule.required().error("Tautan Instagram wajib diisi."),
    }),
    defineField({
      name: "menu_pdf_url",
      title: "Tautan menu PDF",
      description: 'Kosongkan untuk menyembunyikan tombol "Lihat menu versi PDF".',
      type: "url",
    }),
    defineField({
      name: "about_text",
      title: "Tentang ManA",
      description: `Maksimal ${ABOUT_MAX_WORDS} kata. Kosongkan untuk menyembunyikan bagian ini di Beranda.`,
      type: "text",
      rows: 6,
      validation: (rule) =>
        rule.custom((value: string | undefined) =>
          value && countWords(value) > ABOUT_MAX_WORDS
            ? `Teks Tentang ManA maksimal ${ABOUT_MAX_WORDS} kata.`
            : true,
        ),
    }),
    defineField({
      name: "ga4_measurement_id",
      title: "ID Google Analytics 4",
      description: "Contoh: G-XXXXXXXXXX.",
      type: "string",
      validation: (rule) => rule.regex(GA4_PATTERN, { name: "ID GA4" }).error("Format ID GA4: G-XXXXXXXXXX."),
    }),
  ],
  preview: { prepare: () => ({ title: "Pengaturan Situs" }) },
});
