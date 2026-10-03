import { toast } from "sonner";
import { updateDemo } from "@/store/store";
import type { Message, Ticket } from "./fixtures";

// Every inbox action is a pure update of the tickets slice; nothing leaves the browser.
// Strings are the catalog's (chats.ticketEvent.*, chats.conversation.*, chats.assign.*).

/** "11:18": the 24-hour clock the inbox prints next to messages and events. */
export const clock = (date = new Date()) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const newId = () => `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function line(from: Message["from"], text: string): Message {
  return { id: newId(), from, text, time: clock() };
}

/** Apply `change` to the given tickets; a change that returns every ticket as-is writes nothing. */
function patch(ids: string[], change: (t: Ticket) => Ticket) {
  updateDemo((s) => {
    let changed = false;
    const tickets = s.tickets.map((t) => {
      const next = ids.includes(t.id) ? change(t) : t;
      changed ||= next !== t;
      return next;
    });
    return changed ? { ...s, tickets } : s;
  });
}

/** Assign to the signed-in user (the demo workspace's only member), or unassign with `null`. */
export function assignTickets(ids: string[], user: { id: string; name: string } | null) {
  const assigneeId = user?.id ?? null;
  patch(ids, (t) => {
    if (t.assigneeId === assigneeId) return t;
    const text = user ? `You assigned the ticket to yourself at ${clock()}` : `The ticket was unassigned at ${clock()}`;
    return { ...t, assigneeId, messages: [...t.messages, line("system", text)] };
  });
  toast.success(user ? `Assigned to ${user.name} successfully` : "Unassigned successfully");
}

export function toggleFollowUp(id: string) {
  patch([id], (t) => ({ ...t, followUp: !t.followUp }));
}

export function postMessage(id: string, text: string, mode: "reply" | "comment") {
  patch([id], (t) => ({ ...t, messages: [...t.messages, line(mode === "reply" ? "agent" : "comment", text)] }));
}

export function setConversionValue(id: string, value: string) {
  patch([id], (t) => (t.conversionValue === value ? t : { ...t, conversionValue: value }));
}
