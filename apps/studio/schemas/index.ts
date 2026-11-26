import { cottageRoomType } from "./cottageRoomType";
import { event } from "./event";
import { facility } from "./facility";
import { faqItem } from "./faqItem";
import { galleryImage } from "./galleryImage";
import { menuCategory } from "./menuCategory";
import { menuItem } from "./menuItem";
import { openingHours } from "./openingHours";
import { outlet } from "./outlet";
import { promo } from "./promo";
import { siteSettings } from "./siteSettings";
import { testimonial } from "./testimonial";

// E-01 sampai E-12 (PRD 11.1)
export const schemaTypes = [
  outlet,
  openingHours,
  menuCategory,
  menuItem,
  cottageRoomType,
  galleryImage,
  facility,
  testimonial,
  promo,
  faqItem,
  siteSettings,
  event,
];
