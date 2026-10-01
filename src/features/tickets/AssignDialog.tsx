import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { assignTickets } from "./actions";
import { UserAvatar } from "./avatars";
import { Kbd } from "./Kbd";

const row =
  "flex w-full items-center gap-x-3 rounded-md px-3 h-14 text-sm cursor-pointer hover:bg-gray-100 focus-visible:bg-gray-100 outline-hidden";

/**
 * The app's "Assign to" command dialog (720px, transparent overlay, search on top). The demo
 * workspace has one member, the signed-in user; "Unassigned" shows once a ticket has an assignee.
 */
export function AssignDialog({
  ticketIds,
  open,
  onOpenChange,
}: {
  ticketIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const user = useDemo((s) => s.user);
  const [search, setSearch] = useState("");
  // A single ticket shows its assignee (and "Unassigned"); a bulk selection shows neither.
  const current = useDemo((s) => (ticketIds.length === 1 ? s.tickets.find((t) => t.id === ticketIds[0])?.assigneeId : undefined));
  const showUser = user.name.toLowerCase().includes(search.trim().toLowerCase());
  const showUnassign = !!current && "unassigned".includes(search.trim().toLowerCase());

  const close = () => {
    onOpenChange(false);
    setSearch("");
  };
  const assign = (to: typeof user | null) => {
    close();
    if ((to?.id ?? null) !== current) assignTickets(ticketIds, to);
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-transparent" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg w-[720px] p-0 gap-0 text-sm"
        >
          <DialogPrimitive.Title className="sr-only">Assign to</DialogPrimitive.Title>
          <div className="relative border-b border-gray-200 h-[48px] flex items-center px-5 gap-2">
            <Icon name="magnifying-glass" className="size-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                if (showUnassign) assign(null);
                else if (showUser) assign(user);
              }}
              placeholder="Search"
              className="flex-1 outline-none placeholder:text-gray-400 text-gray-800 text-[13px] bg-transparent"
            />
          </div>
          <div className="overflow-y-auto max-h-[320px] px-2 pt-1 pb-2">
            {showUser || showUnassign ? (
              <div>
                <div className="flex items-center text-gray-400 font-medium mb-3 px-3 pt-3 pb-1 text-sm">Assign to</div>
                <div className="space-y-1">
                  {showUnassign && (
                    <button type="button" className={row} onClick={() => assign(null)}>
                      <Icon name="circle-user" className="size-6! text-gray-400" />
                      <span>Unassigned</span>
                    </button>
                  )}
                  {showUser && (
                    <button type="button" className={cn(row, current === user.id && "bg-gray-50")} onClick={() => assign(user)}>
                      <UserAvatar name={user.name} size={24} />
                      <span>{user.name}</span>
                      <span className="text-gray-400">(You)</span>
                      {current === user.id && (
                        <Icon name="circle-check" variant="fas" className="size-4 text-electric-green-500 ml-auto shrink-0" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="px-4 py-4 text-gray-400 text-center text-sm">No results found</div>
            )}
          </div>
          <div className="flex items-center gap-4 border-t border-gray-200 px-5 h-10 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <Kbd>↵</Kbd>
              to select
            </span>
            <span className="flex items-center gap-1.5">
              <Kbd>esc</Kbd>
              to close
            </span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
