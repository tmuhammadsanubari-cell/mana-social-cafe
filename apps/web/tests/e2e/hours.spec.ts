// US-02: status buka di halaman outlet (S-02, S-03). Waktu selalu dipalsukan.
// 2026-11-30 adalah Senin.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const monday = (clock: string) => new Date(`2026-11-30T${clock}:00+07:00`);
const status = (page: Page) => page.getByTestId("open-status");
const table = (page: Page, outlet: string) => page.getByRole("table", { name: `Jam buka ${outlet}` });

async function visit(page: Page, path: string, clock: string) {
  await page.clock.setFixedTime(monday(clock));
  await page.goto(path);
}

const CASES = [
  { id: "US-02.AC1", clock: "10:00", text: "Buka, tutup pukul 23.00" },
  { id: "US-02.AC2", clock: "22:40", text: "Segera tutup, tutup pukul 23.00" },
  { id: "US-02.AC3", clock: "07:15", text: "Tutup, buka pukul 08.00" },
];

for (const { id, clock, text } of CASES) {
  test(`${id}: pukul ${clock} WIB status Buah Batu "${text}"`, async ({ page }) => {
    await visit(page, "/buah-batu", clock);
    await expect(status(page)).toHaveText(text);
  });
}

for (const timezoneId of ["America/New_York", "Asia/Jayapura"]) {
  test.describe(`browser di ${timezoneId}`, () => {
    test.use({ timezoneId });

    test("US-02.AC4: status tetap dihitung dalam WIB", async ({ page }) => {
      await visit(page, "/buah-batu", "22:40");
      await expect(status(page)).toHaveText("Segera tutup, tutup pukul 23.00");
      await expect(table(page, "ManA Buah Batu").locator('tr[aria-current="date"]')).toContainText("Senin");
    });
  });
}

test("US-02: halaman Dago memakai jam Dago", async ({ page }) => {
  await visit(page, "/dago", "10:00");
  await expect(status(page)).toHaveText("Tutup, buka pukul 11.00");
  await expect(page.getByRole("main")).toContainText("Setiap hari 11.00–22.00 WIB");
});

test("US-02: status diperbarui tanpa memuat ulang halaman", async ({ page }) => {
  await page.clock.install({ time: monday("22:29") });
  await page.goto("/buah-batu");
  await expect(status(page)).toHaveText("Buka, tutup pukul 23.00");

  await page.clock.fastForward("02:00");

  await expect(status(page)).toHaveText("Segera tutup, tutup pukul 23.00");
});

test("US-02: tabel jam memuat tujuh hari dan menandai hari ini", async ({ page }) => {
  await visit(page, "/buah-batu", "10:00");
  const rows = table(page, "ManA Buah Batu").getByRole("row");

  await expect(rows).toHaveCount(7);
  // useInnerText: penanda "hari ini" yang tersembunyi tetap ada di textContent.
  await expect(rows.first()).toContainText("Senin · hari ini", { useInnerText: true });
  await expect(rows.first()).toContainText("08.00–23.00");
  await expect(rows.nth(1)).not.toContainText("hari ini", { useInnerText: true });
});

test("kasus tepi 7.2: jam hari ini kosong menampilkan ajakan bertanya", async ({ page }) => {
  // Data uji punya jam lengkap, jadi jam di halaman dikosongkan sebelum sampai ke browser.
  await page.route("**/buah-batu", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/data-hours="[^"]*"/, 'data-hours="[]"');
    await route.fulfill({ response, body });
  });
  await visit(page, "/buah-batu", "10:00");

  await expect(status(page)).toHaveText("Jam hari ini belum tersedia. Tanyakan lewat WhatsApp.");
  await expect(status(page).locator("svg")).toBeHidden();
});

for (const path of ["/buah-batu", "/dago"]) {
  test(`NFR-06: ${path} dengan status tampil lolos axe`, async ({ page }) => {
    await visit(page, path, "21:45");
    await expect(status(page)).toBeVisible();
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
  });
}

test.describe("tanpa JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("kasus tepi 7.2: tabel jam mingguan tampil tanpa status", async ({ page }) => {
    await page.goto("/buah-batu");

    await expect(status(page)).toBeHidden();
    await expect(table(page, "ManA Buah Batu").getByRole("row")).toHaveCount(7);
    await expect(page.getByRole("main")).not.toContainText("hari ini", { useInnerText: true });
  });
});
