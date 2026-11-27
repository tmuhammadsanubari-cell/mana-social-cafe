// US-05: galeri ruang di S-02, S-03, dan Beranda. Data uji: Buah Batu 12 foto, Dago belum ada.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const PHOTO_URL = "https://foto.invalid/**";
const PIXEL = '<svg xmlns="http://www.w3.org/2000/svg" width="4" height="3"/>';
const PHONE = { width: 360, height: 740 };
const TAP_MIN = 44;
const CREAM = "rgb(236, 231, 170)"; // --color-cream, #ECE7AA (kasus tepi 7.5)

const gallery = (page: Page, name = "Galeri Buah Batu") => page.getByRole("region", { name });
const thumbs = (page: Page) => gallery(page).getByRole("list").getByRole("link");
const viewer = (page: Page) => page.getByRole("dialog", { name: "Foto Galeri Buah Batu" });
const slide = (page: Page, index: number) => viewer(page).locator("img").nth(index);
const button = (page: Page, name: string) => viewer(page).getByRole("button", { name });

async function visit(page: Page, path = "/buah-batu") {
  await page.route(PHOTO_URL, (route) => route.fulfill({ contentType: "image/svg+xml", body: PIXEL }));
  await page.goto(path);
}

/** Foto ke-`position` (mulai dari 1) tampil penuh di layar. */
async function expectShown(page: Page, position: number) {
  await expect(viewer(page).getByText(`${position} dari 12`)).toBeVisible();
  await expect(slide(page, position - 1)).toBeInViewport({ ratio: 0.99 });
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""));
}

test("US-05.AC1: 12 foto tampil dengan teks alternatif tidak kosong", async ({ page }) => {
  await visit(page);
  const images = gallery(page).getByRole("list").locator("img");

  await expect(images).toHaveCount(12);
  for (const image of await images.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute("alt", /\S/);
    await expect(image).toHaveAttribute("loading", "lazy");
  }
});

test("US-05.AC2: foto yang ditekan terbuka dalam tampilan penuh", async ({ page }) => {
  await visit(page);
  await expect(viewer(page)).toBeHidden();

  await thumbs(page).nth(2).click();

  await expect(viewer(page)).toBeVisible();
  await expectShown(page, 3);
  await expect(page).toHaveURL(/\/buah-batu\/?$/);
});

test("US-05.AC2: foto digeser ke kiri dan kanan", async ({ page }) => {
  await visit(page);
  await thumbs(page).nth(2).click();
  const track = viewer(page).getByRole("group", { name: "Foto" });
  const swipe = (direction: number) =>
    track.evaluate((element, step) => element.scrollBy({ left: step * element.clientWidth }), direction);

  await swipe(1);
  await expectShown(page, 4);
  await swipe(-1);
  await expectShown(page, 3);
});

test("US-05.AC2: tombol dan tombol panah memindah foto", async ({ page }) => {
  await visit(page);
  await thumbs(page).nth(2).click();

  await button(page, "Berikutnya").click();
  await expectShown(page, 4);
  await button(page, "Sebelumnya").click();
  await expectShown(page, 3);
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  await expectShown(page, 5);
  await page.keyboard.press("ArrowLeft");
  await expectShown(page, 4);
});

test("US-05.AC2: foto pertama dan terakhir menonaktifkan tombol di ujung", async ({ page }) => {
  await visit(page);
  await thumbs(page).first().click();
  await expect(button(page, "Sebelumnya")).toHaveAttribute("aria-disabled", "true");
  await page.keyboard.press("ArrowLeft");
  await expectShown(page, 1);
  await button(page, "Tutup").click();

  await thumbs(page).last().click();
  await expectShown(page, 12);
  await expect(button(page, "Berikutnya")).toHaveAttribute("aria-disabled", "true");
  await expect(button(page, "Sebelumnya")).toHaveAttribute("aria-disabled", "false");
});

for (const way of ["Tutup", "Escape"]) {
  test(`US-05.AC2: ditutup dengan ${way} dan fokus kembali ke foto`, async ({ page }) => {
    await visit(page);
    await thumbs(page).nth(1).press("Enter");
    await expect(viewer(page)).toBeVisible();
    await expect(button(page, "Tutup")).toBeFocused();

    if (way === "Escape") await page.keyboard.press("Escape");
    else await button(page, "Tutup").click();

    await expect(viewer(page)).toBeHidden();
    await expect(thumbs(page).nth(1)).toBeFocused();

    await thumbs(page).nth(4).click();
    await expectShown(page, 5);
  });
}

test("kasus tepi 7.5: foto gagal dimuat diganti kotak cream berisi teks alternatif", async ({ page }) => {
  await page.route(PHOTO_URL, (route) => route.abort());
  await page.goto("/buah-batu");
  const first = thumbs(page).first();
  await first.scrollIntoViewIfNeeded();

  await expect(first.locator("img")).toBeHidden();
  await expect(first.getByText("[DATA UJI] Void melingkar Buah Batu")).toBeVisible();
  await expect(first).toHaveCSS("background-color", CREAM);
});

test("kasus tepi 7.5: outlet dengan foto di bawah 6 tidak menampilkan galeri", async ({ page }) => {
  await visit(page, "/dago");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText("ManA Dago");
  await expect(page.getByRole("heading", { name: /Galeri/ })).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator("dialog")).toHaveCount(0);
});

test("PRD 8.6: Beranda menampilkan 6 foto setelah pemilih outlet", async ({ page }) => {
  await visit(page, "/");
  const section = gallery(page, "Galeri");

  await expect(section.getByRole("list").locator("img")).toHaveCount(6);
  await section.getByRole("list").getByRole("link").nth(5).click();
  await expect(page.getByRole("dialog", { name: "Foto Galeri" }).getByText("6 dari 6")).toBeVisible();
});

for (const { width, columns } of [
  { width: 360, columns: 1 },
  { width: 800, columns: 2 },
  { width: 1280, columns: 3 },
]) {
  test(`PRD 8.10: lebar ${width} px memakai ${columns} kolom`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await visit(page);
    await expect(thumbs(page)).toHaveCount(12);

    const lefts = await thumbs(page).evaluateAll((links) =>
      links.map((link) => Math.round(link.getBoundingClientRect().left)),
    );
    expect(new Set(lefts).size).toBe(columns);
  });
}

test.describe("ponsel 360 px", () => {
  test.use({ viewport: PHONE });

  for (const path of ["/", "/buah-batu"]) {
    test(`NFR-06: galeri di ${path} tidak meluber dan target minimal 44 px`, async ({ page }) => {
      await visit(page, path);
      const name = path === "/" ? "Galeri" : "Galeri Buah Batu";
      await gallery(page, name).getByRole("list").getByRole("link").first().click();

      const buttons = page.getByRole("dialog").getByRole("button");
      await expect(buttons).toHaveCount(3);
      for (const target of await buttons.all()) {
        await expect(target).toBeInViewport({ ratio: 1 });
        const box = await target.boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(TAP_MIN);
        expect(box?.width).toBeGreaterThanOrEqual(TAP_MIN);
      }
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  }
});

test("NFR-06: galeri dan tampilan penuh lolos axe", async ({ page }) => {
  await visit(page);
  await expect(thumbs(page)).toHaveCount(12);
  expect(await seriousViolations(page)).toEqual([]);

  await thumbs(page).first().click();
  await expect(viewer(page)).toBeVisible();
  // Tunggu fade selesai supaya axe tidak menilai kontras di tengah transisi.
  await expect(viewer(page)).toHaveCSS("opacity", "1");
  expect(await seriousViolations(page)).toEqual([]);
});

test.describe("tanpa JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("US-05: foto tetap tampil dan tautan membuka file foto", async ({ page }) => {
    await visit(page);

    await expect(thumbs(page)).toHaveCount(12);
    await expect(thumbs(page).first()).toHaveAttribute("href", /^https:\/\/foto\.invalid\/.*w=1440/);
    await expect(viewer(page)).toBeHidden();
  });
});
