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
    },
  ],
  flows: [],
};
