import { toast } from "sonner";
import { updateDemo } from "@/store/store";
import type { DemoState } from "@/store/fixtures";
import type { ContactFieldKey, Message, Ticket } from "./fixtures";

// Every inbox action is a pure update of the tickets slice; nothing leaves the browser.
// Strings are the catalog's (chats.ticketEvent.*, chats.conversation.*, chats.closeTicket.*, chats.assign.*).

/** "11:18": the 24-hour clock the inbox prints next to messages and events. */
export const clock = (date = new Date()) =>
  `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

const newId = () => `message-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function line(from: Message["from"], text: string): Message {
  return { id: newId(), from, text, time: clock() };
}

/** Apply `change` to the given tickets; a change that returns every ticket as-is writes nothing. */
function patch(ids: string[], change: (t: Ticket, s: DemoState) => Ticket) {
  updateDemo((s) => {
    let changed = false;
    const tickets = s.tickets.map((t) => {
      const next = ids.includes(t.id) ? change(t, s) : t;
      changed ||= next !== t;
      return next;
    });
    return changed ? { ...s, tickets } : s;
  });
}

/** `success` is chats.closeTicket.success, or common.bulkAction.closeChatsSuccess from the list. */
export function closeTickets(ids: string[], success = "Ticket closed") {
  patch(ids, (t, s) =>
    t.status === "closed"
      ? t
      : {
          ...t,
          status: "closed",
          closedAt: Date.now(),
          messages: [...t.messages, line("ticket", `Ticket #${t.number} closed by ${s.user.name} at ${clock()}`)],
        },
  );
  toast.success(success);
}

export function reopenTicket(id: string) {
  patch([id], (t, s) => ({
    ...t,
    status: "open",
    openedAt: Date.now(),
    closedAt: null,
    messages: [...t.messages, line("ticket", `Ticket #${t.number} opened by ${s.user.name} at ${clock()}`)],
  }));
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

export function setContactField(id: string, key: ContactFieldKey, value: string) {
  patch([id], (t) => (t.contact[key] === value ? t : { ...t, contact: { ...t.contact, [key]: value } }));
}

export function setConversionValue(id: string, value: string) {
  patch([id], (t) => (t.conversionValue === value ? t : { ...t, conversionValue: value }));
}
