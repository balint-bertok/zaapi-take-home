import { NavLink } from "react-router";
import { Inert } from "@/components/Inert";
import { cn } from "@/lib/cn";
import { sections, type Section, type SectionKey } from "./sections";

// Shared with the guided setup's step sidebar (src/features/setup/SetupSidebar.tsx).
export const sidebarAside =
  "fixed inset-y-0 z-30 flex flex-col bg-sidebar border-gray-200 gap-4 pt-[6px] pb-[8px] h-(--height-page-content-with-banner) top-(--banner-height) left-[56px] w-[240px]";
export const sidebarItem =
  "flex w-full items-center overflow-hidden rounded-md p-3 text-left text-zinc-500 outline-hidden transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 text-sm gap-2.5";
export const sidebarActiveItem = "bg-sidebar-accent text-sidebar-accent-foreground";

/** The 240px section menu next to the rail; an entry is active on its own URL and any below it. */
export function SectionSidebar({ section }: { section: SectionKey }) {
  const { title, groups }: Section = sections[section];
  return (
    <aside aria-label={title} className={sidebarAside}>
      <div className="flex gap-2 p-2 pt-5 px-3 pb-2 flex-row items-center justify-between">
        <h2 className="pl-2 font-semibold text-base text-gray-900">{title}</h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-3 pb-24 relative">
        <div className="flex w-full min-w-0 flex-col gap-7">
          {groups.map((group, g) => (
            <div key={group.label ?? g} className="relative flex w-full min-w-0 flex-col p-0">
              {group.label && (
                <div className="mb-1 flex items-center justify-between gap-2">
                  <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">
                    {group.label}
                  </div>
                </div>
              )}
              <ul className="flex w-full min-w-0 flex-col gap-2 text-sm">
                {group.items.map(({ label, to }) => (
                  <li key={label} className="relative">
                    {to ? (
                      <NavLink to={to} className={({ isActive }) => cn(sidebarItem, isActive && sidebarActiveItem)}>
                        <span className="font-medium shrink-0">{label}</span>
                      </NavLink>
                    ) : (
                      <Inert className={sidebarItem}>
                        <span className="font-medium shrink-0">{label}</span>
                      </Inert>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
