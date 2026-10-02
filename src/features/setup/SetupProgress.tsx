import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { setupSteps } from "./content";

const bars = {
  done: "bg-electric-green-500",
  current: "bg-(image:--color-ai-gradient)",
  upcoming: "bg-gray-200",
};
const labels = { done: "text-electric-green-700", current: "text-gray-800", upcoming: "text-gray-400" };

/**
 * The five setup steps as a bar row at the top of the setup modal's card: done in green, the
 * screen's own step in the AI gradient, the rest gray. The welcome passes no `step`, so nothing
 * there is current. Done reads from the store as the step list does; "Go live" is done once `agentLive`.
 */
export function SetupProgress({ step }: { step?: number }) {
  const setupDone = useDemo((s) => s.setupDone);
  const agentLive = useDemo((s) => s.agentLive);
  return (
    <ol aria-label="Setup progress" className="flex gap-2 px-6 pt-5 pb-1">
      {setupSteps.map((s, i) => {
        const state = i + 1 === step ? "current" : (s.step ? setupDone.includes(s.step) : agentLive) ? "done" : "upcoming";
        return (
          <li key={s.label} aria-current={state === "current" ? "step" : undefined} className="flex-1 flex flex-col gap-2">
            <div className={cn("h-1.5 rounded-full w-full", bars[state])} />
            <div className={cn("text-[11px] font-medium leading-none flex items-center gap-1", labels[state])}>
              {state === "done" && <Icon name="check" className="size-3!" />}
              {s.label}
              <span className="sr-only">, {state}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
