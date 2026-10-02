import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useState } from "react";
import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { assignTickets } from "./actions";
import { UnassignedAvatar, UserAvatar } from "./avatars";

const row =
  "flex w-full items-center gap-x-3 rounded-md px-3 h-14 text-sm cursor-pointer data-[selected=true]:bg-gray-100 hover:bg-gray-100 focus-visible:bg-gray-100 outline-hidden";
const key =
  "bg-white text-gray-500 border border-gray-200 h-6 w-fit min-w-6 gap-1 rounded-sm px-1 font-sans text-xs font-medium pointer-events-none inline-flex items-center justify-center select-none";

/**
 * The app's "Assign to" command dialog (720px, transparent overlay, search on top): Unassigned,
 * AI Agent and the workspace's one member, the signed-in user, with a check on the current one.
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
  // A single ticket shows its assignee's check mark; a bulk selection shows none.
  const current = useDemo((s) =>
    ticketIds.length === 1 ? (s.tickets.find((t) => t.id === ticketIds[0])?.assigneeId ?? null) : undefined,
  );
  const q = search.trim().toLowerCase();
  const showUnassign = "unassigned".includes(q);
  const showAi = "ai agent".includes(q);
  const showUser = user.name.toLowerCase().includes(q);

  const close = () => {
    onOpenChange(false);
    setSearch("");
  };
  const assign = (to: typeof user | null) => {
    close();
    if ((to?.id ?? null) !== current) assignTickets(ticketIds, to);
  };
  const check = <Icon name="circle-check" variant="fas" className="size-4 text-electric-green-500 ml-auto shrink-0" />;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => (o ? onOpenChange(true) : close())}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-transparent" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] border bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg w-[720px] p-0 gap-0"
        >
          <DialogPrimitive.Title className="sr-only">Assign to</DialogPrimitive.Title>
          <div className="text-sm">
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
              {showUnassign || showAi || showUser ? (
                <div>
                  <div className="flex items-center text-gray-400 font-medium mb-3 px-3 pt-3 pb-1 text-sm">Assign to</div>
                  <div className="space-y-1">
                    {showUnassign && (
                      <button type="button" className={cn(row, current === null && "bg-gray-50")} onClick={() => assign(null)}>
                        <div className="flex items-center justify-center">
                          <UnassignedAvatar size={24} />
                        </div>
                        <span>Unassigned</span>
                        {current === null && check}
                      </button>
                    )}
                    {showAi && (
                      // Handing a ticket to the AI Agent was not captured.
                      <Inert className={row}>
                        <div className="bg-(image:--color-ai-gradient-light) relative flex overflow-hidden items-center justify-center rounded-full select-none shrink-0 size-[24px]">
                          <Icon name="ai-symbol" variant="fak" className="ai-gradient-icon text-white size-4!" />
                        </div>
                        <span>AI Agent</span>
                      </Inert>
                    )}
                    {showUser && (
                      <button type="button" className={cn(row, current === user.id && "bg-gray-50")} onClick={() => assign(user)}>
                        <UserAvatar name={user.name} size={24} text="text-[12px]" />
                        <span>{user.name}</span>
                        <span className="text-gray-400">(You)</span>
                        {current === user.id && check}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4 text-gray-400 text-center text-sm">No results found</div>
              )}
            </div>
            <div className="flex flex-col-reverse sm:flex-row px-7 py-4 bg-gray-50 border-t sm:justify-start gap-4 text-gray-400 text-sm">
              <div className="flex gap-2 items-center">
                <kbd className={key}>
                  <Icon name="arrow-up" variant="fal" className="size-4 text-gray-500" />
                </kbd>
                <kbd className={key}>
                  <Icon name="arrow-down" variant="fal" className="size-4 text-gray-500" />
                </kbd>
                <span>to navigate</span>
              </div>
              <div className="flex gap-2 items-center">
                <kbd className={key}>
                  <Icon name="arrow-turn-down-left" variant="fal" className="size-4 text-gray-500" />
                </kbd>
                <span>to select</span>
              </div>
              <div className="flex gap-2 items-center">
                <kbd className={key}>Esc</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
