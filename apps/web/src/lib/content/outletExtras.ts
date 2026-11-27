// Bagian outlet yang boleh kosong: foto ruang, fasilitas, dan titik peta (FR-02, FR-04, E-01, E-06, E-07).
import type { Coordinates, Facility, Photo } from "./types";
import { ContentError, asList, asRecord, optionalUrl, requiredText, type RawRecord } from "./validate";

const LATITUDE_MAX = 90;
const LONGITUDE_MAX = 180;

function degrees(record: RawRecord, field: string, max: number, label: string): number | null {
  const value = record[field];
  if (value === null || value === undefined) return null;
  if (typeof value !== "number" || Math.abs(value) > max) {
    throw new ContentError(`${label}: field "${field}" harus angka antara -${max} dan ${max}.`);
  }
  return value;
}

export function parseCoordinates(record: RawRecord, label: string): Coordinates | null {
  const latitude = degrees(record, "latitude", LATITUDE_MAX, label);
  const longitude = degrees(record, "longitude", LONGITUDE_MAX, label);
  if (latitude === null && longitude === null) return null;
  if (latitude === null || longitude === null) {
    throw new ContentError(`${label}: latitude dan longitude harus diisi bersama.`);
  }
  return { latitude, longitude };
}

function parsePhoto(value: unknown, label: string): Photo | null {
  const record = asRecord(value, `Foto ${label}`);
  const url = optionalUrl(record, "url", `Foto ${label}`);
  if (url === null) return null;
  return { url, alt: requiredText(record, "alt_text", `Foto ${label}`) };
}

/** Foto tanpa file dilewati; foto tanpa teks alternatif menggagalkan build (US-05.AC1). */
export function parseGallery(value: unknown, label: string): Photo[] {
  return asList(value ?? [], `Galeri ${label}`)
    .map((item) => parsePhoto(item, label))
    .filter((photo) => photo !== null);
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
