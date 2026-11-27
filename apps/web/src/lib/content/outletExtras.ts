// Foto ruang dan fasilitas yang tampil di panel outlet (FR-02, E-06, E-07).
import type { Facility, Photo } from "./types";
import { asList, asRecord, optionalUrl, requiredText } from "./validate";

export function parsePhoto(value: unknown, label: string): Photo | null {
  if (value === null || value === undefined) return null;
  const record = asRecord(value, `Foto ${label}`);
  const url = optionalUrl(record, "url", `Foto ${label}`);
  if (url === null) return null;
  return { url, alt: requiredText(record, "alt_text", `Foto ${label}`) };
}

export function parseFacilities(value: unknown, label: string): Facility[] {
  return asList(value ?? [], `Fasilitas ${label}`).map((item) => {
    const record = asRecord(item, `Fasilitas ${label}`);
    return {
      label: requiredText(record, "label", `Fasilitas ${label}`),
      isAvailable: record.is_available !== false,
    };
  });
}
