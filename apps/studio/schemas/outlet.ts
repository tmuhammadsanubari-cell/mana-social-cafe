import { defineField, defineType } from "sanity";
import { isSiteAdmin, parseSiteAdminIds } from "../access/siteAdmin";
import { siteAdminIdsRaw } from "../env";

const NAME_MAX = 40;
const RATING_MAX = 5;
const adminIds = parseSiteAdminIds(siteAdminIdsRaw);

// E-01 Outlet (PRD 11.3)
export const outlet = defineType({
  name: "outlet",
  title: "Outlet",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Alamat halaman",
      description: "Dipakai di URL /buah-batu dan /dago. Jangan diubah setelah website tayang.",
      type: "string",
      options: { list: ["buah-batu", "dago"] },
      readOnly: ({ value, currentUser }) => value != null && !isSiteAdmin(currentUser, adminIds),
      validation: (rule) => rule.required().error("Pilih alamat halaman outlet."),
    }),
    defineField({
      name: "name",
      title: "Nama outlet",
      type: "string",
      validation: (rule) =>
        rule.required().max(NAME_MAX).error(`Nama outlet wajib diisi, maksimal ${NAME_MAX} karakter.`),
    }),
    defineField({
      name: "address",
      title: "Alamat",
      type: "string",
      validation: (rule) => rule.required().error("Alamat wajib diisi."),
    }),
    defineField({
      name: "maps_url",
      title: "Tautan Google Maps",
      description: "Tautan petunjuk arah yang dibuka tombol Petunjuk Arah.",
      type: "url",
      validation: (rule) => rule.required().error("Tautan Google Maps wajib diisi."),
    }),
    defineField({
      name: "gofood_url",
      title: "Tautan GoFood",
      description: "Kosongkan bila outlet tidak ada di GoFood. Tombol GoFood ikut tersembunyi.",
      type: "url",
    }),
    defineField({
      name: "temporarily_closed",
      title: "Tutup sementara",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "google_rating",
      title: "Rating Google",
      description: "Salin dari Google Maps, misalnya 4,7.",
      type: "number",
      validation: (rule) => rule.min(0).max(RATING_MAX),
    }),
    defineField({
      name: "google_review_count",
      title: "Jumlah ulasan Google",
      type: "number",
      validation: (rule) => rule.integer().min(0),
    }),
    defineField({
      name: "rating_updated_at",
      title: "Tanggal rating dicek",
      type: "date",
    }),
  ],
  preview: { select: { title: "name", subtitle: "address" } },
});
