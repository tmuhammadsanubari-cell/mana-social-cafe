// US-03: petunjuk arah dan peta tersemat (S-02, S-03). Google Maps dan OpenStreetMap selalu ditiru,
// jadi uji tidak mengirim permintaan ke luar.
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const GOOGLE = /^https:\/\/[^/]*google[^/]*\//;
const OSM = /^https:\/\/[^/]*openstreetmap\.org\//;
const STUB = { contentType: "text/html", body: "<!doctype html><title>Peta tiruan</title>" };
const FAILED = "Peta tidak dapat dimuat. Gunakan tombol Petunjuk Arah.";

const OUTLETS = [
  {
    id: "US-03.AC1",
    path: "/buah-batu",
    outlet: "buah-batu",
    name: "ManA Buah Batu",
    destination: "ManA Social Cafe, Jl. Buah Batu No.127, Bandung 40265",
    marker: "-6.9360055924259605,107.62226864418093",
  },
  {
    id: "US-03.AC2",
    path: "/dago",
    outlet: "dago",
    name: "ManA Dago",
    destination: "Jl. Cibengang No.21, Ciburial, Cimenyan",
    marker: "-6.853527158415028,107.64640213744224",
  },
];

const location = (page: Page) => page.getByRole("region", { name: "Cara ke sini" });
const directions = (page: Page) => page.getByRole("main").getByRole("link", { name: "Petunjuk Arah" });

/** Mencatat permintaan ke layanan peta dan menjawabnya dengan halaman tiruan. */
async function mockMaps(page: Page) {
  const requests: string[] = [];
  for (const service of [GOOGLE, OSM]) {
    await page.context().route(service, (route) => {
      requests.push(route.request().url());
      return route.fulfill(STUB);
    });
  }
  return requests;
}

for (const { id, path, outlet, name, destination, marker } of OUTLETS) {
  test.describe(`halaman ${path}`, () => {
    test(`${id}: Petunjuk Arah membuka Google Maps di tab baru`, async ({ page }) => {
      await mockMaps(page);
      await page.goto(path);
      await expect(directions(page)).toHaveCount(2);

      for (const button of await directions(page).all()) {
        const popup = page.waitForEvent("popup");
        await button.click();
        const opened = await popup;
        await opened.waitForURL(GOOGLE);
        const url = new URL(opened.url());

        expect(url.pathname).toBe("/maps/dir/");
        expect(url.searchParams.get("destination")).toBe(destination);
        await opened.close();
      }
      await expect(page).toHaveURL(new RegExp(`${path}/?$`));
    });

    test("US-03.AC3: peta baru dimuat saat area peta digulir", async ({ page }) => {
      const requests = await mockMaps(page);
      await page.goto(path, { waitUntil: "networkidle" });

      expect(requests).toEqual([]);
      await expect(page.locator("iframe")).toHaveCount(0);

      await location(page).scrollIntoViewIfNeeded();
      await page.getByTestId("outlet-map").scrollIntoViewIfNeeded();

      await expect(page.locator(`iframe[title="Peta ${name}"]`)).toBeVisible();
      await expect.poll(() => requests.length).toBe(1);
      const url = new URL(requests[0] as string);
      expect(url.hostname).toBe("www.openstreetmap.org");
      expect(url.pathname).toBe("/export/embed");
      expect(url.searchParams.get("marker")).toBe(marker);
    });

    test("US-03.AC4: klik tercatat dengan properti outlet setelah setuju", async ({ page }) => {
      await mockMaps(page);
      // gtag baru ada setelah pengunjung setuju (US-13), jadi di sini ditiru.
      await page.addInitScript(() => {
        const calls: unknown[][] = [];
        Object.assign(window, { calls, gtag: (...args: unknown[]) => calls.push(args) });
      });
      await page.goto(path);

      await directions(page).first().click();

      const calls = await page.evaluate(() => (window as unknown as { calls: unknown[][] }).calls);
      expect(calls).toEqual([["event", "click_directions", { outlet, page: path }]]);
    });

    test("kasus tepi 7.3: peta tidak merespons diganti alamat dan pesan", async ({ page }) => {
      await page.context().route(OSM, () => {
        // Sengaja tidak dijawab.
      });
      await page.clock.install();
      await page.goto(path);
      await page.getByTestId("outlet-map").scrollIntoViewIfNeeded();
      await expect(page.locator("iframe")).toHaveCount(1);
      await expect(location(page).getByText(FAILED)).toBeHidden();

      await page.clock.fastForward("00:11");

      await expect(location(page).getByText(FAILED)).toBeVisible();
      await expect(page.locator("iframe")).toHaveCount(0);
      await expect(page.getByTestId("outlet-map")).toContainText("Jl.");
      await expect(location(page).getByRole("link", { name: "Petunjuk Arah" })).toBeVisible();
    });

    test("NFR-06: bagian peta lolos axe dan tidak meluber di ponsel", async ({ page }) => {
      // Peta tidak dimuat di uji ini: menjalankan axe saat iframe lintas domain terpasang membuat
      // Firefox di CI crash. Judul iframe sudah diperiksa di US-03.AC3.
      await page.addInitScript(() => {
        window.IntersectionObserver = class {
          observe() {}
          unobserve() {}
        } as unknown as typeof IntersectionObserver;
      });
      await page.setViewportSize({ width: 360, height: 740 });
      await page.goto(path);
      await page.getByTestId("outlet-map").scrollIntoViewIfNeeded();
      await expect(page.locator("iframe")).toHaveCount(0);

      const { violations } = await new AxeBuilder({ page }).analyze();
      expect(violations.filter((item) => ["serious", "critical"].includes(item.impact ?? ""))).toEqual([]);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}

test("PRD 7.3: halaman Dago memuat catatan akses, Buah Batu tidak", async ({ page }) => {
  await mockMaps(page);
  await page.goto("/dago");
  await expect(location(page)).toContainText("Jalan menuju Dago menanjak dan sempit.");
  await expect(location(page)).toContainText("[CATATAN AKSES DARI PEMILIK");

  await page.goto("/buah-batu");
  await expect(location(page)).not.toContainText("menanjak");
});

test("US-03.AC4: tombol di panel Beranda juga tercatat", async ({ page }) => {
  await mockMaps(page);
  await page.route("https://foto.invalid/**", (route) => route.abort());
  await page.addInitScript(() => {
    const calls: unknown[][] = [];
    Object.assign(window, { calls, gtag: (...args: unknown[]) => calls.push(args) });
  });
  await page.goto("/");

  await directions(page).first().click();

  const calls = await page.evaluate(() => (window as unknown as { calls: unknown[][] }).calls);
  expect(calls).toEqual([["event", "click_directions", { outlet: "buah-batu", page: "/" }]]);
});

test.describe("tanpa JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("kasus tepi 7.3: alamat dan Petunjuk Arah tetap tersedia", async ({ page }) => {
    await page.goto("/dago");

    await expect(page.getByTestId("outlet-map")).toContainText("Jl. Cibengang No.21, Ciburial, Cimenyan");
    await expect(location(page).getByRole("link", { name: "Petunjuk Arah" })).toBeVisible();
    await expect(page.locator("iframe")).toHaveCount(0);
  });
});
