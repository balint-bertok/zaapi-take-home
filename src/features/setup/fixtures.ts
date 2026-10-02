// Guided setup slice of the demo store. A new workspace has no live agent: the dashboard stays
// inert until the tour's last step sets `agentLive`. `setupDone` lists the steps finished so far;
// "Go live" is not a step here, `agentLive` stands for it.

export type SetupStep = "persona" | "scenarios" | "knowledge" | "test";

export const setupSeed: { agentLive: boolean; agentShare: number; setupDone: SetupStep[] } = {
  agentLive: false,
  agentShare: 20,
  setupDone: [],
};
