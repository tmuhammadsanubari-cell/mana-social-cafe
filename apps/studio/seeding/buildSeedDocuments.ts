// Mengubah file JSON di seed/ menjadi dokumen Sanity (PRD 11.5). Murni, tanpa jaringan, agar
// hitungan 75 item dan 19 kategori bisa diuji. ID dokumen tetap, jadi impor ulang menimpa, bukan menggandakan.

import type {
  CottageSeed,
  GallerySeed,
  MenuSeed,
  MenuSeedAddOn,
  MenuSeedCategory,
  MenuSeedItem,
  SanityDoc,
  SeedResult,
  SiteBaseSeed,
} from "./seedTypes";

const WEEKDAY_COUNT = 7;
const MAPS_DIR_URL = "https://www.google.com/maps/dir/?api=1&destination=";

const ref = (id: string) => ({ _type: "reference", _ref: id });
export const outletId = (slug: string) => `outlet-${slug}`;
const menuImage = (file: string) => `menu/${file}`;

function addOnEntry(addOn: MenuSeedAddOn) {
  return {
    _key: addOn.key,
    _type: "addOn",
    name: addOn.name,
    price_idr: addOn.price_idr,
    badge: addOn.badge,
    note: addOn.note,
  };
}

function menuItemDoc(item: MenuSeedItem, categoryId: string, outletSlug: string, order: number) {
  return {
    _id: `menuItem-${outletSlug}-${item.key}`,
    _type: "menuItem",
    category: ref(categoryId),
    name: item.name,
    price_idr: item.price_idr,
    description: item.description,
    options: item.options,
    is_spicy: item.is_spicy ?? false,
    is_new: item.is_new ?? false,
    badge: item.badge,
    is_available: true,
    is_recommended: false,
    sort_order: order,
  };
}

function categoryDocs(category: MenuSeedCategory, outletSlug: string, order: number, result: SeedResult) {
  const categoryId = `menuCategory-${outletSlug}-${category.key}`;
  result.documents.push({
    _id: categoryId,
    _type: "menuCategory",
    outlet: ref(outletId(outletSlug)),
    name: category.name,
    section: category.section,
    subtitle: category.subtitle,
    sort_order: order,
    add_ons: category.add_ons?.map(addOnEntry),
  });
  if (category.image) {
    result.images.push({ documentId: categoryId, field: "image", file: menuImage(category.image) });
  }
  category.add_ons?.forEach((addOn) => {
    if (addOn.image) {
      result.images.push({
        documentId: categoryId,
        field: `add_ons[_key=="${addOn.key}"].image`,
        file: menuImage(addOn.image),
      });
    }
  });
  category.items.forEach((item, index) => {
    const doc = menuItemDoc(item, categoryId, outletSlug, index + 1);
    result.documents.push(doc);
    if (item.image) {
      result.images.push({ documentId: doc._id, field: "image", file: menuImage(item.image) });
    }
  });
}

function galleryDocs(gallery: GallerySeed, result: SeedResult) {
  for (const { outlet, folder, photos } of gallery.outlets) {
    photos.forEach((photo, index) => {
      const documentId = `galleryImage-${outlet}-${photo.key}`;
      result.documents.push({
        _id: documentId,
        _type: "galleryImage",
        outlet: ref(outletId(outlet)),
        alt_text: photo.alt_text,
        sort_order: index + 1,
      });
      result.images.push({ documentId, field: "image", file: `${folder}/${photo.file}` });
    });
  }
}

function siteBaseDocs(base: SiteBaseSeed): SanityDoc[] {
  const docs: SanityDoc[] = [];
  for (const outlet of base.outlets) {
    docs.push({
      _id: outletId(outlet.slug),
      _type: "outlet",
      slug: outlet.slug,
      name: outlet.name,
      address: outlet.address,
      maps_url: MAPS_DIR_URL + encodeURIComponent(outlet.maps_destination),
      latitude: outlet.latitude,
      longitude: outlet.longitude,
      gofood_url: outlet.gofood_url,
      temporarily_closed: false,
    });
    for (let weekday = 1; weekday <= WEEKDAY_COUNT; weekday += 1) {
      docs.push({
        _id: `openingHours-${outlet.slug}-${weekday}`,
        _type: "openingHours",
        outlet: ref(outletId(outlet.slug)),
        weekday,
        opens_at: outlet.opens_at,
        closes_at: outlet.closes_at,
      });
    }
  }
  docs.push({ _id: "siteSettings", _type: "siteSettings", ...base.site_settings });
  return docs;
}

function cottageDocs(cottage: CottageSeed): SanityDoc[] {
  return cottage.room_types.map(({ key, ...room }) => ({
    _id: `cottageRoomType-${cottage.outlet}-${key}`,
    _type: "cottageRoomType",
    outlet: ref(outletId(cottage.outlet)),
    ...room,
  }));
}

// Field kosong tidak ditulis. Di Sanity field yang tidak ada berarti kosong, misalnya price_idr
// kosong tampil "Tanya barista" (BR-02).
function dropEmpty(doc: SanityDoc): SanityDoc {
  return Object.fromEntries(
    Object.entries(doc).filter(([, value]) => value !== null && value !== undefined),
  ) as SanityDoc;
}

export function buildSeedDocuments(
  base: SiteBaseSeed,
  menu: MenuSeed,
  cottage: CottageSeed,
  gallery: GallerySeed,
): SeedResult {
  const result: SeedResult = { documents: siteBaseDocs(base), images: [] };
  menu.categories.forEach((category, index) => categoryDocs(category, menu.outlet, index + 1, result));
  result.documents.push(...cottageDocs(cottage));
  galleryDocs(gallery, result);
  result.documents = result.documents.map(dropEmpty);
  return result;
}

/** Satu jenis dokumen beserta fotonya, supaya impor tidak menyentuh dokumen lain. */
export function onlyType({ documents, images }: SeedResult, type: string): SeedResult {
  const selected = documents.filter((doc) => doc._type === type);
  const ids = new Set(selected.map((doc) => doc._id));
  return { documents: selected, images: images.filter((image) => ids.has(image.documentId)) };
}
