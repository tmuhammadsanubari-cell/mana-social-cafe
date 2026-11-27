// US-01: hero dan pemilih outlet di Beranda (S-01). Waktu selalu dipalsukan.
// 2026-11-30 adalah Senin.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PHONE = { width: 360, height: 740 };
const TAP_MIN = 44;
const PHOTO_URL = "https://foto.invalid/**";
const PIXEL = '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"/>';

const hero = (page: Page) => page.getByTestId("home-hero");
const chips = (page: Page) => page.getByRole("group", { name: "Pilih outlet" }).getByRole("button");
const chip = (page: Page, name: string) => chips(page).filter({ hasText: name });
const panels = (page: Page) => page.getByTestId("outlet-panel").filter({ visible: true });

async function visit(page: Page, clock = "10:00") {
  await page.clock.setFixedTime(new Date(`2026-11-30T${clock}:00+07:00`));
  await page.route(PHOTO_URL, (route) => route.fulfill({ contentType: "image/svg+xml", body: PIXEL }));
  await page.goto("/");
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""));
}

test.describe("ponsel 360 px", () => {
  test.use({ viewport: PHONE });

  test("US-01.AC1: logo, positioning, dan navigasi terlihat tanpa menggulir", async ({ page }) => {
    await visit(page);

    for (const target of [
      page.getByRole("link", { name: "ManA Social Cafe, ke Beranda" }),
      page.getByRole("heading", { level: 1, name: "Dua tempat ngobrol di Bandung" }),
      page.getByRole("navigation", { name: "Utama" }).getByRole("button", { name: "Menu" }),
    ]) {
      await expect(target).toBeInViewport({ ratio: 1 });
    }
  });

  test("US-01.AC1: pemilih outlet langsung setelah hero, hero tanpa tombol", async ({ page }) => {
    await visit(page);

    await expect(hero(page).locator("a, button")).toHaveCount(0);
    await expect(hero(page).locator("+ section").getByRole("heading", { level: 2 })).toHaveText(
      "Mau ketemu di mana?",
    );
  });

  test("NFR-06: chip dan tautan panel minimal 44 px, tanpa gulir samping", async ({ page }) => {
    await visit(page);
    // Target galeri di bawahnya diperiksa di gallery.spec.ts.
    const targets = page
      .getByRole("region", { name: "Mau ketemu di mana?" })
      .locator("a:visible, button:visible");
    await expect(targets).toHaveCount(5);

    for (const target of await targets.all()) {
      const box = await target.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(TAP_MIN);
      expect(box?.width).toBeGreaterThanOrEqual(TAP_MIN);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
});

test("US-01.AC2: dua chip, Buah Batu aktif, satu panel dengan info Buah Batu", async ({ page }) => {
  await visit(page);

  await expect(chips(page)).toHaveText(["Buah Batu", "Dago"]);
  await expect(chip(page, "Buah Batu")).toHaveAttribute("aria-pressed", "true");
  await expect(chip(page, "Dago")).toHaveAttribute("aria-pressed", "false");
  await expect(panels(page)).toHaveCount(1);
  await expect(panels(page).getByRole("heading", { level: 3 })).toHaveText("ManA Buah Batu");
  await expect(panels(page)).toContainText("Jl. Buah Batu No.127, Cijagra, Lengkong, Bandung 40265");
  await expect(panels(page).getByText("Hari ini 08.00–23.00 WIB")).toBeVisible();
  await expect(panels(page).getByTestId("open-status")).toHaveText("Buka, tutup pukul 23.00");
  await expect(panels(page).getByRole("table")).toBeHidden();
});

test("FR-02: panel memuat foto, fasilitas, arah, WhatsApp, dan tautan outlet", async ({ page }) => {
  await visit(page);
  const panel = panels(page);

  await expect(panel.getByRole("img", { name: "[DATA UJI] Void melingkar Buah Batu" })).toBeVisible();
  await expect(panel.getByRole("list", { name: "Fasilitas utama" })).toContainText("Tanpa AC");
  await expect(panel.getByRole("link", { name: "Petunjuk Arah" })).toHaveAttribute(
    "href",
    /^https:\/\/www\.google\.com\/maps\/dir\/.*Buah%20Batu/,
  );
  await expect(panel.getByRole("link", { name: "Petunjuk Arah" })).toHaveAttribute("target", "_blank");
  await expect(panel.getByRole("link", { name: "Tanya dulu via WhatsApp" })).toHaveAttribute(
    "href",
    "https://wa.me/6285724785388?text=Halo%20ManA%20Buah%20Batu%2C%20saya%20ingin%20bertanya.%20(dari%20website)",
  );
  await expect(panel.getByRole("link", { name: "Lihat Buah Batu" })).toHaveAttribute("href", "/buah-batu");
});

test("US-01.AC3: chip Dago mengganti panel tanpa memuat ulang dan membuka S-03", async ({ page }) => {
  await visit(page);
  await page.evaluate(() => document.body.setAttribute("data-same-document", "true"));

  await chip(page, "Dago").click();

  await expect(page.locator("body")).toHaveAttribute("data-same-document", "true");
  await expect(chip(page, "Dago")).toHaveAttribute("aria-pressed", "true");
  await expect(chip(page, "Buah Batu")).toHaveAttribute("aria-pressed", "false");
  await expect(panels(page)).toHaveCount(1);
  await expect(panels(page)).toContainText("Jl. Cibengang No.21, Ciburial, Cimenyan");
  await expect(panels(page).getByText("Hari ini 11.00–22.00 WIB")).toBeVisible();
  await expect(panels(page).getByTestId("open-status")).toHaveText("Tutup, buka pukul 11.00");
  await expect(panels(page)).toContainText("[FOTO RUANG: Dago, view lampu kota malam]");
  await expect(panels(page)).toContainText("[FASILITAS DAGO DARI PEMILIK]");
  expect(await seriousViolations(page)).toEqual([]);

  await panels(page).getByRole("link", { name: "Lihat Dago dan Cottage" }).click();

  await expect(page).toHaveURL(/\/dago\/?$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ManA Dago");
});

test("US-01.AC3: chip bisa dipakai dengan keyboard, bolak-balik", async ({ page }) => {
  await visit(page);

  await chip(page, "Dago").press("Enter");
  await expect(panels(page).getByRole("heading", { level: 3 })).toHaveText("ManA Dago");

  await chip(page, "Buah Batu").press("Space");
  await expect(panels(page).getByRole("heading", { level: 3 })).toHaveText("ManA Buah Batu");
});

test("US-01.AC2: jam hari ini kosong menyembunyikan baris jam", async ({ page }) => {
  await page.route(/\/$/, async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/data-today-hours="[^"]*"/, 'data-today-hours="[]"');
    await route.fulfill({ response, body });
  });
  await visit(page);

  await expect(panels(page).locator("[data-today-hours]")).toBeHidden();
  await expect(panels(page).getByRole("table")).toBeHidden();
});

test("kasus tepi 7.1: foto gagal dimuat diganti kotak berlabel nama outlet", async ({ page }) => {
  await page.route(PHOTO_URL, (route) => route.abort());
  await page.goto("/");
  const panel = panels(page);

  await expect(panel.getByRole("img", { name: "[DATA UJI] Void melingkar Buah Batu" })).toBeHidden();
  await expect(panel.getByTestId("photo-fallback")).toBeVisible();
  await expect(panel.getByTestId("photo-fallback")).toHaveText("ManA Buah Batu");
});

test("NFR-06: Beranda lolos axe", async ({ page }) => {
  await visit(page);
  await expect(panels(page).getByTestId("open-status")).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});

test.describe("tanpa JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("kasus tepi 7.1: chip tersembunyi dan kedua panel tampil lengkap", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("group", { name: "Pilih outlet" })).toBeHidden();
    await expect(panels(page)).toHaveCount(2);
    for (const name of ["ManA Buah Batu", "ManA Dago"]) {
      await expect(page.getByRole("table", { name: `Jam buka ${name}` }).getByRole("row")).toHaveCount(7);
    }
    await expect(panels(page).getByTestId("open-status")).toHaveCount(2);
    await expect(panels(page).getByTestId("open-status").filter({ visible: true })).toHaveCount(0);
    await expect(panels(page).getByRole("link", { name: "Petunjuk Arah" })).toHaveCount(2);
  });
});
