import { describe, expect, it } from "vitest";
import { formatClock, summarizeHours } from "../../src/lib/formatHours";
import { instagramLabel } from "../../src/lib/instagram";
import { isActivePath } from "../../src/lib/navigation";

const week = (days: number[], opensAt = "08:00", closesAt = "23:00") =>
  days.map((weekday) => ({ weekday, opensAt, closesAt }));

describe("summarizeHours", () => {
  it("memakai titik sebagai pemisah jam", () => {
    expect(formatClock("08:00")).toBe("08.00");
  });

  it("jam sama sepanjang minggu menjadi satu baris", () => {
    expect(summarizeHours(week([1, 2, 3, 4, 5, 6, 7]))).toEqual(["Setiap hari 08.00–23.00 WIB"]);
  });

  it("menggabungkan hari berurutan dan tidak bergantung urutan masukan", () => {
    const hours = [...week([6, 7], "10:00", "00:00"), ...week([5, 4, 3, 2, 1])];
    expect(summarizeHours(hours)).toEqual([
      "Senin sampai Jumat 08.00–23.00 WIB",
      "Sabtu sampai Minggu 10.00–00.00 WIB",
    ]);
  });

  it("hari yang terputus tidak digabung", () => {
    expect(summarizeHours(week([1, 3]))).toEqual(["Senin 08.00–23.00 WIB", "Rabu 08.00–23.00 WIB"]);
  });

  it("kasus tepi 7.2: jam kosong tidak menghasilkan teks", () => {
    expect(summarizeHours([])).toEqual([]);
  });
});

describe("instagramLabel", () => {
  it("US-10.AC1: label menyebut akun dari URL", () => {
    expect(instagramLabel("https://www.instagram.com/mana.bandung/")).toBe("Instagram @mana.bandung");
  });

  it("tanpa nama akun, label tetap bermakna", () => {
    expect(instagramLabel("https://www.instagram.com/")).toBe("Instagram");
  });
});

describe("isActivePath", () => {
  it.each(["/dago", "/dago/"])("menandai %s sebagai halaman aktif", (pathname) => {
    expect(isActivePath(pathname, "/dago")).toBe(true);
  });

  it("Beranda tidak menandai tautan apa pun", () => {
    expect(isActivePath("/", "/dago")).toBe(false);
  });
});
