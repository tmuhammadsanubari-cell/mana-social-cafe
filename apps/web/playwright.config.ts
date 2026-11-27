// E2E di tiga browser (PRD 15). Situs dibangun dengan data uji tetap agar hasilnya
// tidak berubah saat staf mengedit CMS (ADR 0007).
import { defineConfig, devices } from "@playwright/test";

const PORT = 4329; // bukan port dev server, supaya uji tidak memakai build yang salah
const BASE_URL = `http://localhost:${PORT}`;
const isCi = Boolean(process.env.CI);
// "chrome" memakai Google Chrome yang sudah terpasang, tanpa mengunduh Chromium Playwright.
const channel = process.env.PLAYWRIGHT_CHANNEL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  reporter: isCi ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], ...(channel ? { channel } : {}) } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    env: { CONTENT_SOURCE: "fixture", BUILD_ENV: "preview" },
    timeout: 120_000,
  },
});
