// BR-01: status buka dihitung dalam WIB dari jam outlet.
import type { DayHours } from "./content/types";
import { formatClock } from "./formatHours";
import { instagramHandle } from "./instagram";
import { toWib } from "./wib";

const CLOSING_SOON_MINUTES = 30;
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;
const DAYS_PER_WEEK = 7;

export type OpenStatus =
  | { kind: "open" | "closingSoon"; closesAt: string }
  | { kind: "closed"; opensAt: string | null }
  | { kind: "unknown" };

/** Jam satu hari dalam menit sejak 00.00 hari itu. closes bisa lebih dari satu hari. */
interface Shift {
  opens: number;
  closes: number;
  hours: DayHours;
}

function toMinutes(clock: string): number {
  const [hour, minute] = clock.split(":").map(Number);
  return (hour ?? 0) * MINUTES_PER_HOUR + (minute ?? 0);
}

function shiftFor(week: readonly DayHours[], weekday: number): Shift | null {
  const hours = week.find((day) => day.weekday === weekday);
  if (!hours) return null;
  const opens = toMinutes(hours.opensAt);
  const closes = toMinutes(hours.closesAt);
  // Jam tutup yang tidak lebih besar dari jam buka jatuh di hari berikutnya.
  return { opens, closes: closes > opens ? closes : closes + MINUTES_PER_DAY, hours };
}

function openUntil(shift: Shift, now: number): OpenStatus {
  const kind = shift.closes - now <= CLOSING_SOON_MINUTES ? "closingSoon" : "open";
  return { kind, closesAt: shift.hours.closesAt };
}

function isOpen(shift: Shift, now: number): boolean {
  return now >= shift.opens && now < shift.closes;
}

export function getOpenStatus(week: readonly DayHours[], instant: Date): OpenStatus {
  const { weekday, minutes } = toWib(instant);

  // Jam kemarin yang melewati tengah malam diperiksa lebih dulu.
  const yesterday = shiftFor(week, weekday === 1 ? DAYS_PER_WEEK : weekday - 1);
  const sinceYesterday = minutes + MINUTES_PER_DAY;
  if (yesterday && isOpen(yesterday, sinceYesterday)) return openUntil(yesterday, sinceYesterday);

  const today = shiftFor(week, weekday);
  if (today === null) return { kind: "unknown" };
  if (isOpen(today, minutes)) return openUntil(today, minutes);
  if (minutes < today.opens) return { kind: "closed", opensAt: today.hours.opensAt };

  // Hanya besok yang disebut. Bila kosong, jam buka berikutnya tidak ditebak.
  const tomorrow = shiftFor(week, (weekday % DAYS_PER_WEEK) + 1);
  return { kind: "closed", opensAt: tomorrow?.hours.opensAt ?? null };
}

export function statusText(status: OpenStatus): string {
  switch (status.kind) {
    case "open":
      return `Buka, tutup pukul ${formatClock(status.closesAt)}`;
    case "closingSoon":
      return `Segera tutup, tutup pukul ${formatClock(status.closesAt)}`;
    case "closed":
      return status.opensAt ? `Tutup, buka pukul ${formatClock(status.opensAt)}` : "Tutup";
    case "unknown":
      return "Jam hari ini belum tersedia. Tanyakan lewat WhatsApp.";
  }
}

/** Kasus tepi 7.1: dipakai saat outlet ditandai tutup sementara. */
export function temporarilyClosedText(instagramUrl: string): string {
  const handle = instagramHandle(instagramUrl);
  return `Tutup sementara. Info terbaru di Instagram${handle ? ` ${handle}` : ""}.`;
}
