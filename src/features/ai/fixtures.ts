// AI Agent slice of the demo store. The one seeded row is the system "Quick replies" source every
// workspace starts with (Step 9 screenshots); scenarios and personalities start empty, as captured.

export type KnowledgeSourceType = "quickReplies" | "file" | "website" | "manual_input";

export type KnowledgeSource = {
  id: string;
  name: string;
  enabled: boolean;
  /** Who uploaded it: "Zaapi System" for the seeded row, the signed-in user otherwise. */
  source: string;
  type: KnowledgeSourceType;
  /** The "Sources" column: file name, URL, or the source name for written text. */
  detail: string;
  /** Integration names; empty means all integrations. */
  integrations: string[];
  characters: number | null;
  createdAt: string | null;
};

export type ScenarioHandling = "follow_instruction" | "escalate_to_human_agent";

export type Scenario = {
  id: string;
  name: string;
  enabled: boolean;
  handling: ScenarioHandling;
  integrations: string[];
  createdBy: string;
  createdAt: string;
};

export type Personality = Omit<Scenario, "handling">;

export const aiSeed: { knowledgeSources: KnowledgeSource[]; scenarios: Scenario[]; personalities: Personality[] } = {
  knowledgeSources: [
    {
      id: "knowledge-1",
      name: "Quick replies",
      enabled: false,
      source: "Zaapi System",
      type: "quickReplies",
      detail: "See quick replies",
      integrations: [],
      characters: null,
      createdAt: null,
    },
  ],
  scenarios: [],
  personalities: [],
};
