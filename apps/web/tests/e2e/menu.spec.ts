// US-04: halaman menu Buah Batu (S-04).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PHONE = { width: 360, height: 740 };
const TAP_MIN = 44;
const PDF_URL = "https://drive.google.com/file/d/11J0ZPLBY_zVp2iFSTEs1H9k17RMwYzKc/view";
const PIXEL = '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="12"/>';
const DAGO_NOTE = "Menu ManA Dago sedang disiapkan. Tanyakan menu hari ini lewat WhatsApp.";

const nav = (page: Page) => page.getByRole("navigation", { name: "Kategori menu" });
const tab = (page: Page, name: string) => nav(page).getByRole("button", { name });
const categoryLink = (page: Page, name: string) => nav(page).getByRole("link", { name, exact: true });
const categories = (page: Page) => page.locator("section[data-category]");
const item = (page: Page, name: string) =>
  page.getByTestId("menu-item").filter({ has: page.getByRole("heading", { name, exact: true }) });

async function visit(page: Page, path = "/menu") {
  await page.route("https://foto.invalid/**", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: PIXEL }),
  );
  await page.goto(path);
}

/** Jarak antara tepi bawah pita kategori dan judul kategori. */
async function gapBelowNav(page: Page, name: string) {
  const bar = await nav(page).boundingBox();
  const heading = await page.getByRole("heading", { level: 2, name }).boundingBox();
  return (heading?.y ?? 0) - ((bar?.y ?? 0) + (bar?.height ?? 0));
}

const recordEvents = (page: Page) =>
  page.addInitScript(() => {
    const calls: unknown[][] = [];
    Object.assign(window, { calls, gtag: (...args: unknown[]) => calls.push(args) });
  });
const events = (page: Page) => page.evaluate(() => (window as unknown as { calls: unknown[][] }).calls);

test("US-04.AC1: 19 kategori dan 75 item dengan harga", async ({ page }) => {
  await visit(page);

  await expect(categories(page)).toHaveCount(19);
  await expect(page.getByTestId("menu-item")).toHaveCount(75);
  await expect(page.getByTestId("menu-price")).toHaveCount(75);
  await expect(categories(page).filter({ visible: true })).toHaveCount(8);
  await expect(item(page, "Nasi Goreng ManA")).toContainText("Rp40.000");

  await tab(page, "Minuman").click();

  await expect(categories(page).filter({ visible: true })).toHaveCount(11);
  await expect(item(page, "Es Kopi Susu Mana")).toContainText("Rp28.000");
  await expect(item(page, "Air Mineral 550 ml")).toContainText("Rp13.000");
});

for (const reducedMotion of ["no-preference", "reduce"] as const) {
  test(`US-04.AC2: kategori yang dipilih naik ke atas dan ditandai aktif (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion });
    await visit(page);
    await tab(page, "Minuman").click();

    await categoryLink(page, "Coffee: Kopsu Series").click();

    await expect.poll(() => gapBelowNav(page, "Coffee: Kopsu Series")).toBeGreaterThanOrEqual(-1);
    await expect.poll(() => gapBelowNav(page, "Coffee: Kopsu Series")).toBeLessThan(40);
    await expect(categoryLink(page, "Coffee: Kopsu Series")).toHaveAttribute("aria-current", "true");
    await expect(nav(page).locator('a[aria-current="true"]')).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: "Coffee: Kopsu Series" })).toBeFocused();
    expect((await nav(page).boundingBox())?.y).toBeCloseTo(0, 0);
  });
}

test("US-04.AC2: penanda aktif mengikuti gulir pengunjung", async ({ page }) => {
  await visit(page);
  await expect(categoryLink(page, "New Menu: Beef")).toHaveAttribute("aria-current", "true");
  await categoryLink(page, "All About Rice: Asian").click();
  await expect.poll(() => gapBelowNav(page, "All About Rice: Asian")).toBeLessThan(40);

  await page.mouse.move(200, 400);
  await expect(async () => {
    await page.mouse.wheel(0, 500);
    await expect(categoryLink(page, "All About Rice: Asian")).not.toHaveAttribute("aria-current", "true", {
      timeout: 500,
    });
  }).toPass();
  await expect(nav(page).locator('a[aria-current="true"]')).toHaveCount(1);
});

test("US-04.AC2: tautan langsung ke kategori minuman membuka tab Minuman", async ({ page }) => {
  await visit(page, "/menu#kategori-coffee-kopsu-series");

  await expect(tab(page, "Minuman")).toHaveAttribute("aria-pressed", "true");
  await expect(categoryLink(page, "Coffee: Kopsu Series")).toHaveAttribute("aria-current", "true");
  await expect.poll(() => gapBelowNav(page, "Coffee: Kopsu Series")).toBeLessThan(40);
});

test("US-04.AC3: item pedas punya ikon bernama Pedas", async ({ page }) => {
  await visit(page);

  await expect(item(page, "Chicken Manchurian").getByRole("img", { name: "Pedas" })).toBeVisible();
  await expect(item(page, "Chicken Nanban").getByRole("img", { name: "Pedas" })).toHaveCount(0);
  await expect(page.getByTestId("menu-item").getByRole("img", { name: "Pedas" })).toHaveCount(7);
});

test("US-04.AC4: Upside Cloud tanpa harga tampil Tanya barista", async ({ page }) => {
  await visit(page);
  await tab(page, "Minuman").click();

  await expect(item(page, "Upside Cloud").getByTestId("menu-price")).toHaveText("Tanya barista");
});

test("US-04.AC5: Lihat menu versi PDF membuka URL pengaturan di tab baru", async ({ page }) => {
  await page
    .context()
    .route("https://drive.google.com/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<!doctype html><title>PDF tiruan</title>" }),
    );
  await visit(page);
  const popup = page.waitForEvent("popup");

  await page.getByRole("link", { name: "Lihat menu versi PDF" }).click();

  const opened = await popup;
  await opened.waitForURL(PDF_URL);
  await expect(page).toHaveURL(/\/menu\/?$/);
});

test("foto tinggi tidak melarkan kartu: kotak foto tetap persegi", async ({ page }) => {
  await visit(page);
  const photo = item(page, "Nasi Beef Teriyaki").locator("div").first();
  await expect(photo.locator("img")).toHaveJSProperty("complete", true);

  const box = await photo.boundingBox();

  expect(box?.height).toBeCloseTo(box?.width ?? 0, 0);
});

test("tambahan dan upgrade tampil sebagai chip, bukan item", async ({ page }) => {
  await visit(page);
  await tab(page, "Minuman").click();
  const addOns = page.getByRole("region", { name: "Add-On" });

  await expect(addOns).toContainText("Extra shot");
  await expect(addOns).toContainText("Rp5.000");
  await expect(addOns.getByTestId("menu-item")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Coffee: Classic Series" })).toContainText("Now Blooming");
});

test("PRD 17: halaman menu dan pilihan kategori tercatat setelah setuju", async ({ page }) => {
  await recordEvents(page);
  await visit(page);
  await categoryLink(page, "The Noodles").click();

  expect(await events(page)).toEqual([
    ["event", "view_menu", { outlet: "buah-batu" }],
    ["event", "select_menu_category", { category: "The Noodles" }],
  ]);
});

test("kasus tepi 7.4: menu Buah Batu menyebut menu Dago yang belum ada", async ({ page }) => {
  await visit(page);
  const main = page.getByRole("main");

  await expect(main).toContainText(DAGO_NOTE);
  await expect(main.getByRole("link", { name: "Tanyakan menu hari ini lewat WhatsApp" })).toHaveAttribute(
    "href",
    /^https:\/\/wa\.me\/6285724785388\?text=Halo%20ManA%20Dago/,
  );
});

test("kasus tepi 7.4: Menu di halaman Dago menampilkan catatan, bukan menu Buah Batu", async ({ page }) => {
  await visit(page, "/dago");

  await page.getByRole("navigation", { name: "Utama" }).getByRole("link", { name: "Menu" }).click();

  await expect(page).toHaveURL(/\/dago\/?#menu-dago$/);
  const note = page.getByRole("region", { name: "Menu" });
  await expect(note).toBeInViewport();
  await expect(note).toContainText(DAGO_NOTE);
  await expect(note.getByRole("link", { name: "Tanya menu Dago" })).toHaveAttribute("href", /wa\.me/);
  await expect(note.getByRole("link", { name: "Lihat menu Buah Batu" })).toHaveAttribute("href", "/menu");
  await expect(page.getByTestId("menu-item")).toHaveCount(0);
});

test.describe("ponsel", () => {
  test.use({ viewport: PHONE });

  test("menu navigasi tertutup setelah menuju catatan menu Dago", async ({ page }) => {
    await visit(page, "/dago");
    const main = page.getByRole("navigation", { name: "Utama" });
    await main.getByRole("button", { name: "Menu" }).click();

    await main.getByRole("link", { name: "Menu" }).click();

    await expect(main.getByRole("link", { name: "Menu" })).toBeHidden();
    await expect(page.getByRole("region", { name: "Menu" })).toBeInViewport();
  });

  test("NFR-06: pita kategori bisa digeser, target 44 px, tanpa luber, lolos axe", async ({ page }) => {
    await visit(page);
    await tab(page, "Minuman").click();
    await categoryLink(page, "Others").click();

    await expect(categoryLink(page, "Others")).toBeInViewport();
    for (const target of await nav(page).locator("a:visible, button:visible").all()) {
      const box = await target.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(TAP_MIN);
      expect(box?.width).toBeGreaterThanOrEqual(TAP_MIN);
    }
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""))).toEqual([]);
  });
});

test.describe("tanpa JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("semua kategori dan item terbaca, tab disembunyikan", async ({ page }) => {
    await visit(page);

    await expect(nav(page).getByRole("button")).toHaveCount(0);
    await expect(categories(page).filter({ visible: true })).toHaveCount(19);
    await expect(page.getByTestId("menu-item").filter({ visible: true })).toHaveCount(75);
    await expect(categoryLink(page, "Coffee: Kopsu Series")).toHaveAttribute(
      "href",
      "#kategori-coffee-kopsu-series",
    );
  });
});
