// Demo seed data. Names follow the fixture convention ("Brand One") or are copied from the
// reference screenshots; nothing here is real customer data.

export type Channel =
  | "chat-widget"
  | "facebook"
  | "instagram"
  | "line"
  | "whatsapp"
  | "shopee"
  | "lazada"
  | "tiktok-shop"
  | "gmail"
  | "outlook"
  | "shopify";

export type Integration = { id: string; channel: Channel; name: string };

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

export type Automation = {
  id: string;
  name: string;
  type: "assign-to-agents";
  integrationIds: string[];
  enabled: boolean;
  createdBy: string;
  updatedBy: string | null;
  updatedAt: string; // ISO date
};

export type Flow = { id: string; name: string; status: "draft" | "published"; updatedAt: string };

export type KnowledgeSource = { id: string; name: string; enabled: boolean; source: string };

export type DemoState = {
  workspace: { name: string };
  user: { id: string; name: string };
  integrations: Integration[];
  tickets: Ticket[];
  automations: Automation[];
  flows: Flow[];
  knowledgeSources: KnowledgeSource[];
  aiTokens: number;
  freeTrialDaysLeft: number;
};

export const seed: DemoState = {
  workspace: { name: "Brand One" },
  user: { id: "user-1", name: "Balint" },
  integrations: [{ id: "integration-1", channel: "chat-widget", name: "Test (Demo)" }],
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
  ],
  automations: [
    {
      id: "automation-1",
      name: "Assignment",
      type: "assign-to-agents",
      integrationIds: ["integration-1"],
      enabled: true,
      createdBy: "Balint",
      updatedBy: null,
      updatedAt: "2026-10-01",
    },
  ],
  flows: [],
  knowledgeSources: [{ id: "knowledge-1", name: "Quick replies", enabled: false, source: "Zaapi System" }],
  aiTokens: 300,
  freeTrialDaysLeft: 6,
};
