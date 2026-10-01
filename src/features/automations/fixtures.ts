export type Automation = {
  id: string;
  name: string;
  type: "assign-to-agents";
  integrationIds: string[];
  enabled: boolean;
  createdBy: string;
  updatedBy: string | null;
  updatedAt: string; // ISO date
  // Assign-to-agents settings (PR 4). Optional so automations saved before they existed still load;
  // `automationSettings` in basic/settings.ts fills the defaults.
  description?: string;
  outsideHours?: "stop" | "continue";
  preference?: "prioritize_last_assigned" | "round_robin_only";
  assigneeIds?: string[];
};

// The automation from the Basic Automations screenshot; no flows yet.
export const automationsSeed: { automations: Automation[]; flows: Flow[] } = {
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
      assigneeIds: ["user-1"],
    },
  ],
  flows: [],
};

// ---------------------------------------------------------------------------------------------
// Flows (Flow Builder, PR 5). The seed has no flows, as in the Flow Builder screenshot; a flow is
// added by the "Create new flow" gallery. Node types and handle ids are the real canvas's
// (saved builder page): message_received, chatbot, close_chat, chat_assign.
// ---------------------------------------------------------------------------------------------

export type FlowNodeType = "message_received" | "chatbot" | "close_chat" | "chat_assign";

/** Settings a node shows on the canvas; each node type reads only its own fields. */
export type FlowNodeData = {
  integrationIds?: string[];
  assigneeIds?: string[];
  outsideHours?: "stop" | "continue";
  preference?: "prioritizeLastAssigned" | "roundRobinOnly";
};

export type FlowNode = { id: string; type: FlowNodeType; position: { x: number; y: number }; data: FlowNodeData };
export type FlowEdge = { id: string; source: string; target: string; sourceHandle: string | null };
export type FlowVersion = { at: string; status: "draft" | "published"; by: string };

export type Flow = {
  id: string;
  name: string;
  status: "draft" | "published";
  /** The list page's switch; only a published flow can be switched on. */
  enabled: boolean;
  createdBy: string;
  updatedBy: string;
  updatedAt: string; // ISO timestamp
  /** True when the canvas changed after the last publish (the "Update" button). */
  unpublishedChanges: boolean;
  versions: FlowVersion[]; // newest first
  nodes: FlowNode[];
  edges: FlowEdge[];
};
