import { useDemo } from "@/store/store";
import { setupSteps } from "./content";

/** Whether each step is done, in tour order, for the step list and the modal's step bar; "Go live" is done once `agentLive`. */
export function useStepsDone() {
  const setupDone = useDemo((s) => s.setupDone);
  const agentLive = useDemo((s) => s.agentLive);
  return setupSteps.map(({ step }) => (step ? setupDone.includes(step) : agentLive));
}
