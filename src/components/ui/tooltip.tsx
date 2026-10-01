import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Copied from the app's tooltip wrapper (dark gray-800 bubble with arrow). Needs the single
// TooltipProvider that App mounts.
export function Tooltip({
  content,
  children,
  side,
  className,
}: { content: ReactNode; children: ReactNode; className?: string } & Pick<
  ComponentProps<typeof TooltipPrimitive.Content>,
  "side"
>) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side={side}
          className={cn(
            "bg-gray-800 text-white animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
            className,
          )}
        >
          {content}
          <TooltipPrimitive.Arrow className="bg-gray-800 fill-gray-800 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
