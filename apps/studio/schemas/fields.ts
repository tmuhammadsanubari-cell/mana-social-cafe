import { defineField, type ImageRule, type ImageValue } from "sanity";
import { API_VERSION } from "../env";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB, kasus tepi 7.8
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

export function outletReference(options: { required: boolean }) {
  return defineField({
    name: "outlet",
    title: "Outlet",
    type: "reference",
    to: [{ type: "outlet" }],
    validation: (rule) => (options.required ? rule.required().error("Pilih outlet.") : rule),
  });
}

export function sortOrderField() {
  return defineField({
    name: "sort_order",
    title: "Urutan",
    description: "Angka kecil tampil lebih dulu.",
    type: "number",
    validation: (rule) => rule.required().integer().min(0),
  });
}

export function timeField(name: string, title: string, description?: string) {
  return defineField({
    name,
    title,
    description,
    type: "string",
    validation: (rule) =>
      rule
        .required()
        .regex(TIME_PATTERN, { name: "HH:mm" })
        .error("Tulis jam dengan format HH:mm, misalnya 08:00."),
  });
}

export function placeholderField() {
  return defineField({
    name: "is_placeholder",
    title: "Data contoh",
    description:
      "Nyalakan bila data ini belum asli. Selama masih ada data contoh, website produksi tidak bisa diterbitkan (BR-06).",
    type: "boolean",
    initialValue: true,
  });
}

// Sanity baru tahu ukuran file setelah unggahan, jadi batas 10 MB diperiksa saat publish.
export function maxImageSize(rule: ImageRule) {
  return rule.custom(async (value: ImageValue | undefined, context) => {
    const assetId = value?.asset?._ref;
    if (!assetId) return true;
    const client = context.getClient({ apiVersion: API_VERSION });
    const size = await client.fetch<number | null>("*[_id == $id][0].size", { id: assetId });
    return size != null && size > MAX_IMAGE_BYTES ? "Ukuran foto maksimal 10 MB." : true;
  });
}

export function imageField(name: string, title: string, options: { required: boolean }) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    validation: (rule) => {
      const sized = maxImageSize(rule);
      return options.required ? sized.required().error("Unggah foto.") : sized;
    },
  });
}
