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
      // Closed stays inert: tickets never close in the demo (user decision, 2026-10-03).
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
} satisfies Record<string, Section>;

export type SectionKey = keyof typeof sections;

/** Where a section's rail icon leads: its first linked sidebar entry. */
export const sectionHome = (key: SectionKey) =>
  sections[key].groups.flatMap((g) => g.items).find((i) => i.to)!.to!;
