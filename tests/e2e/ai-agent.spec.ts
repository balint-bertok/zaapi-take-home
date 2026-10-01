/**
 * AI Agent click paths: each create sheet appends a row to its list, and the test chat answers
 * from its script. Everything runs on the in-memory store; the no-outbound-network suite covers
 * that nothing leaves the page.
 */
import { expect, test } from "@playwright/test";

test("adding a written knowledge source appends a row", async ({ page }) => {
  await page.goto("ai/train/knowledge-source");
  await expect(page.getByRole("row")).toHaveCount(2);
  await page.getByRole("button", { name: "Add knowledge source" }).click();
  const sheet = page.getByRole("dialog", { name: "Add New Knowledge Source" });
  await sheet.getByLabel("Source name").fill("Brand One FAQ");
  await sheet.getByRole("radio", { name: "Add Website" }).click();
  await expect(sheet.getByLabel("Website URL")).toBeVisible();
  await sheet.getByRole("radio", { name: "Write it yourself" }).click();
  await sheet.getByLabel("Knowledge source text").fill("We ship within two business days.");
  await sheet.getByRole("button", { name: "Add knowledge source" }).click();

  await expect(sheet).toBeHidden();
  await expect(page.getByText("Knowledge source successfully added")).toBeVisible();
  const row = page.getByRole("row").filter({ hasText: "Brand One FAQ" });
  await expect(row).toContainText("Manual Input");
  await expect(row).toContainText("All integrations");
  await expect(row).toContainText("Balint");
  await expect(page.locator("p", { hasText: "Storage:" })).toHaveText(/^Storage:\s*33\s*\/\s*7,500,000\s*characters\.$/);
});

test("a scenario created from a template appears in the list", async ({ page }) => {
  await page.goto("ai/train/scenario-handling");
  await expect(page.getByText("No data").first()).toBeVisible();
  await page.getByRole("button", { name: "Add scenario" }).click();
  const sheet = page.getByRole("dialog", { name: "Add scenario" });
  await sheet.getByRole("button", { name: /Return or refund/ }).click();
  await expect(sheet.getByLabel("Scenario name")).toHaveValue("Return or refund");
  await expect(sheet.getByRole("textbox", { name: "Reply steps" })).toContainText("Request relevant order information");
  await sheet.getByRole("button", { name: "Create scenario" }).click();

  await expect(sheet).toBeHidden();
  await expect(page.getByRole("row").filter({ hasText: "Return or refund" })).toContainText("Follow instructions");
});

test("creating a personality appends an active row", async ({ page }) => {
  await page.goto("ai/train/personality");
  await page.getByRole("button", { name: "Add personality" }).click();
  const sheet = page.getByRole("dialog", { name: "Add new personality" });
  await expect(sheet.getByRole("radio", { name: /No signature/ })).toHaveAttribute("aria-checked", "true");
  await sheet.getByLabel("Name", { exact: true }).fill("Brand One voice");
  await sheet.getByRole("button", { name: "Create" }).click();

  await expect(sheet).toBeHidden();
  await expect(page.getByRole("switch", { name: "Brand One voice status" })).toBeChecked();
});

test("the test chat replies from its script and clears", async ({ page }) => {
  await page.goto("ai/testing");
  await expect(page.getByText("Hello, I had a question")).toBeVisible();
  const composer = page.getByRole("textbox", { name: "Message" });
  await composer.fill("Do you ship to Chiang Mai?");
  await composer.press("Enter");
  await expect(page.getByText("Do you ship to Chiang Mai?")).toBeVisible();
  await expect(page.getByText("Thank you for your message!", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Show thinking" }).last().click();
  await expect(page.getByText("AI thinking")).toBeVisible();

  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Hello, I had a question")).toBeHidden();
});
