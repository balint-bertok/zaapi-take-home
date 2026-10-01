/**
 * NON-NEGOTIABLE: the built demo makes zero requests to any host but its own origin.
 * The demo is public and has no backend (user decision 2026-10-01); an outbound call would mean a
 * tracker, a CDN font (fonts.googleapis.com, as the real app uses) or a leaked API call slipped in.
 * Every route in the table is opened, every request recorded, and every URL must start with the
 * preview origin. Do not add hosts here to make a feature pass; renegotiate with the user.
 */
import { expect, test } from "@playwright/test";
import { routes } from "../../src/routes";

for (const route of routes) {
  test(`no outbound request on ${route.path}`, async ({ page, baseURL }) => {
    const origin = new URL(baseURL!).origin;
    const requested: string[] = [];
    page.on("request", (request) => requested.push(request.url()));

    await page.goto(route.path.slice(1), { waitUntil: "networkidle" });
    await expect(page).toHaveTitle(route.title);
    // Hovering a rail icon opens a tooltip portal, the one lazily rendered part of the shell.
    const firstRailIcon = page.getByRole("navigation", { name: "Main" }).getByRole("link").first();
    if (await firstRailIcon.count()) await firstRailIcon.hover();
    await page.waitForLoadState("networkidle");

    expect(requested.length).toBeGreaterThan(0);
    expect(requested.filter((url) => !url.startsWith(`${origin}/`))).toEqual([]);
  });
}
