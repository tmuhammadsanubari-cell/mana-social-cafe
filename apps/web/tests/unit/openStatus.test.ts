import { describe, expect, it } from "vitest";
import { getOpenStatus, statusText, temporarilyClosedText } from "../../src/lib/openStatus";

const ALL_WEEK = [1, 2, 3, 4, 5, 6, 7];
const hoursFor = (opensAt: string, closesAt: string, days = ALL_WEEK) =>
  days.map((weekday) => ({ weekday, opensAt, closesAt }));

const BUAH_BATU = hoursFor("08:00", "23:00");
const LATE = hoursFor("18:00", "01:00");

/** 2026-11-30 adalah Senin. Jam ditulis dalam WIB. */
const monday = (clock: string) => new Date(`2026-11-30T${clock}:00+07:00`);
const tuesday = (clock: string) => new Date(`2026-12-01T${clock}:00+07:00`);

const textAt = (hours: typeof BUAH_BATU, now: Date) => statusText(getOpenStatus(hours, now));

describe("getOpenStatus untuk jam 08.00–23.00", () => {
  it.each([
    ["US-02.AC1", "10:00", "Buka, tutup pukul 23.00"],
    ["US-02.AC2", "22:40", "Segera tutup, tutup pukul 23.00"],
    ["US-02.AC3", "07:15", "Tutup, buka pukul 08.00"],
    ["BR-01 tepat jam buka", "08:00", "Buka, tutup pukul 23.00"],
    ["BR-01 sebelum 30 menit terakhir", "22:29", "Buka, tutup pukul 23.00"],
    ["BR-01 awal 30 menit terakhir", "22:30", "Segera tutup, tutup pukul 23.00"],
    ["BR-01 menit terakhir", "22:59", "Segera tutup, tutup pukul 23.00"],
    ["BR-01 tepat jam tutup", "23:00", "Tutup, buka pukul 08.00"],
  ])("%s: pukul %s", (_id, clock, expected) => {
    expect(textAt(BUAH_BATU, monday(clock))).toBe(expected);
  });

  it("US-02.AC4: hasil sama untuk saat yang sama yang ditulis di zona waktu lain", () => {
    // 15.40 UTC dan 10.40 di New York sama dengan 22.40 WIB.
    for (const instant of ["2026-11-30T15:40:00Z", "2026-11-30T10:40:00-05:00"]) {
      expect(textAt(BUAH_BATU, new Date(instant))).toBe("Segera tutup, tutup pukul 23.00");
    }
  });

  it("US-02.AC4: hari ditentukan menurut WIB, bukan UTC", () => {
    const onlyTuesday = hoursFor("00:00", "02:00", [2]);
    // Senin 17.30 UTC sudah Selasa 00.30 WIB.
    expect(textAt(onlyTuesday, new Date("2026-11-30T17:30:00Z"))).toBe("Buka, tutup pukul 02.00");
  });
});

describe("BR-01: jam tutup lewat tengah malam", () => {
  it.each([
    ["sebelum tengah malam", monday("23:30"), "Buka, tutup pukul 01.00"],
    ["sesudah tengah malam", tuesday("00:15"), "Buka, tutup pukul 01.00"],
    ["30 menit terakhir", tuesday("00:40"), "Segera tutup, tutup pukul 01.00"],
    ["sudah tutup", tuesday("01:00"), "Tutup, buka pukul 18.00"],
  ])("%s", (_label, now, expected) => {
    expect(textAt(LATE, now)).toBe(expected);
  });

  it("jam Minggu berlanjut ke Senin dini hari", () => {
    const sunday = hoursFor("18:00", "01:00", [7]);
    expect(textAt(sunday, monday("00:15"))).toBe("Buka, tutup pukul 01.00");
  });

  it("jam kemarin tetap berlaku walau jam hari ini kosong", () => {
    const onlyMonday = hoursFor("18:00", "01:00", [1]);
    expect(textAt(onlyMonday, tuesday("00:15"))).toBe("Buka, tutup pukul 01.00");
  });

  it("tutup pukul 00.00 dihitung sebagai akhir hari", () => {
    expect(textAt(hoursFor("10:00", "00:00"), monday("23:45"))).toBe("Segera tutup, tutup pukul 00.00");
  });
});

it("US-02.AC4: Minggu dikenali sebagai hari ke-7", () => {
  const sunday = hoursFor("08:00", "23:00", [7]);
  expect(textAt(sunday, new Date("2026-12-06T10:00:00+07:00"))).toBe("Buka, tutup pukul 23.00");
});

describe("jam belum diisi", () => {
  it("kasus tepi 7.2: hari ini kosong tidak menampilkan status", () => {
    const status = getOpenStatus(hoursFor("08:00", "23:00", [2]), monday("10:00"));

    expect(status).toEqual({ kind: "unknown" });
    expect(statusText(status)).toBe("Jam hari ini belum tersedia. Tanyakan lewat WhatsApp.");
  });

  it("setelah tutup, jam buka besok tidak ditebak bila kosong", () => {
    expect(textAt(hoursFor("08:00", "23:00", [1]), monday("23:30"))).toBe("Tutup");
  });

  it("setelah tutup, memakai jam buka besok walau berbeda", () => {
    const hours = [...hoursFor("08:00", "23:00", [1]), ...hoursFor("10:00", "22:00", [2])];
    expect(textAt(hours, monday("23:30"))).toBe("Tutup, buka pukul 10.00");
  });
});

describe("temporarilyClosedText", () => {
  it("kasus tepi 7.1: menyebut akun Instagram", () => {
    expect(temporarilyClosedText("https://www.instagram.com/mana.bandung/")).toBe(
      "Tutup sementara. Info terbaru di Instagram @mana.bandung.",
    );
  });

  it("tanpa nama akun, kalimat tetap utuh", () => {
    expect(temporarilyClosedText("https://www.instagram.com/")).toBe(
      "Tutup sementara. Info terbaru di Instagram.",
    );
  });
});
