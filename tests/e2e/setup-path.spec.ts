/**
 * The guided setup click path (ADR 0002), from sign-up to a live agent. Before go-live the rail
 * sends AI Agent into the path and leaves every other section but Tickets inert; the step list
 * links only to done steps and the current one, and the "skip the setup" exit is inert. Each empty
 * form moves to its filled twin on first touch. Continue appends to the Personality, Scenario
 * Handling and Knowledge Source lists, once: a second Continue adds no duplicate. The readiness
 * summary on the Test step reads the store. "Go live" opens the dashboard; `?reset=1` restores the
 * path. Skipping scenarios states the consequence first and changes what the knowledge step asks.
 */
import { expect, test, type Page } from "@playwright/test";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(`console: ${msg.text()}`));
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

test("the guided setup runs from sign-up to a live agent, then opens the dashboard", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("register?reset=1");
  await page.getByRole("button", { name: "Get started" }).click();
  await expect(page).toHaveURL(/\/tickets$/);
  await page.getByRole("dialog", { name: "Tell us a bit about yourself" }).getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Do it later and explore the inbox" }).click();

  // Before go-live: AI Agent leads into the path, Automations and Settings are inert.
  const rail = page.getByRole("navigation", { name: "Main" });
  for (const name of ["Automations", "Settings"]) {
    await expect(rail.locator(`button[aria-disabled="true"][aria-label="${name}"]`)).toBeVisible();
    await expect(rail.getByRole("link", { name })).toHaveCount(0);
  }
  const aiAgent = rail.getByRole("link", { name: "AI Agent" });
  await expect(aiAgent).toHaveAttribute("href", /\/ai\/setup$/);
  await aiAgent.click();
  await expect(page).toHaveURL(/\/ai\/setup$/);
  await expect(page.getByRole("heading", { name: "Set up your first AI Agent" })).toBeVisible();
  await expect(page.getByText("Test (Demo)", { exact: true })).toBeVisible();

  // The step list links only to the current step; the skip exit is shown but inert.
  const sidebar = page.getByRole("complementary", { name: "Set up your AI Agent" });
  for (const name of ["Scenarios", "Knowledge", "Test", "Go live"]) {
    await expect(sidebar.locator('button[aria-disabled="true"]', { hasText: name })).toBeVisible();
    await expect(sidebar.getByRole("link", { name })).toHaveCount(0);
  }
  await expect(sidebar.getByRole("link", { name: "Persona" })).toBeVisible();
  await expect(sidebar.locator('button[aria-disabled="true"]', { hasText: "I know what I'm doing, skip the setup" })).toBeVisible();

  // Persona: touching the form moves to its filled twin.
  await page.getByRole("link", { name: "Start" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/persona$/);
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("radio", { name: "English" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/persona\/filled$/);
  // The picked language carries over; the suggestion's Thai is one click away.
  await expect(page.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("radio", { name: "Thai" }).click();
  await expect(page.getByLabel("Name", { exact: true })).toHaveValue("Brand One assistant");
  await expect(page.getByRole("radio", { name: "Thai" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/scenarios$/);

  // Scenarios: Continue needs at least one pick.
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("checkbox", { name: /Check order status/ }).click();
  await page.getByRole("checkbox", { name: /Return or refund/ }).click();
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge$/);

  // Knowledge: each policy names the picked scenario that needs it.
  await expect(page.getByText("Needed by Check order status")).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue" })).toBeDisabled();
  await page.getByRole("textbox", { name: "Shipping times and areas" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge\/filled$/);
  await expect(page.getByRole("textbox", { name: "Shipping times and areas" })).toHaveValue(/Bangkok/);
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/test$/);

  // Test: the readiness summary reads what the earlier steps stored.
  await expect(page.getByText("Scenarios: Check order status, Return or refund")).toBeVisible();
  await expect(page.getByText("Policies: shipping, returns and cancellations answered")).toBeVisible();
  await expect(page.getByText("Language: Thai, matches your Test (Demo) customers")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/live$/);

  // Go live: a small share by default.
  await expect(page.getByRole("radio", { name: "1 in 5" })).toHaveAttribute("aria-checked", "true");
  await page.getByRole("radio", { name: "Half" }).click();
  await page.getByRole("main").getByRole("link", { name: "Go live" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/live\/done$/);
  await expect(page.getByText(/answering half/)).toBeVisible();

  // After go-live the dashboard is open and every step links.
  for (const name of ["Automations", "Settings"]) await expect(rail.getByRole("link", { name })).toBeVisible();
  await expect(rail.getByRole("link", { name: "AI Agent" })).toHaveAttribute("href", /\/ai\/train\/knowledge-source$/);
  for (const name of ["Persona", "Scenarios", "Knowledge", "Test", "Go live"]) await expect(sidebar.getByRole("link", { name })).toBeVisible();

  // The lists show what the path created, once each.
  await page.goto("ai/train/personality");
  await expect(page.getByRole("row").filter({ hasText: "Brand One assistant" })).toHaveCount(1);
  await page.goto("ai/train/scenario-handling");
  await expect(page.getByRole("row").filter({ hasText: "Check order status" })).toHaveCount(1);
  await expect(page.getByRole("row").filter({ hasText: "Return or refund" })).toHaveCount(1);
  await expect(page.getByRole("row").filter({ hasText: "Customer complaint" })).toHaveCount(0);
  await page.goto("ai/train/knowledge-source");
  for (const name of ["Shipping times and areas", "Returns and refunds", "Cancellations"])
    await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(1);

  await page.goto("ai/setup/persona/filled");
  await page.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/scenarios$/);
  await page.goto("ai/train/personality");
  await expect(page.getByRole("row").filter({ hasText: "Brand One assistant" })).toHaveCount(1);

  // `?reset=1` brings the gated path back.
  await page.goto("ai/setup?reset=1");
  await expect(sidebar.locator('button[aria-disabled="true"]', { hasText: "Scenarios" })).toBeVisible();
  await expect(rail.locator('button[aria-disabled="true"][aria-label="Automations"]')).toBeVisible();

  expect(errors).toEqual([]);
});

test("skipping scenarios states the consequence and the knowledge step follows it", async ({ page }) => {
  await page.goto("ai/setup/scenarios?reset=1");
  await page.getByRole("button", { name: "Skip this step" }).click();
  const dialog = page.getByRole("dialog", { name: "Skip scenarios?" });
  await expect(dialog).toContainText("Without a scenario, refunds and cancellations go to your team.");
  await dialog.getByRole("button", { name: "Skip anyway" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge$/);
  await expect(page.getByText("Not needed by the scenarios you picked, still useful").first()).toBeVisible();

  await page.goto("ai/setup/test");
  await expect(page.getByText(/^Scenarios: none/)).toBeVisible();
});
