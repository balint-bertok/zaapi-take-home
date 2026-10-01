import { useState } from "react";
import { Inert } from "@/components/Inert";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { closeTickets } from "./actions";
import { AssignDialog } from "./AssignDialog";
import { ContactAvatar, UserAvatar } from "./avatars";
import { Checkbox } from "./Checkbox";
import type { Ticket } from "./fixtures";
import type { Inbox } from "./inbox";
import { iconButton } from "./styles";

const emptyText = (inbox: Inbox, followOnly: boolean) =>
  followOnly
    ? "You haven't marked any tickets to follow up"
    : inbox === "closed"
      ? "You haven't closed any tickets"
      : "All tickets are closed";

/** The ticket list column: header, bulk row with the Follow Up filter, cards, bulk-select bar. */
export function TicketList({
  inbox,
  tickets,
  selectedId,
  onSelect,
}: {
  inbox: Inbox;
  tickets: Ticket[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [followOnly, setFollowOnly] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const [assigning, setAssigning] = useState<string[] | null>(null);
  const shown = followOnly ? tickets.filter((t) => t.followUp) : tickets;
  const live = checked.filter((id) => shown.some((t) => t.id === id));
  const allChecked = shown.length > 0 && live.length === shown.length;
  const toggle = (id: string) => setChecked(live.includes(id) ? live.filter((c) => c !== id) : [...live, id]);

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex flex-col justify-center bg-white">
        <div className="pl-4 pr-4 flex-1 flex items-end pt-4 pb-2">
          <div className="flex flex-1 items-center gap-x-2 min-w-0 h-8">
            <div className="flex-1 flex items-center gap-0.5 min-w-0">
              <span className="text-base font-semibold truncate p-1 py-0.5">
                {inbox === "closed" ? "Closed" : "All tickets"}
              </span>
              <div className="pl-1">
                <Inert className={cn(iconButton, "size-7")}>
                  <Icon name="ellipsis-vertical" className="h-4 w-4" />
                </Inert>
              </div>
            </div>
            <div className="flex items-center gap-x-1 ml-auto">
              <Inert className={iconButton} aria-label="Sort from newest to oldest">
                <Icon name="arrow-up-arrow-down" className="size-4! text-gray-600" />
              </Inert>
              <Inert className={iconButton} aria-label="Filters">
                <Icon name="bars-filter" className="size-4!" />
              </Inert>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pr-4 pl-4.5 gap-1 pt-1 pb-1.5">
          <div className="flex gap-2 items-center">
            <Checkbox
              aria-label="Select All"
              checked={allChecked}
              onCheckedChange={() => setChecked(allChecked ? [] : shown.map((t) => t.id))}
              className="size-4.5 mr-1"
            />
            <button
              type="button"
              aria-label="Assign ticket"
              className={cn(iconButton, "size-7")}
              disabled={live.length === 0}
              onClick={() => setAssigning(live)}
            >
              <Icon name="user-plus" className="size-4" />
            </button>
            <div className="-ml-0.5">
              <button
                type="button"
                aria-label="Close tickets"
                className={cn(iconButton, "size-7")}
                disabled={live.length === 0 || inbox === "closed"}
                onClick={() => {
                  closeTickets(live, "Tickets closed");
                  setChecked([]);
                }}
              >
                <Icon name="check" className="size-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <label htmlFor="follow-up-filter" className="text-[11px] font-medium text-gray-400">
              Follow Up
            </label>
            <Switch
              id="follow-up-filter"
              checked={followOnly}
              onCheckedChange={setFollowOnly}
              className="h-5 w-10"
              thumbClassName="w-3.5 h-3.5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
            />
          </div>
        </div>
      </div>

      <section aria-label="Tickets" className="bg-white overflow-y-auto h-full p-1.5">
        {shown.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-gray-400">{emptyText(inbox, followOnly)}</p>
        ) : (
          shown.map((t) => (
            <TicketCard
              key={t.id}
              ticket={t}
              selected={t.id === selectedId}
              checked={live.includes(t.id)}
              onSelect={() => onSelect(t.id)}
              onCheck={() => toggle(t.id)}
              onAssign={() => setAssigning([t.id])}
            />
          ))
        )}
      </section>

      <div
        className={cn(
          "absolute bottom-12 left-0 right-0 w-fit mx-auto transition-all",
          live.length ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-8",
        )}
      >
        <div className="shadow-md bg-white flex gap-1.5 items-center rounded-md border border-gray-200 px-2 py-1 text-gray-500">
          <span className="truncate text-gray-800 font-medium text-sm">{live.length} selected</span>
          <button type="button" aria-label="Close" className="flex items-center" onClick={() => setChecked([])}>
            <Icon name="xmark" className="size-4! text-gray-500" />
          </button>
        </div>
      </div>

      <AssignDialog ticketIds={assigning ?? []} open={!!assigning} onOpenChange={(o) => !o && setAssigning(null)} />
    </div>
  );
}

function TicketCard({
  ticket,
  selected,
  checked,
  onSelect,
  onCheck,
  onAssign,
}: {
  ticket: Ticket;
  selected: boolean;
  checked: boolean;
  onSelect: () => void;
  onCheck: () => void;
  onAssign: () => void;
}) {
  const user = useDemo((s) => s.user);
  const bubbles = ticket.messages.filter((m) => m.from === "contact" || m.from === "agent");
  const last = bubbles[bubbles.length - 1];
  const assignee = ticket.assigneeId === user.id ? user : null;
  return (
    <div
      role="button"
      tabIndex={0}
      aria-current={selected || undefined}
      onClick={onSelect}
      // Only the card itself: Enter/Space on the nested assignee chip or checkbox must reach that control.
      onKeyDown={(e) => e.target === e.currentTarget && (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onSelect())}
      className={cn(
        "group/chat-card select-none flex flex-col items-start justify-center gap-2 pl-6 pr-3 mb-1 hover:bg-gray-100 rounded-lg relative w-full h-[96px] cursor-pointer",
        selected && "bg-gray-100",
      )}
    >
      <div className="flex w-full">
        <ContactAvatar size={48} />
        <div className="min-w-0 ml-4 grow space-y-1">
          <div className="flex items-center h-6">
            <p className="mr-2.5 truncate font-medium">{ticket.contactName}</p>
            <p className="text-gray-400 text-sm ml-auto whitespace-nowrap">{last?.time}</p>
          </div>
          <div className="flex items-center">
            <div className="truncate text-sm text-[#4b4a4b]">{last?.text}</div>
          </div>
        </div>
      </div>
      <div className="relative flex w-full items-center flex-row gap-3 justify-between">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAssign();
          }}
          className="flex items-center bg-white rounded-full px-2 h-7 max-w-36 border border-gray-200 hover:bg-gray-50"
        >
          {assignee ? (
            <UserAvatar name={assignee.name} />
          ) : (
            <span className="relative flex items-center justify-center rounded-full border border-gray-300 bg-gray-100 shrink-0 size-4">
              <Icon name="user" variant="fas" className="text-gray-400 size-2.5!" />
            </span>
          )}
          <span className="ml-2 text-sm text-gray-600 truncate">{assignee ? assignee.name : "Unassigned"}</span>
        </button>
      </div>
      <label
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "absolute group-hover/chat-card:opacity-100 duration-300 transition-opacity cursor-pointer h-full left-0 top-0 px-1 flex items-center justify-center",
          checked ? "opacity-100" : "opacity-0",
        )}
      >
        <Checkbox aria-label={ticket.contactName} checked={checked} onCheckedChange={onCheck} className="size-[16px] bg-white" />
      </label>
    </div>
  );
}
