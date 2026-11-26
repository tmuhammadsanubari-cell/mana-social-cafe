import { defineField, defineType } from "sanity";
import { outletReference } from "./fields";

// E-08 Testimonial (PRD 11.1, BR-07): hanya ulasan publik nyata dengan tautan sumber.
export const testimonial = defineType({
  name: "testimonial",
  title: "Testimoni",
  type: "document",
  fields: [
    outletReference({ required: true }),
    defineField({
      name: "quote",
      title: "Kutipan ulasan",
      description: 'Salin persis dari ulasan asli. Boleh dipotong dengan "...", tidak boleh diubah.',
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().error("Kutipan ulasan wajib diisi."),
    }),
    defineField({
      name: "reviewer_name",
      title: "Nama pengulas",
      description: "Sesuai nama di sumber ulasan.",
      type: "string",
      validation: (rule) => rule.required().error("Nama pengulas wajib diisi."),
    }),
    defineField({
      name: "reviewed_at",
      title: "Tanggal ulasan",
      type: "date",
      validation: (rule) => rule.required().error("Tanggal ulasan wajib diisi."),
    }),
    defineField({
      name: "source_url",
      title: "Tautan ulasan asli",
      type: "url",
      validation: (rule) =>
        rule.required().error("Tautan ulasan asli wajib diisi. Testimoni tanpa sumber tidak boleh tampil."),
    }),
  ],
  preview: { select: { title: "reviewer_name", subtitle: "outlet.name" } },
});
