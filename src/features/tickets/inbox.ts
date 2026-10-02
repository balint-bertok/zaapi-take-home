import type { Ticket } from "./fixtures";

/**
 * The two inboxes the page renders: `all` (Open tickets / All, `/tickets`) and `closed` (Completed /
 * Closed, `/tickets?inbox=closed`, reached by URL only: its sidebar entry is inert, like every entry
 * but All).
 */
export type Inbox = "all" | "closed";

export const inboxFrom = (param: string | null): Inbox => (param === "closed" ? "closed" : "all");

export const inInbox = (t: Ticket, inbox: Inbox) => (inbox === "closed" ? t.status === "closed" : t.status === "open");
