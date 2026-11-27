// Query dan pemetaan menu Buah Batu (API-01, E-03, E-04).
import { categoryAnchors } from "../menu";
import type { ContentQuery, ContentSource } from "./contentSource";
import type { MenuAddOn, MenuCategory, MenuItem, MenuSection } from "./types";
import {
  ContentError,
  asList,
  asRecord,
  optionalText,
  optionalUrl,
  requiredText,
  type RawRecord,
} from "./validate";

export const MENU_QUERY: ContentQuery = {
  name: "menu",
  groq: `{
    "categories": *[_type == "menuCategory" && outlet->slug == "buah-batu"] | order(sort_order asc) {
      "id": _id, name, section, subtitle, "image": image.asset->url,
      "add_ons": add_ons[] { name, price_idr, badge, note, "image": image.asset->url },
      "items": *[_type == "menuItem" && category._ref == ^._id] | order(sort_order asc) {
        name, price_idr, description, options, is_spicy, is_new, badge, is_available,
        "image": image.asset->url
      }
    }
  }`,
};

export interface MenuOptions {
  /** false menyingkirkan semua alamat foto dari halaman (ADR 0002, Q-07). */
  photos: boolean;
}

function price(record: RawRecord, label: string): number | null {
  const value = record.price_idr;
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0) {
    throw new ContentError(`${label}: field "price_idr" harus rupiah utuh, misalnya 28000.`);
  }
  return value;
}

function photo(record: RawRecord, label: string, options: MenuOptions): string | null {
  return options.photos ? optionalUrl(record, "image", label) : null;
}

/** Bagian yang sama antara item menu dan tambahan. */
function parseEntry(value: unknown, parent: string, options: MenuOptions) {
  const record = asRecord(value, `Menu ${parent}`);
  const name = requiredText(record, "name", `Menu ${parent}`);
  const label = `Menu ${name}`;
  const entry = {
    name,
    priceIdr: price(record, label),
    badge: optionalText(record, "badge"),
    imageUrl: photo(record, label, options),
  };
  return { record, entry };
}

function parseItem(value: unknown, parent: string, options: MenuOptions): MenuItem {
  const { record, entry } = parseEntry(value, parent, options);
  return {
    ...entry,
    description: optionalText(record, "description"),
    options: optionalText(record, "options"),
    isSpicy: record.is_spicy === true,
    isNew: record.is_new === true,
    isAvailable: record.is_available !== false,
  };
}

function parseAddOn(value: unknown, parent: string, options: MenuOptions): MenuAddOn {
  const { record, entry } = parseEntry(value, parent, options);
  return { ...entry, note: optionalText(record, "note") };
}

function parseSection(record: RawRecord, label: string): MenuSection {
  const value = record.section;
  if (value !== "food" && value !== "drink") {
    throw new ContentError(`${label}: tab "${String(value)}" tidak dikenal.`);
  }
  return value;
}

function parseCategory(value: unknown, options: MenuOptions): Omit<MenuCategory, "anchor"> {
  const record = asRecord(value, "Kategori menu");
  const name = requiredText(record, "name", "Kategori menu");
  const label = `Kategori ${name}`;
  return {
    name,
    section: parseSection(record, label),
    subtitle: optionalText(record, "subtitle"),
    imageUrl: photo(record, label, options),
    items: asList(record.items ?? [], label).map((item) => parseItem(item, name, options)),
    addOns: asList(record.add_ons ?? [], label).map((addOn) => parseAddOn(addOn, name, options)),
  };
}

export function parseMenu(raw: unknown, options: MenuOptions): MenuCategory[] {
  const root = asRecord(raw, "Menu");
  const categories = asList(root.categories, "Kategori menu").map((category) =>
    parseCategory(category, options),
  );
  const anchors = categoryAnchors(categories.map((category) => category.name));
  return categories.map((category, index) => ({ ...category, anchor: anchors[index] as string }));
}

export async function loadMenu(source: ContentSource, options: MenuOptions): Promise<MenuCategory[]> {
  return parseMenu(await source.fetch(MENU_QUERY), options);
}
