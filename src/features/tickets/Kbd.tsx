import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Keyboard hint, as in the app's dropdown shortcuts and command footers. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("rounded-sm border border-gray-200 px-1.5 py-0.5 font-sans text-[11px] text-gray-700", className)}>
      {children}
    </kbd>
  );
}
