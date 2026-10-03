/**
 * NON-NEGOTIABLE: every route in the route table renders cleanly, and nothing links outside it.
 * For each route: HTTP 200, no console error, no uncaught page error, the catalog title
 * (seo.metaTitle), and every in-app link points at a route in the table, so a click never
 * dead-ends (uncaptured pages are <Inert>, not links; user decision 2026-10-01).
 * "/" must redirect to /register.
 */
import { expect, test, type Page } from "@playwright/test";
import { routes } from "../../src/routes";

const known = new Set(routes.map((r) => r.path));

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(`console: ${msg.text()}`));
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

for (const route of routes) {
  test(`route ${route.path} renders`, async ({ page, baseURL }) => {
    const errors = collectErrors(page);
    const response = await page.goto(route.path.slice(1), { waitUntil: "networkidle" });

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(route.title);

    const base = new URL(baseURL!).pathname.replace(/\/$/, "");
    const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")!));
    const dead = hrefs.map((h) => h.split(/[?#]/)[0].replace(base, "")).filter((p) => !known.has(p));
    expect(dead).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("/ redirects to /register", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("./", { waitUntil: "networkidle" });
  await expect(page).toHaveURL(/\/register$/);
  await expect(page).toHaveTitle("Register - Zaapi");
  expect(errors).toEqual([]);
});
