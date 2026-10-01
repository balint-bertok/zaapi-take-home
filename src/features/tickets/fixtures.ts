export type Message = { id: string; from: "contact" | "agent" | "system"; text: string; time: string };

export type Ticket = {
  id: string;
  number: string;
  contactName: string;
  integrationId: string;
  status: "open" | "closed";
  assigneeId: string | null;
  messages: Message[];
};

// The visitor ticket from the inbox screenshot.
export const ticketsSeed = {
  tickets: [
    {
      id: "ticket-1",
      number: "261001DH7ET7",
      contactName: "Visitor 01 Oct 2026, 11:18",
      integrationId: "integration-1",
      status: "open",
      assigneeId: null,
      messages: [
        { id: "message-1", from: "contact", text: "Hello 👋", time: "11:18" },
        { id: "message-2", from: "contact", text: "Hello, I have an issue I need solving", time: "11:18" },
      ],
    },
  ] as Ticket[],
};
