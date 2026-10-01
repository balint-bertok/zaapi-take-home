import type { ComponentProps } from "react";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";

/**
 * The inbox's square checkbox (saved markup: Radix checkbox classes). Kept in the feature folder so
 * parallel PRs adding their own primitives do not collide.
 */
export function Checkbox({
  checked,
  onCheckedChange,
  className,
  ...props
}: Omit<ComponentProps<"button">, "onClick"> & { checked: boolean; onCheckedChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      onClick={onCheckedChange}
      className={cn(
        "peer shrink-0 rounded-md flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-electric-green-500 border border-gray-300 hover:border-gray-400 data-[state=checked]:bg-gray-600 data-[state=checked]:border-gray-600 text-white",
        className,
      )}
      {...props}
    >
      {checked && <Icon name="check" variant="fas" className="size-2.5!" />}
    </button>
  );
}
