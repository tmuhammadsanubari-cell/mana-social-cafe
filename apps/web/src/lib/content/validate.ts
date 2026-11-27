// Konten CMS diperiksa saat build: data tidak valid menggagalkan deploy (PRD 13.6).

export class ContentError extends Error {
  constructor(message: string) {
    super(`Konten tidak valid: ${message}`);
    this.name = "ContentError";
  }
}

export type RawRecord = Record<string, unknown>;

// Hanya http(s), supaya nilai seperti "javascript:" tidak pernah menjadi href (PRD 14).
const WEB_URL = /^https?:\/\//i;

export function asRecord(value: unknown, label: string): RawRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ContentError(`${label} tidak ditemukan.`);
  }
  return value as RawRecord;
}

export function asList(value: unknown, label: string): unknown[] {
  if (!Array.isArray(value)) throw new ContentError(`${label} harus berupa daftar.`);
  return value;
}

export function optionalText(record: RawRecord, field: string): string | null {
  const value = record[field];
  return typeof value === "string" && value.trim() !== "" ? value.trim() : null;
}

export function requiredText(record: RawRecord, field: string, label: string): string {
  const value = optionalText(record, field);
  if (value === null) throw new ContentError(`${label}: field "${field}" belum diisi.`);
  return value;
}

export function optionalUrl(record: RawRecord, field: string, label: string): string | null {
  const value = optionalText(record, field);
  if (value !== null && !WEB_URL.test(value)) {
    throw new ContentError(`${label}: field "${field}" harus diawali http:// atau https://.`);
  }
  return value;
}

export function requiredUrl(record: RawRecord, field: string, label: string): string {
  const value = optionalUrl(record, field, label);
  if (value === null) throw new ContentError(`${label}: field "${field}" belum diisi.`);
  return value;
}
