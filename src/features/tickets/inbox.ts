import type { Ticket } from "./fixtures";

/**
 * The two live inboxes: `all` (Open tickets / All, `/tickets`) and `closed` (Completed / Closed,
 * `/tickets?inbox=closed`). Every other sidebar entry is inert.
 */
export type Inbox = "all" | "closed";

export const inboxFrom = (param: string | null): Inbox => (param === "closed" ? "closed" : "all");

export const inInbox = (t: Ticket, inbox: Inbox) => (inbox === "closed" ? t.status === "closed" : t.status === "open");
