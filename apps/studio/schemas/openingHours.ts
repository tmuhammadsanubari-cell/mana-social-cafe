import { defineField, defineType } from "sanity";
import { outletReference, timeField } from "./fields";

export const WEEKDAYS = [
  { title: "Senin", value: 1 },
  { title: "Selasa", value: 2 },
  { title: "Rabu", value: 3 },
  { title: "Kamis", value: 4 },
  { title: "Jumat", value: 5 },
  { title: "Sabtu", value: 6 },
  { title: "Minggu", value: 7 },
] as const;

// E-02 OpeningHours (PRD 11.3). Jam dalam WIB.
export const openingHours = defineType({
  name: "openingHours",
  title: "Jam buka",
  type: "document",
  fields: [
    outletReference({ required: true }),
    defineField({
      name: "weekday",
      title: "Hari",
      type: "number",
      options: { list: [...WEEKDAYS] },
      validation: (rule) => rule.required().error("Pilih hari."),
    }),
    timeField("opens_at", "Jam buka (WIB)"),
    timeField("closes_at", "Jam tutup (WIB)", "Boleh lewat tengah malam, misalnya buka 18:00 tutup 01:00."),
  ],
  preview: {
    select: { outlet: "outlet.name", weekday: "weekday", opens: "opens_at", closes: "closes_at" },
    prepare: ({ outlet, weekday, opens, closes }) => ({
      title: `${WEEKDAYS.find((day) => day.value === weekday)?.title ?? "Hari belum dipilih"}: ${opens ?? "?"} sampai ${closes ?? "?"}`,
      subtitle: outlet,
    }),
  },
});
