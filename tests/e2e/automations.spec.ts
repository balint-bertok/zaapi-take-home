/**
 * Basic Automations click paths, driven only by the in-memory store: pick the "Assign to agents"
 * template, fill the form, answer the activation dialog, find the row; edit and delete a row.
 */
import { expect, test, type Page } from "@playwright/test";

const list = "automations/basic-automations";

async function fillForm(page: Page, name: string) {
  const create = page.getByRole("button", { name: "Create automation", exact: true });
  await expect(create).toBeDisabled();
  await page.getByRole("checkbox", { name: "Integrations" }).click();
  await expect(page.getByText("1 Integration Selected")).toBeVisible();
  await page.getByRole("checkbox", { name: "Balint" }).click();
  await expect(page.getByText("1 agent selected")).toBeVisible();
  await expect(create).toBeDisabled();
  await page.getByPlaceholder("Enter automation name").fill(name);
  await expect(create).toBeEnabled();
  await create.click();
}

test("create an automation from the template sheet, with and without activating", async ({ page }) => {
  await page.goto(list);
  await page.getByRole("button", { name: "New automation" }).click();
  const sheet = page.getByRole("dialog", { name: "Create new automation" });

  // The category chips filter the template sections.
  await sheet.getByRole("button", { name: "Ticket Management" }).click();
  await expect(sheet.getByText("Assign labels to conversations")).toBeVisible();
  await expect(sheet.getByText("Assign to agents")).toBeHidden();
  await sheet.getByRole("button", { name: "All templates" }).click();

  // A reopened sheet starts unfiltered again.
  await sheet.getByRole("button", { name: "Ticket Management" }).click();
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
  await page.getByRole("button", { name: "New automation" }).click();
  await expect(sheet.getByText("Assign to agents")).toBeVisible();

  await sheet.getByRole("link", { name: /Assign to agents/ }).click();
  await expect(page).toHaveURL(/\/create\?type=chatAssignment$/);
  await fillForm(page, "Brand One assignment");

  const activate = page.getByRole("dialog", { name: "Do you want to activate this automation?" });
  await activate.getByRole("button", { name: "Save without activating" }).click();
  await expect(page).toHaveURL(new RegExp(`${list}$`));
  await expect(page.getByText("Successfully created automation")).toBeVisible();
  await expect(page.getByRole("switch", { name: "Brand One assignment" })).not.toBeChecked();

  await page.goto(`${list}/create?type=chatAssignment`);
  await fillForm(page, "Brand Two assignment");
  await page.getByRole("button", { name: "Activate now" }).click();
  await expect(page.getByRole("switch", { name: "Brand Two assignment" })).toBeChecked();

  // Search narrows the table by name.
  await page.getByPlaceholder("Search automation names").fill("brand two");
  await expect(page.getByRole("row")).toHaveCount(2);
});

test("edit and delete the seeded automation", async ({ page }) => {
  await page.goto(list);
  const row = page.getByRole("row").filter({ hasText: "Assignment" });

  // An edit link to a missing automation returns to the list instead of opening a create form.
  await page.goto(`${list}/create?type=chatAssignment&id=missing`);
  await expect(page).toHaveURL(new RegExp(`${list}$`));

  await row.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Edit" }).click();
  await expect(page.getByPlaceholder("Enter automation name")).toHaveValue("Assignment");
  await page.getByPlaceholder("Enter automation description").fill("Round robin for the widget");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Round robin for the widget")).toBeVisible();

  await row.getByRole("button", { name: "More" }).click();
  await page.getByRole("menuitem", { name: "Delete" }).click();
  await page.getByRole("button", { name: "Delete automation" }).click();
  await expect(page.getByText("Successfully deleted automation")).toBeVisible();
  await expect(page.getByText("No automations")).toBeVisible();
});
