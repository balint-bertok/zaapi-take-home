/**
 * The guided setup click path (ADR 0002 and its hybrid-modal amendment), from sign-up to a live
 * agent. Before go-live the rail sends AI Agent into the path and leaves every other section but
 * Tickets inert; the step list links only to done steps and the current one, and the "skip the
 * setup" exit is inert. The welcome, persona, scenarios and knowledge steps run in the inbox
 * onboarding's modal frame over the setup page; test and go live are pages with no dialog. The
 * modal's step bar marks the current step and the done ones. Each empty form moves to its filled
 * twin on first touch, Continue included. Continue appends to the Personality and Knowledge
 * Source lists, once: a second Continue adds no duplicate; a scenario row is added on Create. The
 * readiness summary on the Test step reads the store. Go live shows the flow it publishes, its "Let
 * AI handle" block following the picked share; the done page names that flow. "Go live" opens the AI Agent pages (the rest
 * of the rail stays inert, ADR 0003); `?reset=1`
 * restores the path, and the done page's "start again" resets the demo and returns to sign-up. "Finish later" closes the modal onto the page, whose button reopens it.
 * Skipping scenarios states the consequence inline, in the same dialog, and changes what the
 * knowledge step asks. Picking a template opens its prefilled scenario form in the same card, as
 * the "Add scenario" sheet does; creating it checks the card, Back leaves it unchecked.
 */
import { expect, test, type Page } from "@playwright/test";

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(`console: ${msg.text()}`));
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  return errors;
}

test("the guided setup runs from sign-up to a live agent, then opens the AI Agent pages", async ({ page }) => {
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

  // The welcome opens as a modal over the setup page.
  const welcome = page.getByRole("dialog", { name: "Set up your first AI Agent" });
  await expect(welcome.getByText("Test (Demo)", { exact: true })).toBeVisible();
  await expect(welcome.getByRole("button", { name: "Finish later" })).toBeVisible();
  await welcome.getByRole("link", { name: "Start" }).click();

  // Persona: the step bar marks it current; Continue on the empty form fills it, as touching it does.
  await expect(page).toHaveURL(/\/ai\/setup\/persona$/);
  const persona = page.getByRole("dialog", { name: "Persona" });
  const progress = (dialog: typeof persona) => dialog.getByRole("list", { name: "Setup progress" }).getByRole("listitem");
  await expect(progress(persona).filter({ hasText: "Persona" })).toHaveAttribute("aria-current", "step");
  await persona.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/persona\/filled$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/ai\/setup\/persona$/);
  await persona.getByRole("radio", { name: "English" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/persona\/filled$/);
  // The picked language carries over; the suggestion's Thai is one click away.
  await expect(persona.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");
  await persona.getByRole("radio", { name: "Thai" }).click();
  await expect(persona.getByLabel("Name", { exact: true })).toHaveValue("Brand One assistant");
  await expect(persona.getByRole("radio", { name: "Thai" })).toHaveAttribute("aria-checked", "true");
  await persona.getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/scenarios$/);

  // Scenarios: Continue needs at least one pick. Picking a template opens its prefilled scenario
  // form in the same card; creating it returns to the cards with that one checked.
  const scenarios = page.getByRole("dialog", { name: "Scenarios" });
  await expect(scenarios.getByRole("button", { name: "Continue to knowledge" })).toBeDisabled();
  for (const [title, step] of [
    ["Check order status", "Share the status clearly"],
    ["Return or refund", "Request relevant order information"],
  ]) {
    await scenarios.getByRole("checkbox", { name: new RegExp(title) }).click();
    const form = page.getByRole("dialog", { name: title });
    await expect(form.getByRole("heading", { name: title, exact: true })).toBeVisible();
    await expect(progress(form).filter({ hasText: "Scenarios" })).toHaveAttribute("aria-current", "step");
    await expect(form.getByLabel("Scenario name")).toHaveValue(title);
    await expect(form.getByRole("textbox", { name: "Reply steps" })).toContainText(step);
    await expect(form.getByText("Where should this scenario run?")).toHaveCount(0);
    await form.getByRole("button", { name: "Create scenario" }).click();
    await expect(page.getByText("Scenario successfully created").first()).toBeVisible();
    await expect(scenarios.getByRole("checkbox", { name: new RegExp(title) })).toHaveAttribute("aria-checked", "true");
  }
  await scenarios.getByRole("link", { name: "Continue to knowledge" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge$/);

  // Knowledge: the steps before it read as done; each policy names the picked scenario that needs it.
  const knowledge = page.getByRole("dialog", { name: "Knowledge" });
  for (const name of ["Persona", "Scenarios"]) await expect(progress(knowledge).filter({ hasText: name })).toContainText("done");
  await expect(progress(knowledge).filter({ hasText: "Knowledge" })).toHaveAttribute("aria-current", "step");
  await expect(knowledge.getByText("Needed by Check order status")).toBeVisible();
  await knowledge.getByRole("link", { name: "Continue to test" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge\/filled$/);
  await page.goBack();
  await knowledge.getByRole("textbox", { name: "Shipping times and areas" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge\/filled$/);
  await expect(knowledge.getByRole("textbox", { name: "Shipping times and areas" })).toHaveValue(/Bangkok/);
  await knowledge.getByRole("link", { name: "Continue to test" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/test$/);

  // Test is a page, not a modal screen; the readiness summary reads what the earlier steps stored.
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByText("Scenarios: Check order status, Return or refund")).toBeVisible();
  await expect(page.getByText("Policies: shipping, returns and cancellations answered")).toBeVisible();
  await expect(page.getByText("Language: Thai, matches your Test (Demo) customers")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();

  // The step list links only to done steps and the current one; the skip exit is shown but inert.
  const sidebar = page.getByRole("complementary", { name: "Set up your AI Agent" });
  for (const name of ["Persona", "Scenarios", "Knowledge", "Test"]) await expect(sidebar.getByRole("link", { name })).toBeVisible();
  await expect(sidebar.locator('button[aria-disabled="true"]', { hasText: "Go live" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "Go live" })).toHaveCount(0);
  await expect(sidebar.locator('button[aria-disabled="true"]', { hasText: "I know what I'm doing, skip the setup" })).toBeVisible();

  await page.getByRole("main").getByRole("link", { name: "Continue", exact: true }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/live$/);

  // Go live: a small share by default. The page shows the flow it publishes, and the "Let AI handle"
  // block follows the picked share; the done page names the flow and says pausing it pauses the agent.
  await expect(page.getByRole("radio", { name: "1 in 5" })).toHaveAttribute("aria-checked", "true");
  const blocks = page.getByRole("list", { name: "Flow blocks" });
  await expect(blocks.getByRole("listitem")).toHaveText([/^Trigger/, /^Let AI handle: 1 in 5 of/, /^Assign to/]);
  await page.getByRole("radio", { name: "Half" }).click();
  await expect(blocks.getByRole("listitem").nth(1)).toHaveText(/^Let AI handle: half of/);
  await page.getByRole("main").getByRole("link", { name: "Go live" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/live\/done$/);
  await expect(page.getByText(/answering half .* through the flow "AI handles new conversations on Test \(Demo\)"\. Pausing the agent/)).toBeVisible();

  // After go-live the AI Agent pages open and every step links; pages outside the journey stay inert (ADR 0003).
  for (const name of ["Automations", "Settings"]) {
    await expect(rail.locator(`button[aria-disabled="true"][aria-label="${name}"]`)).toBeVisible();
  }
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

  // The journey loops: the done page sends the viewer back to sign-up with the demo reset.
  await page.goto("ai/setup/live/done");
  await page.getByRole("button", { name: "Start the journey again from sign-up" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await page.goto("tickets");
  await expect(page.getByRole("dialog", { name: "Tell us a bit about yourself" })).toBeVisible();
  await page.goto("ai/train/personality");
  await expect(page.getByRole("row").filter({ hasText: "Brand One assistant" })).toHaveCount(0);

  // A second Continue on the persona adds no duplicate.
  await page.goto("ai/setup/persona/filled");
  await page.getByRole("dialog", { name: "Persona" }).getByRole("link", { name: "Continue" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/scenarios$/);
  await page.goto("ai/train/personality");
  await expect(page.getByRole("row").filter({ hasText: "Brand One assistant" })).toHaveCount(1);

  // `?reset=1` brings the gated path back, welcome modal included.
  await page.goto("ai/setup?reset=1");
  await welcome.getByRole("button", { name: "Finish later" }).click();
  await expect(sidebar.locator('button[aria-disabled="true"]', { hasText: "Scenarios" })).toBeVisible();
  await expect(rail.locator('button[aria-disabled="true"][aria-label="Automations"]')).toBeVisible();
  await expect(rail.getByRole("link", { name: "AI Agent" })).toHaveAttribute("href", /\/ai\/setup$/);

  expect(errors).toEqual([]);
});

test("Finish later closes the setup modal onto the page, whose Start reopens it", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup?reset=1");
  await page.getByRole("dialog", { name: "Set up your first AI Agent" }).getByRole("button", { name: "Finish later" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page).toHaveURL(/\/ai\/setup$/);
  await expect(page.getByRole("heading", { name: "Set up your first AI Agent" })).toBeVisible();

  // Dismissed stays dismissed on a reload; the page's button is the way back in.
  await page.reload();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("main").getByRole("link", { name: "Start" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/persona$/);
  await expect(page.getByRole("dialog", { name: "Persona" })).toBeVisible();

  expect(errors).toEqual([]);
});

test("Back from a template's scenario form returns to the cards with nothing new checked", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup/scenarios?reset=1");
  const scenarios = page.getByRole("dialog", { name: "Scenarios" });
  await scenarios.getByRole("checkbox", { name: /Customer complaint/ }).click();
  // The complaint template hands the ticket to a person: Escalate, no reply steps.
  const form = page.getByRole("dialog", { name: "Customer complaint" });
  await expect(form.getByRole("radio", { name: /^Escalate/ })).toHaveAttribute("aria-checked", "true");
  await expect(form.getByText("The AI Agent will send a message informing the customer")).toBeVisible();
  await form.getByRole("button", { name: "Back" }).click();
  await expect(scenarios.getByRole("checkbox", { checked: true })).toHaveCount(0);
  await expect(scenarios.getByRole("button", { name: "Continue to knowledge" })).toBeDisabled();
  await page.goto("ai/train/scenario-handling");
  await expect(page.getByText("No data").first()).toBeVisible();

  expect(errors).toEqual([]);
});

test("skipping scenarios states the consequence inline and the knowledge step follows it", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup/scenarios?reset=1");
  const scenarios = page.getByRole("dialog", { name: "Scenarios" });
  await scenarios.getByRole("button", { name: "Skip this step" }).click();
  await expect(scenarios.getByText("Without a scenario, refunds and cancellations go to your team.")).toBeVisible();
  // Inline, not a second dialog over the modal.
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await scenarios.getByRole("button", { name: "Skip anyway" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge$/);
  const knowledge = page.getByRole("dialog", { name: "Knowledge" });
  await expect(knowledge.getByText("Not needed by the scenarios you picked, still useful").first()).toBeVisible();

  await page.goto("ai/setup/test");
  await expect(page.getByText(/^Scenarios: none/)).toBeVisible();

  expect(errors).toEqual([]);
});
