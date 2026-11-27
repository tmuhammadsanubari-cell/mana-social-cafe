// Teks jam buka untuk footer (PRD 8.4) dan tabel mingguan. Status buka (BR-01) ada di openStatus.ts.
import type { DayHours } from "./content/types";

const DAY_NAMES = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"] as const;

interface DayRange {
  first: number;
  last: number;
  clock: string;
}

export function formatClock(time: string): string {
  return time.replace(":", ".");
}

function formatRange(day: DayHours): string {
  return `${formatClock(day.opensAt)}–${formatClock(day.closesAt)}`;
}

export interface WeeklyRow {
  weekday: number;
  day: string;
  /** null bila jam hari itu belum diisi. */
  range: string | null;
}

/** Baris tabel jam mingguan, selalu Senin sampai Minggu (kasus tepi 7.2). */
export function weeklyRows(hours: readonly DayHours[]): WeeklyRow[] {
  return DAY_NAMES.map((day, index) => {
    const weekday = index + 1;
    const found = hours.find((entry) => entry.weekday === weekday);
    return { weekday, day, range: found ? formatRange(found) : null };
  });
}

function groupDays(hours: readonly DayHours[]): DayRange[] {
  const ranges: DayRange[] = [];
  for (const day of [...hours].sort((a, b) => a.weekday - b.weekday)) {
    const clock = formatRange(day);
    const previous = ranges[ranges.length - 1];
    if (previous && previous.clock === clock && previous.last + 1 === day.weekday) {
      previous.last = day.weekday;
    } else {
      ranges.push({ first: day.weekday, last: day.weekday, clock });
    }
  }
  return ranges;
}

function dayLabel({ first, last }: DayRange): string {
  if (first === 1 && last === DAY_NAMES.length) return "Setiap hari";
  const from = DAY_NAMES[first - 1];
  return first === last ? `${from}` : `${from} sampai ${DAY_NAMES[last - 1]}`;
}

/** Hari berurutan dengan jam sama digabung. Daftar kosong bila jam belum diisi. */
export function summarizeHours(hours: readonly DayHours[]): string[] {
  return groupDays(hours).map((range) => `${dayLabel(range)} ${range.clock} WIB`);
}
