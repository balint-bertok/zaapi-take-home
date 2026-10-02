/**
 * The sign-up click path end to end: register, verify (timed redirect), login with its
 * required-field check, then the two onboarding modals over the (still empty) inbox. Finishing them sets
 * `onboardingDone`, so a reload shows the inbox without them; `?reset=1` brings them back.
 * The typed password must never reach storage.
 */
import { expect, test } from "@playwright/test";

test("register, verify, log in and finish onboarding", async ({ page }) => {
  await page.goto("register?reset=1");

  await page.getByLabel("Email").fill("hello@brand-one.example");
  await page.getByLabel("Password", { exact: true }).fill("not-stored-anywhere");
  await page.getByRole("button", { name: "Get started" }).click();

  await expect(page).toHaveURL(/\/register\/verify$/);
  await expect(page.getByText("hello@brand-one.example")).toBeVisible();
  await page.getByRole("button", { name: "Click to resend" }).click();
  await expect(page.getByText("Email resent")).toBeVisible();

  // Demo-only: the verify page plays the email link's click after a pause of a few seconds.
  await expect(page).toHaveURL(/\/login\?supportSignUp=true&supportForgotPassword=true&code=success$/, {
    timeout: 10_000,
  });
  await expect(page.getByLabel("Email")).toHaveValue("hello@brand-one.example");

  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByText("Please enter your password")).toBeVisible();
  await expect(page).toHaveURL(/\/login/);

  await page.getByLabel("Email").fill("hello@brand-two.example");
  await page.getByRole("button", { name: "Phone no." }).click();
  await expect(page.getByLabel("Phone number")).toBeVisible();
  await page.getByRole("button", { name: "Email" }).click();
  await expect(page.getByLabel("Email")).toHaveValue("hello@brand-two.example");

  await page.getByLabel("Password", { exact: true }).fill("not-stored-anywhere");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page).toHaveURL(/\/tickets$/);

  const step1 = page.getByRole("dialog", { name: "Tell us a bit about yourself" });
  // Behind the modals the workspace is still empty: the get-started card, no ticket yet.
  await expect(page.getByText("Ready to get started?")).toBeVisible();
  await expect(page.getByRole("link", { name: "All (0)", includeHidden: true })).toBeVisible();
  const next = step1.getByRole("button", { name: "Continue" });
  await expect(next).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(step1).toBeVisible();
  await step1.getByLabel("What's your name?").fill("Brand One");
  await step1.getByText("2-10").click();
  await next.click();

  const step2 = page.getByRole("dialog", { name: "Try the inbox for yourself" });
  await expect(page.getByText("Step 2 of 2")).toBeVisible();
  await step2.getByRole("button", { name: "Do it later and explore the inbox" }).click();
  await expect(step2).toBeHidden();
  await expect(page.getByText("Select a customer to open the ticket")).toBeVisible();

  const stored = await page.evaluate(() =>
    [localStorage, sessionStorage].flatMap((s) => Object.keys(s).map((k) => `${k}=${s.getItem(k)}`)).join("\n"),
  );
  expect(stored).toContain("onboardingDone");
  expect(stored).not.toContain("not-stored-anywhere");
  expect(page.url()).not.toContain("not-stored-anywhere");

  await page.reload();
  await expect(page.getByText("Select a customer to open the ticket")).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(0);

  await page.goto("tickets?reset=1");
  await expect(page.getByRole("dialog", { name: "Tell us a bit about yourself" })).toBeVisible();
});
