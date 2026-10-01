import { defineConfig, devices } from "@playwright/test";

// The suites run against the production build served by `vite preview`, under the same
// /zaapi-take-home/ base path GitHub Pages uses. scripts/test builds first.
const port = 4173;

export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "list" : [["list"], ["html", { open: "never" }]],
  use: { baseURL: `http://localhost:${port}/zaapi-take-home/`, viewport: { width: 1440, height: 900 } },
  projects: [
    {
      name: "chromium",
      // CI uses Playwright's bundled Chromium. The dev machine runs macOS 13, which current Playwright
      // no longer ships Chromium for, so locally the installed Google Chrome is driven instead.
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, channel: process.env.CI ? undefined : "chrome" },
    },
  ],
  webServer: {
    command: `npx vite preview --port ${port} --strictPort`,
    url: `http://localhost:${port}/zaapi-take-home/`,
    reuseExistingServer: false,
  },
});
