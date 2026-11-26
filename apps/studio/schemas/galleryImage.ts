import { defineField, defineType } from "sanity";
import { imageField, outletReference, sortOrderField } from "./fields";

// E-06 GalleryImage (PRD 11.1, FR-06, US-05)
export const galleryImage = defineType({
  name: "galleryImage",
  title: "Foto galeri",
  type: "document",
  fields: [
    outletReference({ required: true }),
    imageField("image", "Foto", { required: true }),
    defineField({
      name: "alt_text",
      title: "Teks alternatif",
      description: 'Jelaskan isi foto untuk pembaca layar, misalnya "Void melingkar lantai 2 Buah Batu".',
      type: "string",
      validation: (rule) => rule.required().error("Teks alternatif wajib diisi."),
    }),
    sortOrderField(),
  ],
  orderings: [{ title: "Urutan", name: "sortOrder", by: [{ field: "sort_order", direction: "asc" }] }],
  preview: { select: { title: "alt_text", subtitle: "outlet.name", media: "image" } },
});
