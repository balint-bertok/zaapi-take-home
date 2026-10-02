/**
 * The inbox's main click path, driven only by the in-memory store: select the visitor ticket,
 * reply, assign it to the signed-in user, close it, find it under Completed / Closed, reopen it.
 */
import { expect, test } from "@playwright/test";

test("tickets inbox: reply, assign, close and reopen", async ({ page }) => {
  await page.goto("tickets");
  // Get past the first-visit modals (auth-onboarding.spec covers them in detail).
  await page.getByRole("button", { name: "Continue" }).click();
  await page.getByRole("button", { name: "Do it later and explore the inbox" }).click();
  await expect(page.getByText("Select a customer to open the ticket")).toBeVisible();
  const list = page.getByRole("region", { name: "Tickets" });
  await list.getByText("Visitor 01 Oct 2026, 11:18").click();
  await expect(page).toHaveURL(/inbox=all&ticketId=ticket-1/);
  await expect(page.getByText("Ticket #261001DH7ET7 opened automatically at 11:18")).toBeVisible();

  await page.getByRole("textbox", { name: "Reply" }).fill("Happy to help");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("Happy to help")).toHaveCount(2); // bubble and list preview

  await page.getByRole("button", { name: "Assign ticket" }).last().click();
  await page.getByRole("button", { name: /Balint/ }).click();
  await expect(page.getByText("Assigned to Balint successfully")).toBeVisible();
  await expect(list.getByText("Balint")).toBeVisible();
  await expect(page.getByRole("link", { name: "My Inbox (1)" })).toHaveCount(0); // inert entry
  await expect(page.getByRole("button", { name: "My Inbox (1)" })).toBeVisible();

  await page.getByRole("button", { name: "Close", exact: true }).click();
  await expect(page.getByText("Ticket closed", { exact: true })).toBeVisible();
  await expect(page.getByText("This ticket is closed.")).toBeVisible();
  await expect(list.getByText("All tickets are closed")).toBeVisible();

  await page.getByRole("link", { name: "Closed" }).click();
  await expect(page).toHaveURL(/inbox=closed/);
  await list.getByText("Visitor 01 Oct 2026, 11:18").click();
  await page.getByRole("button", { name: "Reopen ticket" }).click();
  await expect(page.getByText("This ticket is closed.")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "All (1)" })).toBeVisible();
});
