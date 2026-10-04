// Guided setup slice of the demo store. A new workspace has no live agent: the dashboard stays
// inert until the tour's last step sets `agentLive`. `setupDone` lists the steps finished so far;
// "Go live" is not a step here, `agentLive` stands for it. `personaLanguage` is the one persona
// field the later steps read back (the readiness summary compares it with the channel);
// `flowTemplate` is the workflow step's pick, which go live publishes and the done page names.

import { channelLanguage, flowTemplates, shares, type FlowTemplateId, type Language } from "./content";

export type SetupStep = "persona" | "scenarios" | "knowledge" | "test" | "workflow";

export const setupSeed: { agentLive: boolean; agentShare: number; setupDone: SetupStep[]; personaLanguage: Language; flowTemplate: FlowTemplateId } = {
  agentLive: false,
  agentShare: shares[0].value,
  setupDone: [],
  personaLanguage: channelLanguage,
  flowTemplate: flowTemplates[0].id,
};

/** `done` with `step` added once. */
export const withStep = (done: SetupStep[], step: SetupStep) => (done.includes(step) ? done : [...done, step]);
