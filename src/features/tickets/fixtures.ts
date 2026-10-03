/**
 * One line of a ticket thread. `contact`/`agent` are chat bubbles, `comment` an internal comment,
 * `ticket` a ticket event line (opened) drawn between rules, `system` a plain centred line (assignment).
 * Lines are stored already rendered from the catalog templates: the thread is a log.
 */
export type Message = {
  id: string;
  from: "contact" | "agent" | "comment" | "ticket" | "system";
  text: string;
  time: string;
};

/** Contact fields, in the details panel's order (labels live in DetailsPanel). */
export type ContactFieldKey =
  | "firstName"
  | "lastName"
  | "phone"
  | "email"
  | "secondaryPhone"
  | "secondaryEmail"
  | "shipping"
  | "note";

export type Ticket = {
  id: string;
  number: string;
  contactName: string;
  integrationId: string;
  assigneeId: string | null;
  followUp: boolean;
  /** Epoch ms; the ticket-history timer runs from here. Tickets never close in the demo. */
  openedAt: number;
  conversionValue: string;
  contact: Partial<Record<ContactFieldKey, string>>;
  messages: Message[];
};

// The visitor ticket from the inbox screenshot, whose timer read 00:00:34 when it was captured.
export const ticketsSeed: { tickets: Ticket[] } = {
  tickets: [
    {
      id: "ticket-1",
      number: "261001DH7ET7",
      contactName: "Visitor 01 Oct 2026, 11:18",
      integrationId: "integration-1",
      assigneeId: null,
      followUp: false,
      openedAt: Date.now() - 34_000,
      conversionValue: "",
      contact: { firstName: "Visitor 01 Oct 2026, 11:18" },
      messages: [
        { id: "message-0", from: "ticket", text: "Ticket #261001DH7ET7 opened automatically at 11:18", time: "11:18" },
        { id: "message-1", from: "contact", text: "Hello 👋", time: "11:18" },
        { id: "message-2", from: "contact", text: "Hello, I have an issue I need solving", time: "11:18" },
      ],
    },
  ],
};
