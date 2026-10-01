import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

type Props = ComponentProps<"button">;

/**
 * Something that looks clickable on app.zaapi.com but leads to a page that was never captured
 * (user decision 2026-10-01: uncaptured pages are not built). Keeps its hover styles, has no
 * handler, and says so to assistive tech. Forwards props so it can be a Radix `asChild` trigger.
 */
export function Inert({ className, children, ...props }: Props) {
  return (
    <button
      type="button"
      data-inert=""
      aria-disabled="true"
      {...props}
      onClick={undefined}
      className={cn(className, "cursor-default")}
    >
      {children}
    </button>
  );
}
