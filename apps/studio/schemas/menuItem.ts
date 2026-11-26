import { defineField, defineType } from "sanity";
import { imageField, sortOrderField } from "./fields";

const NAME_MAX = 60;
const DESCRIPTION_MAX = 200;

// E-04 MenuItem (PRD 11.3, BR-02)
export const menuItem = defineType({
  name: "menuItem",
  title: "Item menu",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Kategori",
      type: "reference",
      to: [{ type: "menuCategory" }],
      validation: (rule) => rule.required().error("Pilih kategori."),
    }),
    defineField({
      name: "name",
      title: "Nama menu",
      description: "Tulis persis seperti di menu cetak.",
      type: "string",
      // US-11.AC2
      validation: (rule) => [
        rule.required().error("Nama menu wajib diisi."),
        rule.max(NAME_MAX).error(`Nama menu maksimal ${NAME_MAX} karakter.`),
      ],
    }),
    defineField({
      name: "price_idr",
      title: "Harga (rupiah)",
      description: 'Rupiah penuh tanpa titik, misalnya 28000. Kosongkan bila harga tampil "Tanya barista".',
      type: "number",
      validation: (rule) => rule.integer().min(0).error("Harga berupa angka rupiah penuh, misalnya 28000."),
    }),
    defineField({
      name: "description",
      title: "Deskripsi",
      type: "text",
      rows: 3,
      validation: (rule) =>
        rule.max(DESCRIPTION_MAX).error(`Deskripsi maksimal ${DESCRIPTION_MAX} karakter.`),
    }),
    defineField({
      name: "options",
      title: "Pilihan rasa atau penyajian",
      description: 'Misalnya "strawberry/matcha/chocolate" atau "blended".',
      type: "string",
    }),
    defineField({ name: "is_spicy", title: "Pedas", type: "boolean", initialValue: false }),
    defineField({ name: "is_new", title: "Label New Menu", type: "boolean", initialValue: false }),
    defineField({
      name: "badge",
      title: "Label khusus",
      type: "string",
      options: { list: ["Must Try", "Now Blooming"] },
    }),
    defineField({
      name: "is_available",
      title: "Tersedia",
      description: 'Matikan bila sedang habis. Item tetap tampil dengan label "Sedang tidak tersedia".',
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "is_recommended",
      title: "Rekomendasi di Beranda",
      description: "Pilih 4 sampai 6 item. Kurang dari 4, bagian rekomendasi tidak tampil.",
      type: "boolean",
      initialValue: false,
    }),
    imageField("image", "Foto produk", { required: false }),
    sortOrderField(),
  ],
  orderings: [{ title: "Urutan", name: "sortOrder", by: [{ field: "sort_order", direction: "asc" }] }],
  preview: {
    select: { title: "name", category: "category.name", price: "price_idr", media: "image" },
    prepare: ({ title, category, price, media }) => ({
      title,
      subtitle: `${category ?? "Tanpa kategori"} · ${price == null ? "Tanya barista" : price}`,
      media,
    }),
  },
});
