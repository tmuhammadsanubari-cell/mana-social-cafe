import { describe, expect, it } from "vitest";
import { todayHoursText } from "../../src/lib/formatHours";
import { photoSources } from "../../src/lib/image";
import { OUTLET_PANEL_COPY, facilityPlaceholder, mainFacilities } from "../../src/lib/outletPanel";
import { generalMessage, whatsAppUrl } from "../../src/lib/whatsapp";

// 2026-11-30 adalah Senin.
const monday = (clock: string) => new Date(`2026-11-30T${clock}:00+07:00`);
const week = [
  { weekday: 1, opensAt: "08:00", closesAt: "23:00" },
  { weekday: 2, opensAt: "10:00", closesAt: "00:00" },
];

describe("todayHoursText", () => {
  it("US-01.AC2: menyebut jam hari ini dalam WIB", () => {
    expect(todayHoursText(week, monday("10:00"))).toBe("Hari ini 08.00–23.00 WIB");
  });

  it("US-02.AC4: hari mengikuti WIB, bukan UTC", () => {
    // Selasa 00.30 WIB masih Senin 17.30 UTC.
    const tuesdayEarly = new Date("2026-11-30T17:30:00Z");
    expect(todayHoursText(week, tuesdayEarly)).toBe("Hari ini 10.00–00.00 WIB");
  });

  it("kasus tepi 7.2: jam hari ini kosong tidak menghasilkan teks", () => {
    expect(todayHoursText([], monday("10:00"))).toBeNull();
  });
});

describe("tautan WhatsApp", () => {
  it("BR-03: pesan menyebut outlet dan berasal dari website", () => {
    expect(generalMessage("ManA Dago")).toBe("Halo ManA Dago, saya ingin bertanya. (dari website)");
  });

  it("BR-03: memakai nomor pengaturan situs dan pesan di-encode", () => {
    const url = new URL(whatsAppUrl("6285724785388", generalMessage("ManA Dago")));

    expect(url.origin + url.pathname).toBe("https://wa.me/6285724785388");
    expect(url.searchParams.get("text")).toBe(generalMessage("ManA Dago"));
    expect(url.search).not.toContain(" ");
  });
});

describe("panel outlet", () => {
  it("US-01.AC2: chip bernama Buah Batu dan Dago", () => {
    expect(OUTLET_PANEL_COPY["buah-batu"].chip).toBe("Buah Batu");
    expect(OUTLET_PANEL_COPY.dago.chip).toBe("Dago");
  });

  it("US-01.AC3: tautan Dago berbunyi Lihat Dago dan Cottage", () => {
    expect(OUTLET_PANEL_COPY.dago.linkLabel).toBe("Lihat Dago dan Cottage");
  });

  it("FR-02: hanya fasilitas utama, enam pertama sesuai urutan", () => {
    const facilities = Array.from({ length: 8 }, (_, index) => ({ label: `F${index}`, isAvailable: true }));
    expect(mainFacilities(facilities).map((item) => item.label)).toEqual([
      "F0",
      "F1",
      "F2",
      "F3",
      "F4",
      "F5",
    ]);
  });

  it("fasilitas yang belum diisi memakai placeholder berlabel", () => {
    expect(facilityPlaceholder("dago")).toBe("[FASILITAS DAGO DARI PEMILIK]");
  });
});

describe("photoSources", () => {
  it("NFR-01: meminta ukuran dan format hemat dari CDN", () => {
    const { src, srcset } = photoSources("https://cdn.sanity.io/images/p/d/abc-2000x1500.jpg");

    expect(src).toBe("https://cdn.sanity.io/images/p/d/abc-2000x1500.jpg?w=960&auto=format&fit=max");
    expect(srcset.split(", ")).toHaveLength(3);
    expect(srcset).toContain("w=480&auto=format&fit=max 480w");
  });
});
