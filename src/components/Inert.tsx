import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = ComponentProps<"button">;

/**
 * Something that looks clickable on app.zaapi.com but leads to a page that was never captured
 * (user decision 2026-10-01: uncaptured pages are not built) or to an action outside the demo
 * (user decision 2026-10-03). Keeps its hover styles, adds no handler of its own, and says so to
 * assistive tech. Forwards props (and the handlers a Radix
 * `asChild` trigger injects, e.g. a tooltip closing on click).
 */
export function Inert({ className, ...props }: Props) {
  return (
    <button
      type="button"
      data-inert=""
      aria-disabled="true"
      {...props}
      className={cn(className, "cursor-default")}
    />
  );
}
