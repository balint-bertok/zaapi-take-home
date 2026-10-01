import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

const container = "mx-auto min-w-(--min-width-content) max-w-(--max-width-content)";

/**
 * The standard page inside the content card: a 70px breadcrumb header (last entry is the current
 * page) over the scrolling, width-capped page container. Pages with their own header (Tickets)
 * render straight into the card instead. Without `className` the container carries the automations
 * pages' spacing (`mb-8` plus a `mt-3` wrapper); with it, the container takes exactly those classes,
 * as on the settings and AI pages (`space-y-10 pb-7` and similar).
 */
export function ShellPage({
  breadcrumb,
  className,
  children,
}: {
  breadcrumb: Crumb[];
  className?: string;
  children?: ReactNode;
}) {
  return (
    <>
      <header className="absolute top-0 left-0 right-(--scrollbar-reserve) z-20 h-(--height-auth-header) rounded-tl-lg bg-white backdrop-blur-sm pl-10 pr-[calc(--spacing(10)-var(--scrollbar-reserve))]">
        <div className="mx-auto flex h-full w-full min-w-(--min-width-content) max-w-(--max-width-content) items-center justify-start gap-4">
          <Breadcrumb trail={breadcrumb} />
        </div>
      </header>
      <div className="bg-(--content-area-background) px-10 overflow-auto overscroll-x-none h-(--height-page-content-with-banner) pt-(--auth-header-height)">
        {className ? (
          <main className={cn(container, className)}>{children}</main>
        ) : (
          <main className={cn(container, "mb-8")}>
            <div className="mt-3">{children}</div>
          </main>
        )}
      </div>
    </>
  );
}
