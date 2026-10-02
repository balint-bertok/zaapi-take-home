// Section sidebars, with labels from the real English catalog (common.navigation*). An item without
// `to` is a page that was never captured: it renders, but through <Inert> (user decision 2026-10-01).

export type SectionItem = { label: string; to?: string };
export type SectionGroup = { label?: string; items: SectionItem[] };
export type Section = { title: string; groups: SectionGroup[] };

export const sections = {
  tickets: {
    title: "Tickets",
    groups: [
      {
        label: "Open tickets",
        items: [{ label: "My Inbox" }, { label: "Unassigned" }, { label: "All", to: "/tickets" }],
      },
      { label: "Saved views", items: [{ label: "Pinned by me" }, { label: "All saved views" }] },
      // Closed stays inert so the demo tour keeps to its path; `/tickets?inbox=closed` is still read by
      // the page when typed (user decision, 2026-10-02).
      { label: "Completed", items: [{ label: "Closed" }, { label: "Spam" }] },
    ],
  },
  ai: {
    title: "AI Agent",
    groups: [
      {
        label: "Train",
        items: [
          { label: "Knowledge Source", to: "/ai/train/knowledge-source" },
          { label: "Scenario Handling", to: "/ai/train/scenario-handling" },
          { label: "Personality", to: "/ai/train/personality" },
        ],
      },
      { label: "Launch", items: [{ label: "Test", to: "/ai/testing" }, { label: "Deploy" }] },
      { label: "Monitor", items: [{ label: "Analyse" }] },
    ],
  },
  automations: {
    title: "Automations",
    groups: [
      {
        items: [
          { label: "Basic Automations", to: "/automations/basic-automations" },
          { label: "Flow Builder", to: "/automations/flows" },
        ],
      },
    ],
  },
  settings: {
    title: "Settings",
    groups: [
      {
        label: "Account",
        items: [
          { label: "Business Information" },
          { label: "Account Settings" },
          { label: "Billing", to: "/settings/billing" },
          { label: "Team Management" },
        ],
      },
      {
        label: "Workspace",
        items: [{ label: "Labels" }, { label: "Quick Replies" }, { label: "Ticket Fields" }, { label: "Contact Fields" }],
      },
      { label: "System", items: [{ label: "Integrations" }, { label: "Workflows" }, { label: "Data Exports" }] },
      // On app.zaapi.com since the capture (common.navigation.settings.*); not built, so inert.
      { label: "Developers", items: [{ label: "API keys" }, { label: "Webhooks" }] },
    ],
  },
} satisfies Record<string, Section>;

export type SectionKey = keyof typeof sections;

/** Where a section's rail icon leads: its first linked sidebar entry. */
export const sectionHome = (key: SectionKey) =>
  sections[key].groups.flatMap((g) => g.items).find((i) => i.to)!.to!;
