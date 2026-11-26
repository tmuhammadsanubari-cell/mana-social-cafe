import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, outletReference, sortOrderField } from "./fields";

// E-03 MenuCategory (PRD 11.3). Add-On dan Now Blooming disimpan di add_ons, bukan sebagai item
// menu, agar hitungan tetap 75 item (keputusan-desain-ui.md, ADR 0002).
export const menuCategory = defineType({
  name: "menuCategory",
  title: "Kategori menu",
  type: "document",
  fields: [
    outletReference({ required: true }),
    defineField({
      name: "name",
      title: "Nama kategori",
      type: "string",
      validation: (rule) => rule.required().error("Nama kategori wajib diisi."),
    }),
    defineField({
      name: "section",
      title: "Tab",
      type: "string",
      options: {
        list: [
          { title: "Makanan", value: "food" },
          { title: "Minuman", value: "drink" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required().error("Pilih tab Makanan atau Minuman."),
    }),
    defineField({
      name: "subtitle",
      title: "Keterangan",
      description: 'Teks kecil di samping nama kategori, misalnya "hot/ice".',
      type: "string",
    }),
    sortOrderField(),
    imageField("image", "Foto kategori", { required: false }),
    defineField({
      name: "add_ons",
      title: "Tambahan dan upgrade",
      description: "Tampil sebagai chip, tidak dihitung sebagai item menu.",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "addOn",
          fields: [
            defineField({
              name: "name",
              title: "Nama",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "price_idr",
              title: "Harga (rupiah)",
              type: "number",
              validation: (rule) => rule.integer().min(0),
            }),
            defineField({ name: "badge", title: "Label", type: "string" }),
            defineField({ name: "note", title: "Catatan", type: "string" }),
            imageField("image", "Foto", { required: false }),
          ],
        }),
      ],
    }),
  ],
  orderings: [{ title: "Urutan", name: "sortOrder", by: [{ field: "sort_order", direction: "asc" }] }],
  preview: { select: { title: "name", subtitle: "outlet.name" } },
});
