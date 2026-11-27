// Query dan pemetaan konten outlet serta pengaturan situs (API-01, E-01, E-02, E-06, E-07, E-11).
import type { ContentQuery, ContentSource } from "./contentSource";
import { parseFacilities, parsePhoto } from "./outletExtras";
import { OUTLET_SLUGS, type DayHours, type Outlet, type OutletSlug, type SiteShell } from "./types";
import {
  ContentError,
  asList,
  asRecord,
  optionalText,
  optionalUrl,
  requiredText,
  requiredUrl,
  type RawRecord,
} from "./validate";

export const SITE_SHELL_QUERY: ContentQuery = {
  name: "siteShell",
  groq: `{
    "outlets": *[_type == "outlet"] | order(slug asc) {
      slug, name, address, maps_url, gofood_url, temporarily_closed,
      "hours": *[_type == "openingHours" && outlet._ref == ^._id] | order(weekday asc) {
        weekday, opens_at, closes_at
      },
      "photo": *[_type == "galleryImage" && outlet._ref == ^._id] | order(sort_order asc)[0] {
        "url": image.asset->url, alt_text
      },
      "facilities": *[_type == "facility" && outlet._ref == ^._id] | order(sort_order asc) {
        label, is_available
      }
    },
    "settings": *[_id == "siteSettings"][0] { whatsapp_number, instagram_url, menu_pdf_url }
  }`,
};

const CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;
const FIRST_WEEKDAY = 1;
const LAST_WEEKDAY = 7;

function parseWeekday(record: RawRecord, label: string): number {
  const weekday = record.weekday;
  const valid = Number.isInteger(weekday) && Number(weekday) >= FIRST_WEEKDAY;
  if (!valid || Number(weekday) > LAST_WEEKDAY) {
    throw new ContentError(`${label}: hari harus angka 1 (Senin) sampai 7 (Minggu).`);
  }
  return Number(weekday);
}

function parseDay(value: unknown, label: string): DayHours | null {
  const record = asRecord(value, `Jam buka ${label}`);
  const opensAt = optionalText(record, "opens_at");
  const closesAt = optionalText(record, "closes_at");
  if (opensAt === null || closesAt === null) return null;
  if (!CLOCK.test(opensAt) || !CLOCK.test(closesAt)) {
    throw new ContentError(`Jam buka ${label}: tulis jam dengan format HH:mm.`);
  }
  return { weekday: parseWeekday(record, `Jam buka ${label}`), opensAt, closesAt };
}

function parseSlug(record: RawRecord): OutletSlug {
  const slug = OUTLET_SLUGS.find((candidate) => candidate === record.slug);
  if (!slug) throw new ContentError(`Outlet: alamat halaman "${String(record.slug)}" tidak dikenal.`);
  return slug;
}

function parseOutlet(value: unknown): Outlet {
  const record = asRecord(value, "Outlet");
  const slug = parseSlug(record);
  const label = `Outlet ${slug}`;
  return {
    slug,
    name: requiredText(record, "name", label),
    address: requiredText(record, "address", label),
    mapsUrl: requiredUrl(record, "maps_url", label),
    gofoodUrl: optionalUrl(record, "gofood_url", label),
    temporarilyClosed: record.temporarily_closed === true,
    hours: asList(record.hours ?? [], `Jam buka ${slug}`)
      .map((day) => parseDay(day, slug))
      .filter((day) => day !== null),
    photo: parsePhoto(record.photo, slug),
    facilities: parseFacilities(record.facilities, slug),
  };
}

export function getOutlet(shell: SiteShell, slug: OutletSlug): Outlet {
  const matches = shell.outlets.filter((outlet) => outlet.slug === slug);
  if (matches.length !== 1) {
    throw new ContentError(`Harus ada tepat satu outlet "${slug}", ditemukan ${matches.length}.`);
  }
  return matches[0] as Outlet;
}

export function parseSiteShell(raw: unknown): SiteShell {
  const root = asRecord(raw, "Konten situs");
  const settings = asRecord(root.settings, "Pengaturan Situs");
  const shell: SiteShell = {
    outlets: asList(root.outlets, "Outlet").map(parseOutlet),
    settings: {
      whatsappNumber: optionalText(settings, "whatsapp_number"),
      instagramUrl: requiredUrl(settings, "instagram_url", "Pengaturan Situs"),
      menuPdfUrl: optionalUrl(settings, "menu_pdf_url", "Pengaturan Situs"),
    },
  };
  // Urutan tetap mengikuti OUTLET_SLUGS; kedua outlet wajib ada.
  shell.outlets = OUTLET_SLUGS.map((slug) => getOutlet(shell, slug));
  return shell;
}

export async function loadSiteShell(source: ContentSource): Promise<SiteShell> {
  return parseSiteShell(await source.fetch(SITE_SHELL_QUERY));
}
