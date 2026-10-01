import type { ReactNode } from "react";
import { Link } from "react-router";
import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { sections } from "@/shell/sections";
import { useDemo } from "@/store/store";
import { UserAvatar } from "./avatars";
import { inboxFrom, type Inbox } from "./inbox";

// Same frame and item classes as the shell's SectionSidebar (saved markup), plus what only the
// inbox menu has: per-entry icons, live counts, the disabled "+" and the saved-view carets.
const item =
  "flex w-full items-center overflow-hidden rounded-md p-3 text-left text-zinc-500 outline-hidden transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-9 text-sm gap-2";
const activeItem = "bg-sidebar-accent text-sidebar-accent-foreground";
const caret = <Icon name="caret-down" variant="fas" className="text-gray-400 size-2.5! -rotate-90" />;

type Decoration = { icon: ReactNode; count?: number; caret?: boolean; action?: boolean };

export function TicketsSidebar({ inbox }: { inbox: Inbox }) {
  const { title, groups } = sections.tickets;
  const user = useDemo((s) => s.user);
  const tickets = useDemo((s) => s.tickets);
  const open = tickets.filter((t) => t.status === "open");

  // Keyed by the catalog label in sections.ts, which stays the one home for labels and links.
  const decorations: Record<string, Decoration> = {
    "My Inbox": { icon: <UserAvatar name={user.name} />, count: open.filter((t) => t.assigneeId === user.id).length },
    Unassigned: { icon: <Icon name="circle-user" className="text-gray-400" />, count: open.filter((t) => !t.assigneeId).length },
    All: { icon: <Icon name="message-dots" className="text-gray-400" />, count: open.length },
    "Pinned by me": { icon: <Icon name="thumbtack" className="size-4 text-gray-400" />, caret: true },
    "All saved views": { icon: <Icon name="folder-open" className="size-4 text-gray-400" />, caret: true, action: true },
    Closed: { icon: <Icon name="check" className="text-gray-400" /> },
    Spam: { icon: <Icon name="octagon-exclamation" className="text-gray-400" /> },
  };
  const isActive = (to: string) => inboxFrom(new URLSearchParams(to.split("?")[1]).get("inbox")) === inbox;

  return (
    <aside
      aria-label={title}
      className="fixed inset-y-0 z-30 flex flex-col bg-sidebar border-gray-200 gap-4 pt-[6px] pb-[8px] h-(--height-page-content-with-banner) top-(--banner-height) left-[56px] w-[240px]"
    >
      <div className="flex gap-2 p-2 pt-5 px-3 pb-2 flex-row items-center justify-between">
        <h2 className="pl-2 font-semibold text-base text-gray-900">{title}</h2>
        <Inert className="flex items-center justify-center size-7 rounded-lg bg-gray-800 text-white opacity-50">
          <Icon name="plus" variant="far" className="size-4 text-white" />
        </Inert>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-3 pt-1 pb-24 relative">
        <div className="flex w-full min-w-0 flex-col gap-7">
          {groups.map((group) => (
            <div key={group.label} className="relative flex w-full min-w-0 flex-col p-0">
              <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">
                {group.label}
              </div>
              <ul className="flex w-full min-w-0 flex-col gap-2 text-sm">
                {group.items.map(({ label, to }: { label: string; to?: string }) => {
                  const d = decorations[label];
                  const body = (
                    <>
                      {d?.icon}
                      <span className={cn("font-medium min-w-0 flex items-center", d?.count === undefined ? "gap-3" : "flex-1 mr-8")}>
                        <span className="truncate">{label}</span>
                        {d?.count !== undefined && <span className="shrink-0 ml-1">({d.count})</span>}
                        {d?.caret && caret}
                      </span>
                    </>
                  );
                  return (
                    <li key={label} className="group/menu-item relative">
                      {to ? (
                        <Link to={to} className={cn(item, isActive(to) && activeItem)}>
                          {body}
                        </Link>
                      ) : (
                        <Inert className={item}>{body}</Inert>
                      )}
                      {d?.action && (
                        <Inert
                          className="absolute right-1 top-1.5 flex aspect-square w-6 items-center justify-center rounded-md p-0 opacity-0 group-hover/menu-item:opacity-100 hover:bg-sidebar-accent"
                        >
                          <Icon name="plus" variant="fas" className="size-3.5! text-gray-400" />
                        </Inert>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
