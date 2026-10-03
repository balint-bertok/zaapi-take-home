/**
 * The sign-up click path end to end. Register opens prefilled with the demo credentials
 * (`src/features/auth/demoCredentials.ts`), so one click lands on the inbox; its "Log in" control
 * is inert, since login is outside the journey (ADR 0003), and "/" lands on register. Over the
 * (still empty) inbox the two onboarding modals run; finishing them sets `onboardingDone`, so a
 * reload shows the inbox without them and `?reset=1` brings them back; with them gone, a "Start
 * here" callout links the inbox to the guided path. The first modal opens
 * prefilled too, so Continue is enabled on arrival. The demo password must never reach storage or
 * the URL.
 */
import { expect, test } from "@playwright/test";
import { demoCredentials as demo } from "../../src/features/auth/demoCredentials";
import { seed } from "../../src/store/fixtures";

test("register with one click, then finish onboarding", async ({ page }) => {
  await page.goto("register?reset=1");

  await expect(page.getByLabel("Business name")).toHaveValue(demo.businessName);
  await expect(page.getByLabel("Email")).toHaveValue(demo.email);
  await expect(page.getByLabel("Phone number")).toHaveValue(demo.phone);
  const registerPassword = page.getByLabel("Password", { exact: true });
  await expect(registerPassword).toHaveValue(demo.password);
  await expect(registerPassword).toHaveAttribute("type", "password");
  await expect(page.locator('button[aria-disabled="true"]', { hasText: "Log in" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Log in" })).toHaveCount(0);
  await page.getByRole("button", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/tickets$/);

  const step1 = page.getByRole("dialog", { name: "Tell us a bit about yourself" });
  // Behind the modals the workspace is still empty: the get-started card, no ticket yet.
  await expect(page.getByText("Ready to get started?")).toBeVisible();
  await expect(page.getByRole("link", { name: "All (0)", includeHidden: true })).toBeVisible();
  // Step 1 opens prefilled with the demo user and a staff count, so Continue is enabled at once;
  // both stay editable, and an emptied name disables Continue again.
  const name = step1.getByLabel("What's your name?");
  const next = step1.getByRole("button", { name: "Continue" });
  await expect(name).toHaveValue(seed.user.name);
  await expect(name).toBeFocused();
  expect(await name.evaluate((el: HTMLInputElement) => el.selectionStart === el.selectionEnd)).toBe(true);
  await expect(step1.getByRole("radio", { name: demo.staffCount })).toBeChecked();
  await expect(next).toBeEnabled();
  await page.keyboard.press("Escape");
  await expect(step1).toBeVisible();
  await name.clear();
  await expect(next).toBeDisabled();
  await name.fill("Brand One");
  await step1.getByText("11-25").click();
  await expect(step1.getByRole("radio", { name: "11-25" })).toBeChecked();
  await next.click();

  const step2 = page.getByRole("dialog", { name: "Try the inbox for yourself" });
  await expect(page.getByText("Step 2 of 2")).toBeVisible();
  await step2.getByRole("button", { name: "Do it later and explore the inbox" }).click();
  await expect(step2).toBeHidden();
  await expect(page.getByText("Select a customer to open the ticket")).toBeVisible();
  // With the modals gone, the inbox points at the guided path.
  const startHere = page.getByRole("link", { name: "Start the demo here: set up your first AI Agent" });
  await expect(startHere).toBeVisible();
  await expect(startHere).toHaveAttribute("href", /\/ai\/setup$/);

  const stored = await page.evaluate(() =>
    [localStorage, sessionStorage].flatMap((s) => Object.keys(s).map((k) => `${k}=${s.getItem(k)}`)).join("\n"),
  );
  expect(stored).toContain("onboardingDone");
  expect(stored).not.toContain(demo.password);
  expect(page.url()).not.toContain(demo.password);

  await page.reload();
  await expect(page.getByText("Select a customer to open the ticket")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.goto("tickets?reset=1");
  await expect(page.getByRole("dialog", { name: "Tell us a bit about yourself" })).toBeVisible();
});

test("/ lands on register", async ({ page }) => {
  await page.goto("./?reset=1");
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
});
