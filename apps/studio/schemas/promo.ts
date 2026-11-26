import { defineField, defineType } from "sanity";
import { imageField } from "./fields";

// E-09 Promo (PRD 11.1, BR-05). Sanity menyimpan datetime dalam UTC; situs menampilkannya dalam WIB.
export const promo = defineType({
  name: "promo",
  title: "Promo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Judul promo",
      type: "string",
      validation: (rule) => rule.required().error("Judul promo wajib diisi."),
    }),
    defineField({ name: "body", title: "Keterangan", type: "text", rows: 3 }),
    imageField("image", "Gambar", { required: false }),
    defineField({ name: "link_url", title: "Tautan", type: "url" }),
    defineField({
      name: "starts_at",
      title: "Mulai",
      type: "datetime",
      validation: (rule) => rule.required().error("Tanggal mulai wajib diisi."),
    }),
    defineField({
      name: "ends_at",
      title: "Berakhir",
      type: "datetime",
      validation: (rule) =>
        rule
          .required()
          .min(rule.valueOfField("starts_at"))
          .error("Tanggal berakhir harus setelah tanggal mulai."),
    }),
  ],
  preview: { select: { title: "title", subtitle: "starts_at" } },
});
