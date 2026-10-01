import type { ReactNode } from "react";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";

/** The app's square checkbox (electric green when checked), drawn only; the row around it is the control. */
export function CheckMark({ checked }: { checked: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "size-4 shrink-0 rounded-[4px] border flex items-center justify-center",
        checked ? "bg-electric-green-500 border-electric-green-500 text-white" : "border-gray-300 bg-white",
      )}
    >
      {checked && <Icon name="check" variant="fas" className="size-2.5!" />}
    </span>
  );
}

/** One row of a multi-select popover: check mark plus label, toggled on click. */
export function CheckItem({ checked, onToggle, children }: { checked: boolean; onToggle: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="menuitemcheckbox"
      aria-checked={checked}
      onClick={onToggle}
      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-gray-100"
    >
      <CheckMark checked={checked} />
      {children}
    </button>
  );
}
