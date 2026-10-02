// Guided setup slice of the demo store. A new workspace has no live agent: the dashboard stays
// inert until the tour's last step sets `agentLive`. `setupDone` lists the steps finished so far;
// "Go live" is not a step here, `agentLive` stands for it. `personaLanguage` is the one persona
// field the later steps read back (the readiness summary compares it with the channel).

import type { Language } from "./content";

export type SetupStep = "persona" | "scenarios" | "knowledge" | "test";

export const setupSeed: { agentLive: boolean; agentShare: number; setupDone: SetupStep[]; personaLanguage: Language } = {
  agentLive: false,
  agentShare: 20,
  setupDone: [],
  personaLanguage: "Thai",
};
