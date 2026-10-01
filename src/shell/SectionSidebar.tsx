import { Link, useLocation } from "react-router";
import { Inert } from "@/components/Inert";
import { sections, type Section, type SectionKey } from "./sections";

const item =
  "flex w-full items-center overflow-hidden rounded-md p-3 text-left text-zinc-500 outline-hidden transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 text-sm gap-2.5";

/** The 240px section menu next to the rail. The active entry is the longest `to` the URL starts with. */
export function SectionSidebar({ section }: { section: SectionKey }) {
  const { title, groups }: Section = sections[section];
  const { pathname } = useLocation();
  const active = groups
    .flatMap((g) => g.items.map((i) => i.to ?? ""))
    .filter((to) => to && pathname.startsWith(to))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <aside
      aria-label={title}
      className="fixed inset-y-0 z-30 flex flex-col bg-sidebar border-gray-200 gap-4 pt-[6px] pb-[8px] h-(--height-page-content-with-banner) top-(--banner-height) left-[56px] w-[240px]"
    >
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
                      <Link to={to} data-active={to === active} className={item}>
                        <span className="font-medium shrink-0">{label}</span>
                      </Link>
                    ) : (
                      <Inert className={item}>
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
