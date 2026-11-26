import { defineField, defineType } from "sanity";
import { outletReference, sortOrderField } from "./fields";

// E-07 Facility (PRD 11.1, FR-07, US-06)
export const facility = defineType({
  name: "facility",
  title: "Fasilitas",
  type: "document",
  fields: [
    outletReference({ required: true }),
    defineField({
      name: "label",
      title: "Nama fasilitas",
      description: 'Tulis jujur, misalnya "Tanpa AC" atau "Zona merokok di lantai 1".',
      type: "string",
      validation: (rule) => rule.required().error("Nama fasilitas wajib diisi."),
    }),
    defineField({
      name: "is_available",
      title: "Tersedia",
      description: 'Bila dimatikan, fasilitas tetap tampil dengan tulisan "Tidak tersedia".',
      type: "boolean",
      initialValue: true,
    }),
    sortOrderField(),
  ],
  orderings: [{ title: "Urutan", name: "sortOrder", by: [{ field: "sort_order", direction: "asc" }] }],
  preview: {
    select: { title: "label", outlet: "outlet.name", available: "is_available" },
    prepare: ({ title, outlet, available }) => ({
      title,
      subtitle: `${outlet ?? ""}${available === false ? " · Tidak tersedia" : ""}`,
    }),
  },
});
