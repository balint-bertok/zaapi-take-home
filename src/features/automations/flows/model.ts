import { updateDemo } from "@/store/store";
import type { Flow, FlowEdge, FlowNode } from "../fixtures";

// The two templates that open the builder. Positions and handle ids are the saved builder page's
// ("AI handles all new tickets" as it was created on app.zaapi.com).
const trigger: FlowNode = { id: "trigger", type: "message_received", position: { x: 0, y: 0 }, data: { integrationIds: [] } };

const aiHandlesAllNewTickets: { nodes: FlowNode[]; edges: FlowEdge[] } = {
  nodes: [
    trigger,
    { id: "ai-reply", type: "chatbot", position: { x: 445.73, y: -14.71 }, data: {} },
    {
      id: "assign",
      type: "chat_assign",
      position: { x: 908.49, y: 197.65 },
      data: { assigneeIds: [], outsideHours: "stop", preference: "prioritizeLastAssigned" },
    },
    { id: "close", type: "close_chat", position: { x: 911.96, y: 1.47 }, data: {} },
  ],
  edges: [
    { id: "trigger-ai-reply", source: "trigger", sourceHandle: null, target: "ai-reply" },
    { id: "ai-reply-close", source: "ai-reply", sourceHandle: "ai-chatbot-timeout", target: "close" },
    { id: "ai-reply-assign", source: "ai-reply", sourceHandle: "ai-chatbot-escalate", target: "assign" },
  ],
};

export type BuilderTemplate = "custom" | "ai-handles-all-new-tickets";

const graphs: Record<BuilderTemplate, { nodes: FlowNode[]; edges: FlowEdge[] }> = {
  custom: { nodes: [trigger], edges: [] },
  "ai-handles-all-new-tickets": aiHandlesAllNewTickets,
};

const format = (options: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("en-GB", options).format;
const nameDate = format({ day: "numeric", month: "short", year: "numeric" });
const nameClock = format({ hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
const versionDate = format({ day: "2-digit", month: "short", year: "numeric" });
const versionClock = format({ hour: "2-digit", minute: "2-digit", hour12: false });

/** "1 Oct 2026, 12:37:48", the time stamp in a new flow's name. */
const nameTime = (d: Date) => `${nameDate(d)}, ${nameClock(d)}`;

/** "01 Oct 2026 12:37", as in the version history and the list's last-updated column. */
export const versionTime = (iso: string) => `${versionDate(new Date(iso))} ${versionClock(new Date(iso))}`;

/** Adds a draft flow from a template to the store and returns its id. */
export function createFlow(template: BuilderTemplate, user: string): string {
  const now = new Date();
  const at = now.toISOString();
  const flow: Flow = {
    id: `flow-${crypto.randomUUID()}`,
    name: `Flow Builder - ${nameTime(now)} - ${user}`,
    status: "draft",
    enabled: false,
    createdBy: user,
    updatedBy: user,
    updatedAt: at,
    unpublishedChanges: false,
    versions: [{ at, status: "draft", by: user }],
    ...structuredClone(graphs[template]),
  };
  updateDemo((s) => ({ ...s, flows: [flow, ...s.flows] }));
  return flow.id;
}

/** Applies `change` to one flow, as is (the list's switch, publishing). */
export function updateFlow(id: string, change: (f: Flow) => Partial<Flow>) {
  updateDemo((s) => ({ ...s, flows: s.flows.map((f) => (f.id === id ? { ...f, ...change(f) } : f)) }));
}

/** A canvas edit: also stamps the flow as changed, so a published flow offers "Update". */
export function editFlow(id: string, change: (f: Flow) => Partial<Flow>) {
  updateFlow(id, (f) => ({ updatedAt: new Date().toISOString(), unpublishedChanges: f.status === "published", ...change(f) }));
}

/** Publishes or updates a flow. A first publish switches it on; an update keeps a paused flow paused. */
export function publishFlow(id: string, user: string) {
  const at = new Date().toISOString();
  updateFlow(id, (f) => ({
    status: "published",
    enabled: f.status === "published" ? f.enabled : true,
    updatedAt: at,
    updatedBy: user,
    unpublishedChanges: false,
    versions: [{ at, status: "published", by: user }, ...f.versions],
  }));
}
