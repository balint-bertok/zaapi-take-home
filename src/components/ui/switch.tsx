import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Default size is the w-12 h-6 switch from the AI pages; pass className/thumbClassName for the
// h-5 w-10 one in the tickets list's Follow Up filter (thumb "w-3.5 h-3.5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0").
export function Switch({
  className,
  thumbClassName,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root> & { thumbClassName?: string }) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-xs transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-electric-green-500 data-[state=unchecked]:bg-gray-200 w-12 h-6",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform w-4 h-4 data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1",
          thumbClassName,
        )}
      />
    </SwitchPrimitive.Root>
  );
}
