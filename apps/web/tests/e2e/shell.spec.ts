// Kerangka bersama semua halaman: header, footer, dan aksesibilitas (PRD 8.4, 8.10, US-10).
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PAGES = [
  { path: "/", heading: "Dua tempat ngobrol di Bandung" },
  { path: "/buah-batu", heading: "ManA Buah Batu" },
  { path: "/dago", heading: "ManA Dago" },
  { path: "/menu", heading: "Menu ManA Buah Batu" },
];
const PHONE = { width: 360, height: 740 };
const TAP_MIN = 44;

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""));
}

for (const { path, heading } of PAGES) {
  test.describe(`halaman ${path}`, () => {
    test("US-10.AC1: footer punya tautan Instagram yang terbuka di tab baru", async ({ page }) => {
      await page.goto(path);
      const link = page.getByRole("contentinfo").getByRole("link", { name: "Instagram @mana.bandung" });

      await expect(link).toHaveAttribute("href", "https://www.instagram.com/mana.bandung/");
      await expect(link).toHaveAttribute("target", "_blank");
    });

    test("US-10.AC2: tidak ada tautan TikTok", async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('a[href*="tiktok"]')).toHaveCount(0);
    });

    test("menampilkan judul dan lolos axe di desktop dan ponsel", async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
      expect(await seriousViolations(page)).toEqual([]);

      await page.setViewportSize(PHONE);
      expect(await seriousViolations(page)).toEqual([]);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}

test("PRD 8.4: footer memuat alamat dan jam kedua outlet", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  await expect(footer).toContainText("Jl. Buah Batu No.127, Cijagra, Lengkong, Bandung 40265");
  await expect(footer).toContainText("Setiap hari 08.00–23.00 WIB");
  await expect(footer).toContainText("Jl. Cibengang No.21, Ciburial, Cimenyan");
  await expect(footer).toContainText("Setiap hari 11.00–22.00 WIB");
});

test("PRD 8.4: navigasi desktop membuka halaman dan menandai halaman aktif", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: "Utama" });
  await expect(nav.getByRole("button", { name: "Menu" })).toBeHidden();
  // --color-ink: bawaan browser untuk [popover] tidak boleh menimpa warna teks di header.
  await expect(nav.getByRole("link", { name: "Buah Batu", exact: true })).toHaveCSS(
    "color",
    "rgb(45, 44, 30)",
  );

  await nav.getByRole("link", { name: "Dago dan Cottage" }).click();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ManA Dago");
  await expect(nav.getByRole("link", { name: "Dago dan Cottage" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("link", { name: "ManA Social Cafe, ke Beranda" }).click();
  await expect(page).toHaveURL("/");
});

test.describe("ponsel", () => {
  test.use({ viewport: PHONE });

  test("PRD 8.4: tombol Menu membuka navigasi dan Escape menutupnya", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Utama" });
    const link = nav.getByRole("link", { name: "Buah Batu", exact: true });
    await expect(link).toBeHidden();

    await nav.getByRole("button", { name: "Menu" }).press("Enter");
    await expect(link).toBeVisible();
    await expect(nav.getByRole("button", { name: "Tutup" })).toBeVisible();
    expect(await seriousViolations(page)).toEqual([]);

    await page.keyboard.press("Escape");
    await expect(link).toBeHidden();
  });

  test("tombol Tutup menutup menu dan tautan membuka halaman", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Utama" });

    await nav.getByRole("button", { name: "Menu" }).click();
    await nav.getByRole("button", { name: "Tutup" }).click();
    await expect(nav.getByRole("link", { name: "Menu", exact: true })).toBeHidden();

    await nav.getByRole("button", { name: "Menu" }).click();
    await nav.getByRole("link", { name: "Menu", exact: true }).click();
    await expect(page).toHaveURL(/\/menu\/?$/);
  });

  test("NFR-06: target sentuh header dan footer minimal 44 px", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    const targets = page.locator("header a:visible, header button:visible, footer a:visible");

    for (const target of await targets.all()) {
      const box = await target.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(TAP_MIN);
      expect(box?.width).toBeGreaterThanOrEqual(TAP_MIN);
    }
  });
});
