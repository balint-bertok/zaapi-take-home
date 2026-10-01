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
    // A first visit to the inbox opens the onboarding modals; walk them so step 2's images load.
    const onboarding = page.getByRole("dialog", { name: "Tell us a bit about yourself" });
    if (await onboarding.isVisible()) {
      await onboarding.getByLabel("What's your name?").fill("Brand One");
      await onboarding.getByText("2-10").click();
      await onboarding.getByRole("button", { name: "Continue" }).click();
      await page.getByRole("button", { name: "Do it later and explore the inbox" }).click();
    }
    // Hovering a rail icon opens a tooltip portal, the one lazily rendered part of the shell.
    // Every route with a section layout has the rail, so a missing one fails here, not silently.
    if (route.layout !== "auth" && route.layout !== "canvas")
      await page.getByRole("navigation", { name: "Main" }).getByRole("link").first().hover();
    await page.waitForLoadState("networkidle");

    expect(requested.length).toBeGreaterThan(0);
    expect(requested.filter((url) => !url.startsWith(`${origin}/`))).toEqual([]);
  });
}
