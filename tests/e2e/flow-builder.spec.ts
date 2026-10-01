/**
 * Flow Builder click path: the template gallery creates a draft flow and opens the canvas with the
 * captured four-node graph; publishing it flips the badge and lists it with its switch on, with no
 * console error on the way (the route walk only sees the builder's no-id redirect).
 */
import { expect, test } from "@playwright/test";

// A long click path; the default 30s is tight when the suite runs fully parallel.
test.describe.configure({ timeout: 60_000 });

test("create a flow from a template, publish it, see it listed", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => msg.type() === "error" && errors.push(msg.text()));
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto("automations/flows?reset=1");
  await expect(page.getByRole("cell", { name: "No data" })).toBeVisible();

  await page.getByRole("button", { name: "New flow" }).click();
  await page.getByRole("dialog", { name: "Create new flow" }).getByRole("button", { name: /AI handles all new tickets/ }).click();

  await expect(page).toHaveURL(/\/automations\/flow-builder\?id=flow-/);
  for (const title of ["Message received", "Let AI reply", "Close ticket", "Assign to agent"]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
  await expect(page.locator(".react-flow__edge")).toHaveCount(3);
  await expect(page.getByRole("button", { name: "Draft", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page.getByRole("button", { name: "Publish now" }).click();
  await expect(page.getByText("Successfully published automation")).toBeVisible();
  await expect(page.getByRole("button", { name: "Published", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Back" }).click();
  await expect(page).toHaveURL(/\/automations\/flows$/);
  const row = page.getByRole("row", { name: /Flow Builder - .* - Balint/ });
  await expect(row).toBeVisible();
  await expect(row.getByRole("switch")).toHaveAttribute("aria-checked", "true");
  expect(errors).toEqual([]);
});

test("Custom flow opens a canvas with only the trigger", async ({ page }) => {
  await page.goto("automations/flows?reset=1");
  await page.getByRole("button", { name: "New flow" }).click();
  await page.getByRole("button", { name: /Custom flow/ }).click();

  await expect(page.getByText("Message received", { exact: true })).toBeVisible();
  await expect(page.locator(".react-flow__node")).toHaveCount(1);
  await expect(page.locator(".react-flow__edge")).toHaveCount(0);
});
