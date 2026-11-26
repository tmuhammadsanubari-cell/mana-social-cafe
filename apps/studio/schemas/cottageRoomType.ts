import { defineArrayMember, defineField, defineType } from "sanity";
import { imageField, outletReference, placeholderField, timeField } from "./fields";

const CAPACITY_MAX = 8;

// E-05 CottageRoomType (PRD 11.3, 7.7). Data awal DUMMY, wajib is_placeholder = true (BR-06).
export const cottageRoomType = defineType({
  name: "cottageRoomType",
  title: "Tipe cottage",
  type: "document",
  fields: [
    outletReference({ required: true }),
    defineField({
      name: "name",
      title: "Nama tipe",
      type: "string",
      validation: (rule) => rule.required().error("Nama tipe cottage wajib diisi."),
    }),
    defineField({
      name: "units",
      title: "Jumlah unit",
      type: "number",
      validation: (rule) => rule.required().integer().min(1).error("Jumlah unit minimal 1."),
    }),
    defineField({
      name: "capacity",
      title: "Kapasitas tamu",
      type: "number",
      validation: (rule) =>
        rule.required().integer().min(1).max(CAPACITY_MAX).error(`Kapasitas 1 sampai ${CAPACITY_MAX} tamu.`),
    }),
    defineField({
      name: "price_per_night_idr",
      title: "Harga per malam (rupiah)",
      description: "Rupiah penuh tanpa titik, misalnya 850000.",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "facilities",
      title: "Fasilitas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "images",
      title: "Foto",
      type: "array",
      of: [defineArrayMember(imageField("photo", "Foto", { required: false }))],
    }),
    timeField("check_in_time", "Jam check-in (WIB)"),
    timeField("check_out_time", "Jam check-out (WIB)"),
    placeholderField(),
  ],
  preview: {
    select: { title: "name", placeholder: "is_placeholder" },
    prepare: ({ title, placeholder }) => ({
      title,
      subtitle: placeholder ? "Data contoh" : undefined,
    }),
  },
});
