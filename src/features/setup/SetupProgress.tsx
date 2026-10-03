import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { setupSteps } from "./content";
import type { SetupStep } from "./fixtures";
import { useStepsDone } from "./stepsDone";

const bars = {
  done: "bg-electric-green-500",
  current: "bg-(image:--color-ai-gradient)",
  upcoming: "bg-gray-200",
};
const labels = { done: "text-electric-green-700", current: "text-gray-800", upcoming: "text-gray-400" };

/** A screen's step for the bar; "Go live" has no SetupStep, `"live"` marks it. */
export type ProgressStep = SetupStep | "live";

/**
 * The five setup steps as a bar row at the top of the setup modal's card: done in green, the
 * screen's own step in the AI gradient, the rest gray. The welcome passes no `current`, so nothing
 * there is; done is what the step list marks done.
 */
export function SetupProgress({ current }: { current?: ProgressStep }) {
  const done = useStepsDone();
  return (
    <ol aria-label="Setup progress" className="flex gap-2 px-6 pt-5 pb-1">
      {setupSteps.map((s, i) => {
        const state = current && (s.step ? s.step === current : current === "live") ? "current" : done[i] ? "done" : "upcoming";
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
