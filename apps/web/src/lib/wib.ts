// Waktu WIB tanpa bergantung zona waktu browser atau server (US-02.AC4).
// Indonesia bagian barat tidak mengenal waktu musim panas, jadi selisihnya tetap.
const WIB_OFFSET_HOURS = 7;
const MINUTES_PER_HOUR = 60;
const MS_PER_MINUTE = 60_000;
const WIB_OFFSET_MS = WIB_OFFSET_HOURS * MINUTES_PER_HOUR * MS_PER_MINUTE;
const DAYS_PER_WEEK = 7;

export interface WibTime {
  /** 1 = Senin, 7 = Minggu (E-02). */
  weekday: number;
  /** Menit sejak pukul 00.00. */
  minutes: number;
}

export function toWib(instant: Date): WibTime {
  const shifted = new Date(instant.getTime() + WIB_OFFSET_MS);
  return {
    // getUTCDay: 0 = Minggu.
    weekday: shifted.getUTCDay() || DAYS_PER_WEEK,
    minutes: shifted.getUTCHours() * MINUTES_PER_HOUR + shifted.getUTCMinutes(),
  };
}
