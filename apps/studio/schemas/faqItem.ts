import { defineField, defineType } from "sanity";
import { outletReference, sortOrderField } from "./fields";

// E-10 FaqItem (PRD 11.1, FR-18)
export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Pertanyaan",
      type: "string",
      validation: (rule) => rule.required().error("Pertanyaan wajib diisi."),
    }),
    defineField({
      name: "answer",
      title: "Jawaban",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().error("Jawaban wajib diisi."),
    }),
    {
      ...outletReference({ required: false }),
      description: "Kosongkan bila jawaban berlaku untuk kedua outlet.",
    },
    sortOrderField(),
  ],
  orderings: [{ title: "Urutan", name: "sortOrder", by: [{ field: "sort_order", direction: "asc" }] }],
  preview: { select: { title: "question", subtitle: "outlet.name" } },
});
