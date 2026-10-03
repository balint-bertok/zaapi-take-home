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
 * restores the path, and the done page, the end of the demo, stands alone and its "start again"
 * resets the demo and returns to sign-up; arriving on sign-up resets it too. "Finish later" is inert: the modal stays.
 * Skipping scenarios states the consequence inline, in the same dialog, and the knowledge step asks
 * only the policies the picked scenarios need (none after a skip), with a file-or-URL line that
 * becomes a source. Picking a template opens its prefilled scenario form in the same card, as
 * the "Add scenario" sheet does; creating it checks the card, Back leaves it unchecked. "Manual entry"
 * opens the empty form; what it creates counts on its card and enables Continue.
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
  // The picked language carries over; the suggestion's Thai is one click away. A signature card
  // picked on the empty form carries over the same way.
  await expect(persona.getByRole("radio", { name: "English" })).toHaveAttribute("aria-checked", "true");
  await page.goBack();
  await persona.getByRole("radio", { name: "No signature" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/persona\/filled$/);
  await expect(persona.getByRole("radio", { name: "No signature" })).toHaveAttribute("aria-checked", "true");
  await expect(persona.getByRole("radio", { name: "Thai" })).toHaveAttribute("aria-checked", "true");
  await persona.getByRole("radio", { name: "Thai" }).click();
  await expect(persona.getByLabel("Name", { exact: true })).toHaveValue("Brand One assistant");
  await expect(persona.getByRole("radio", { name: "Thai" })).toHaveAttribute("aria-checked", "true");
  // The sheet's help text and signature cards are on the step too; the suggestion signs replies.
  await expect(persona.getByText("calm and witty tech expert")).toBeVisible();
  await persona.getByRole("radio", { name: "Custom signature" }).click();
  await expect(persona.getByRole("radio", { name: "Custom signature" })).toHaveAttribute("aria-checked", "true");
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
  // Only the policies the picked scenarios need are asked: no complaint scenario, no complaints policy.
  await expect(knowledge.getByText("Needed by Check order status")).toBeVisible();
  await expect(knowledge.getByText("Needed by Return or refund")).toBeVisible();
  await expect(knowledge.getByRole("textbox", { name: "Complaints and handover" })).toHaveCount(0);
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
  await expect(page.getByText("Policies: shipping times and areas, returns and refunds answered")).toBeVisible();
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
  await expect(blocks.getByRole("listitem")).toHaveText([/^Trigger/, /^Let AI handle: 1 in 5/, /^Assign to/]);
  await page.getByRole("radio", { name: "Half" }).click();
  await expect(blocks.getByRole("listitem").nth(1)).toHaveText(/^Let AI handle: half/);
  await page.getByRole("main").getByRole("link", { name: "Go live" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/live\/done$/);
  await expect(page.getByRole("heading", { name: "Your agent is live. That's the end of the demo." })).toBeVisible();
  await expect(page.getByText(/answers half .* through the flow “AI handles new conversations on Test \(Demo\)”\. Pausing the agent/)).toBeVisible();

  // After go-live the AI Agent pages open and every step links; pages outside the journey stay inert
  // (ADR 0003). The done page stands alone, so this is checked from an AI Agent page.
  await page.goto("ai/setup/test");
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
  for (const name of ["Shipping times and areas", "Returns and refunds"]) await expect(page.getByRole("row").filter({ hasText: name })).toHaveCount(1);
  await expect(page.getByRole("row").filter({ hasText: "Complaints and handover" })).toHaveCount(0);

  // The journey ends on a page of its own, with nothing to click but a restart that sends the viewer
  // back to sign-up with the demo reset.
  await page.goto("ai/setup/live/done");
  await expect(page.getByRole("heading", { name: "Your agent is live. That's the end of the demo." })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Main" })).toHaveCount(0);
  await expect(page.getByRole("link")).toHaveCount(0);
  await page.getByRole("button", { name: "Start again from sign-up" }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole("heading", { name: "Start your 7-day free trial" })).toBeVisible();
  await page.goto("ai/train/scenario-handling");
  await expect(page.getByRole("columnheader").first()).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: "Check order status" })).toHaveCount(0);
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
  await expect(welcome).toBeVisible();
  // The open modal hides the page from the accessibility tree, so the frame is located by CSS here.
  const behind = (label: string) => page.locator(`[aria-label="${label}"]`);
  await expect(behind("Set up your AI Agent").locator('button[aria-disabled="true"]', { hasText: "Scenarios" })).toBeVisible();
  await expect(behind("Main").locator('button[aria-disabled="true"][aria-label="Automations"]')).toBeVisible();
  await expect(behind("Main").locator('a[aria-label="AI Agent"]')).toHaveAttribute("href", /\/ai\/setup$/);

  expect(errors).toEqual([]);
});

test("Finish later is inert: the setup modal stays on the welcome and on a step", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup?reset=1");
  const welcome = page.getByRole("dialog", { name: "Set up your first AI Agent" });
  const later = welcome.getByRole("button", { name: "Finish later" });
  await expect(later).toHaveAttribute("aria-disabled", "true");
  await later.click({ force: true }); // Playwright skips aria-disabled targets unless forced
  await expect(welcome).toBeVisible();
  await expect(page).toHaveURL(/\/ai\/setup$/);

  await page.goto("ai/setup/persona");
  const persona = page.getByRole("dialog", { name: "Persona" });
  await expect(persona.getByRole("button", { name: "Finish later" })).toHaveAttribute("aria-disabled", "true");
  await persona.getByRole("button", { name: "Finish later" }).click({ force: true });
  await expect(persona).toBeVisible();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await expect(page).toHaveURL(/\/ai\/setup\/persona$/);

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

test("Manual entry opens an empty scenario form; the written scenario counts and enables Continue", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup/scenarios?reset=1");
  const scenarios = page.getByRole("dialog", { name: "Scenarios" });
  await expect(scenarios.getByRole("button", { name: "Continue to knowledge" })).toBeDisabled();
  await scenarios.getByRole("button", { name: /Manual entry/ }).click();
  const form = page.getByRole("dialog", { name: "Manual entry" });
  await expect(form.getByLabel("Scenario name")).toHaveValue("");
  await form.getByLabel("Scenario name").fill("Opening hours");
  await form.getByRole("textbox", { name: "When this scenario should trigger" }).fill("When a customer asks when the shop is open.");
  await form.getByRole("button", { name: "Create scenario" }).click();
  await expect(scenarios.getByRole("button", { name: /Manual entry/ })).toContainText("1 written so far");
  await expect(scenarios.getByRole("checkbox", { checked: true })).toHaveCount(0);
  await scenarios.getByRole("link", { name: "Continue to knowledge" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge$/);
  await page.goto("ai/setup/test");
  await expect(page.getByText("Scenarios: Opening hours")).toBeVisible();
  await page.goto("ai/train/scenario-handling");
  await expect(page.getByRole("row").filter({ hasText: "Opening hours" })).toHaveCount(1);

  expect(errors).toEqual([]);
});

test("skipping scenarios states the consequence inline and the knowledge step follows it", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup/scenarios?reset=1");
  const scenarios = page.getByRole("dialog", { name: "Scenarios" });
  await scenarios.getByRole("button", { name: "Skip this step" }).click();
  await expect(scenarios.getByText("Without a scenario, refunds and complaints go to your team.")).toBeVisible();
  // Inline, not a second dialog over the modal.
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await scenarios.getByRole("button", { name: "Skip anyway" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge$/);
  const knowledge = page.getByRole("dialog", { name: "Knowledge" });
  await expect(knowledge.getByText("None of your scenarios needs a policy answer", { exact: false })).toBeVisible();
  await expect(knowledge.getByRole("textbox")).toHaveCount(0);
  // The reference line is the one field: checking it fills the step, the URL becomes a website source.
  await knowledge.getByRole("checkbox", { name: "I have a file or website URL that includes this info" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/knowledge\/filled$/);
  await expect(knowledge.getByRole("checkbox", { name: "I have a file or website URL that includes this info" })).toHaveAttribute("aria-checked", "true");
  await knowledge.getByRole("textbox", { name: "File name or website URL" }).fill("https://brand-one.example/policies");
  await knowledge.getByRole("link", { name: "Continue to test" }).click();
  await expect(page).toHaveURL(/\/ai\/setup\/test$/);
  await expect(page.getByText("Policies: none needed by your scenarios")).toBeVisible();
  await page.goto("ai/train/knowledge-source");
  const row = page.getByRole("row").filter({ hasText: "https://brand-one.example/policies" });
  await expect(row).toHaveCount(1);
  await expect(row).toContainText("Website");

  await page.goto("ai/setup/test");
  await expect(page.getByText(/^Scenarios: none/)).toBeVisible();

  expect(errors).toEqual([]);
});

test("arriving on sign-up starts a fresh run", async ({ page }) => {
  const errors = collectErrors(page);

  await page.goto("ai/setup/persona/filled?reset=1");
  await page.getByRole("dialog", { name: "Persona" }).getByRole("link", { name: "Continue" }).click();
  await page.goto("ai/train/personality");
  await expect(page.getByRole("row").filter({ hasText: "Brand One assistant" })).toHaveCount(1);
  await page.goto("register");
  await expect(page.getByRole("heading", { name: "Start your 7-day free trial" })).toBeVisible();
  await page.goto("ai/train/personality");
  await expect(page.getByRole("columnheader").first()).toBeVisible();
  await expect(page.getByRole("row").filter({ hasText: "Brand One assistant" })).toHaveCount(0);

  expect(errors).toEqual([]);
});
