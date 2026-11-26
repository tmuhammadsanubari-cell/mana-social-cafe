import { defineField, defineType } from "sanity";
import { imageField, outletReference } from "./fields";

// E-12 Event (PRD 11.1, FR-20). Event yang sudah lewat disaring situs (US-20.AC1).
export const event = defineType({
  name: "event",
  title: "Event",
  type: "document",
  fields: [
    outletReference({ required: true }),
    defineField({
      name: "title",
      title: "Nama event",
      type: "string",
      validation: (rule) => rule.required().error("Nama event wajib diisi."),
    }),
    defineField({
      name: "starts_at",
      title: "Waktu mulai",
      type: "datetime",
      validation: (rule) => rule.required().error("Waktu mulai wajib diisi."),
    }),
    defineField({ name: "description", title: "Keterangan", type: "text", rows: 3 }),
    imageField("image", "Gambar", { required: false }),
  ],
  orderings: [{ title: "Tanggal", name: "startsAt", by: [{ field: "starts_at", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "outlet.name" } },
});
