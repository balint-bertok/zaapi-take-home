import type { ReactNode } from "react";
import { Icon, type IconName } from "@/icons/Icon";
import { cn } from "@/lib/cn";

/** One row of a setup page's icon-and-text list: the readiness summary, the flow blocks. */
export function IconRow({ icon, iconClassName, className, children }: { icon: IconName; iconClassName: string; className?: string; children: ReactNode }) {
  return (
    <li className={cn("flex items-start gap-3 text-sm", className)}>
      <span className="flex items-center justify-center size-5 shrink-0">
        <Icon name={icon} className={cn("size-4!", iconClassName)} />
      </span>
      <span className="text-gray-800">{children}</span>
    </li>
  );
}
