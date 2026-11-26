import type { StructureResolver } from "sanity/structure";
import { SITE_SETTINGS_ID } from "./schemas/siteSettings";

// Urutan menu kiri mengikuti tugas staf paling sering: menu, jam, lalu konten lain.
const LISTED_TYPES = [
  "menuItem",
  "menuCategory",
  "openingHours",
  "outlet",
  "facility",
  "galleryImage",
  "cottageRoomType",
  "faqItem",
  "promo",
  "event",
  "testimonial",
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Konten ManA")
    .items([
      ...LISTED_TYPES.map((type) => S.documentTypeListItem(type)),
      S.divider(),
      S.listItem()
        .title("Pengaturan Situs")
        .id(SITE_SETTINGS_ID)
        .child(S.document().schemaType("siteSettings").documentId(SITE_SETTINGS_ID)),
    ]);
