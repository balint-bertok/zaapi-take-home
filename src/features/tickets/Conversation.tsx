import * as Collapsible from "@radix-ui/react-collapsible";
import { useEffect, useRef, useState } from "react";
import { Inert } from "@/components/Inert";
import { Button, buttonClass } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/menu";
import { Tooltip } from "@/components/ui/tooltip";
import { Icon, type IconName } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { closeTickets, postMessage, reopenTicket, setConversionValue, toggleFollowUp } from "./actions";
import { AssignDialog } from "./AssignDialog";
import { ContactAvatar, UserAvatar } from "./avatars";
import type { Message, Ticket } from "./fixtures";
import { Kbd } from "./Kbd";
import { iconButton } from "./styles";

/** Middle column: conversation header, ticket fields, thread and composer (or the closed state). */
export function Conversation({ ticket }: { ticket: Ticket }) {
  const integration = useDemo((s) => s.integrations.find((i) => i.id === ticket.integrationId));
  return (
    <div className="flex flex-col min-w-0 flex-1 h-full">
      <Header ticket={ticket} account={integration?.name ?? ""} />
      <TicketFields ticket={ticket} />
      <Thread messages={ticket.messages} />
      <div className="h-px bg-gray-200 shrink-0" />
      <div className="relative flex flex-col flex-[36.913_1_0px] min-h-0">
        {/* Under the closed overlay the composer is out of reach for keyboard too, not just covered. */}
        <div inert={ticket.status === "closed"} className="flex flex-col flex-1 min-h-0">
          <Composer key={ticket.id} ticketId={ticket.id} />
        </div>
        {ticket.status === "closed" && <ClosedState ticketId={ticket.id} />}
      </div>
    </div>
  );
}

function Header({ ticket, account }: { ticket: Ticket; account: string }) {
  const user = useDemo((s) => s.user);
  const [assigning, setAssigning] = useState(false);
  const assignee = ticket.assigneeId === user.id ? user : null;
  return (
    <div className="bg-white box-border flex items-end pb-1 px-4 pt-4 shrink-0">
      <div className="flex flex-1 items-center min-w-0">
        <ContactAvatar size={36} />
        <div className="ml-3.5 flex flex-col w-full min-w-0">
          <div className="flex items-center min-w-0 gap-1.5">
            <Inert className="min-w-0 px-1 -mx-1 py-0.5 rounded-lg hover:bg-gray-100 flex items-center gap-2">
              <p className="text-gray-800 truncate text-[13px]">{ticket.contactName}</p>
            </Inert>
          </div>
          <p className="text-[12px] text-gray-400 truncate">{account}</p>
        </div>
      </div>
      <div className="flex gap-x-1 items-center">
        <Tooltip content={assignee ? `Assigned to ${assignee.name}` : "Assign ticket"}>
          <button type="button" aria-label="Assign ticket" className={iconButton} onClick={() => setAssigning(true)}>
            {assignee ? (
              <UserAvatar name={assignee.name} size={22} />
            ) : (
              <div className="size-[22px] rounded-full flex items-center justify-center">
                <Icon name="user-plus" className="size-4.5! text-gray-500" />
              </div>
            )}
          </button>
        </Tooltip>
        <Tooltip content="Follow Up">
          <button
            type="button"
            aria-label="Follow Up"
            aria-pressed={ticket.followUp}
            className={iconButton}
            onClick={() => toggleFollowUp(ticket.id)}
          >
            <Icon name="bookmark" variant="fal" className={cn("size-4!", ticket.followUp ? "text-warning-500" : "text-gray-600")} />
          </button>
        </Tooltip>
        <Inert className={iconButton}>
          <Icon name="ellipsis-vertical" className="size-4!" />
        </Inert>
        {ticket.status === "open" && (
          <Button variant="outline" size="sm" className="font-medium text-gray-800" onClick={() => closeTickets([ticket.id])}>
            <Icon name="check" className="size-4" />
            Close
          </Button>
        )}
      </div>
      <AssignDialog ticketIds={[ticket.id]} open={assigning} onOpenChange={setAssigning} />
    </div>
  );
}

/** The collapsible "#number" row with the two system ticket fields (common.systemTicketFields). */
function TicketFields({ ticket }: { ticket: Ticket }) {
  const closed = ticket.status === "closed";
  const lockedHint = "Sales fields cannot be updated after a ticket is closed";
  return (
    <Collapsible.Root defaultOpen className="flex flex-col shrink-0 border-b border-gray-200">
      <Collapsible.Trigger className="group text-sm flex w-full gap-2 items-center justify-between px-4 h-[32px] shrink-0 hover:bg-gray-100 focus-visible:outline-1 focus-visible:outline-gray-300">
        <div className="flex items-center gap-2">
          <Icon name="ticket" variant="fal" className="size-4.5! text-gray-400" />
          <span className="font-medium text-[12px] text-gray-800 text-left">#{ticket.number}</span>
        </div>
        <Icon
          name="caret-down"
          variant="fas"
          className="size-3! text-gray-400 transition-transform duration-300 group-data-[state=closed]:-rotate-90"
        />
      </Collapsible.Trigger>
      <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down @container px-4 pb-1 max-h-[240px] overflow-y-auto">
        <div className="grid grid-cols-1 @[640px]:grid-cols-2 gap-x-6 gap-y-1">
          <div className="flex gap-2 py-0.5 items-center">
            <label htmlFor={`conversion-${ticket.id}`} className="w-[120px] shrink-0 text-gray-500 text-[12px] truncate">
              Conversion value
            </label>
            <div className="flex-1 min-w-0" title={closed ? lockedHint : undefined}>
              <Input
                id={`conversion-${ticket.id}`}
                key={ticket.id}
                type="text"
                inputMode="decimal"
                placeholder="Empty"
                disabled={closed}
                defaultValue={ticket.conversionValue}
                onBlur={(e) => setConversionValue(ticket.id, e.target.value.trim())}
                className="h-7 min-w-0 truncate border-transparent px-2 text-[12px] hover:border-gray-200"
              />
            </div>
          </div>
          <div className="flex gap-2 py-0.5 items-center">
            <span className="w-[120px] shrink-0 text-gray-500 text-[12px] truncate">Converted</span>
            <div className="flex-1 min-w-0">
              <Inert className="flex h-7 w-full min-w-0 items-center justify-between rounded-lg border border-transparent px-2 text-[12px] hover:border-gray-200">
                <span className="min-w-0 flex-1 truncate text-left text-gray-400">Select</span>
              </Inert>
            </div>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

/** Message list: "Today" separator, ticket lines between rules, bubbles grouped by sender. */
function Thread({ messages }: { messages: Message[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages]);
  return (
    <div ref={scroller} className="flex-[63.087_1_0px] min-h-0 overflow-y-auto bg-white">
      <div className="pt-[21px] pb-2">
        <Separator>Today</Separator>
        {messages.map((m, i) => {
          const next = messages[i + 1];
          const lastOfRun = !next || next.from !== m.from;
          if (m.from === "ticket") return <Separator key={m.id} ruled>{m.text}</Separator>;
          if (m.from === "system")
            return (
              <p key={m.id} className="mx-auto my-[.875rem] text-center text-sm text-gray-400 whitespace-pre-wrap">
                {m.text}
              </p>
            );
          return <Bubble key={m.id} message={m} showTime={lastOfRun} />;
        })}
      </div>
    </div>
  );
}

function Separator({ ruled, children }: { ruled?: boolean; children: string }) {
  const rule = ruled ? "before:bg-gray-200 after:bg-gray-200" : "before:bg-transparent after:bg-transparent";
  return (
    <div
      className={cn(
        "flex items-center justify-between text-center text-gray-400 text-sm ml-4 mr-2 mb-[1.2em] [&:not(:first-child)]:mt-[1.2em]",
        "before:content-[''] before:block before:h-px before:grow before:mr-[1em] after:content-[''] after:block after:h-px after:grow after:ml-[1em]",
        rule,
      )}
    >
      <span className={cn("select-none", !ruled && "h-4 leading-4")}>{children}</span>
    </div>
  );
}

function Bubble({ message, showTime }: { message: Message; showTime: boolean }) {
  const incoming = message.from === "contact";
  const comment = message.from === "comment";
  return (
    <div className={cn("flex items-end py-0.5", showTime && "mb-3")}>
      <section className={cn("flex flex-1 group max-w-[85%]", incoming ? "mr-auto" : "ml-auto justify-end")}>
        <div className={cn("flex w-full", incoming ? "flex-row" : "flex-row-reverse")}>
          <div
            className={cn(
              "rounded-lg px-3 py-[0.4375rem] font-[family-name:Helvetica_Neue,Segoe_UI,Helvetica,Arial,sans-serif] text-[1rem] leading-[1.5] max-w-[535px] whitespace-pre-wrap break-words",
              incoming && "bg-gray-100 text-black ml-2",
              message.from === "agent" && "bg-electric-green-50 text-electric-green-700 mr-2",
              comment && "bg-yellow-50 text-yellow-700 mr-2",
            )}
          >
            {comment && <p className="text-xs font-medium text-yellow-600 mb-0.5">Internal comment</p>}
            {message.text}
          </div>
          <div
            className={cn(
              "flex flex-col shrink-0 justify-end w-fit min-w-[34px] text-gray-400 text-[.75rem] leading-[1.33333]",
              incoming ? "ml-[.4rem] text-left" : "mr-[.4rem] text-right",
            )}
          >
            {showTime && <p className="select-none hover:text-gray-600 mb-0.5">{message.time}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

type Mode = "reply" | "comment";
const modes: Record<Mode, { label: string; icon: IconName; key: string }> = {
  reply: { label: "Reply", icon: "message-dots", key: "R" },
  comment: { label: "Comment", icon: "message", key: "C" },
};

/** Reply / Comment composer (chats.composer.*). Enter sends, Shift+Enter breaks the line. */
function Composer({ ticketId }: { ticketId: string }) {
  const [mode, setMode] = useState<Mode>("reply");
  const [text, setText] = useState("");
  const comment = mode === "comment";
  const send = () => {
    if (!text.trim()) return;
    postMessage(ticketId, text.trim(), mode);
    setText("");
  };
  const tool = (icon: IconName, label: string, variant: "fal" | "fak" = "fal") => (
    <Inert aria-label={label} className={cn(iconButton, "size-9")}>
      <Icon
        name={icon}
        variant={variant}
        className={variant === "fak" ? "size-4.5! ai-gradient-icon" : "size-4! text-gray-600 group-hover:text-gray-800"}
      />
    </Inert>
  );

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className={cn("px-4 pt-3", comment && "px-3")}>
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex items-center gap-1.5 rounded-sm px-1.5 py-0.5 text-sm font-medium outline-hidden",
              comment ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            <Icon name={modes[mode].icon} variant="fal" className="size-3.5!" />
            <span>{modes[mode].label}</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-48 p-1" onCloseAutoFocus={(e) => e.preventDefault()}>
            {(Object.keys(modes) as Mode[]).map((m) => (
              <DropdownMenuItem key={m} onSelect={() => setMode(m)}>
                <Icon name={modes[m].icon} className="size-4! text-gray-700" />
                <span>{modes[m].label}</span>
                <Kbd className="ml-auto">{modes[m].key}</Kbd>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn("flex-1 w-full relative flex flex-col min-h-0 gap-2", comment ? "pt-0 px-3" : "pt-4")}>
        <textarea
          aria-label={modes[mode].label}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              send();
            }
          }}
          placeholder={comment ? "Leave an internal comment..." : "Type a message or press ⌘K for shortcuts"}
          className={cn(
            "w-full flex-1 min-h-0 resize-none text-[13px] outline-hidden placeholder:text-gray-400 bg-white",
            comment ? "min-h-[72px] p-2 text-yellow-600" : "px-4",
          )}
        />
      </div>
      <div className="flex w-full flex-row justify-between py-2 border-t border-gray-200 px-4 bg-white">
        <div className="flex items-center gap-1">
          {!comment && (
            <>
              {tool("bolt", "Actions")}
              <div className="mx-1 h-5 w-px bg-gray-200" />
              {tool("ai-symbol", "AI Agent", "fak")}
            </>
          )}
          {tool("paperclip", "Attach a file")}
          {tool("face-smile", "Insert emoji")}
        </div>
        <Button variant="ghost" disabled={!text.trim()} onClick={send} className="text-gray-800 disabled:text-gray-500">
          {comment ? "Add comment" : "Send"}
        </Button>
      </div>
    </div>
  );
}

/** Overlay on the composer of a closed ticket (chats.conversation.closedTicket). */
function ClosedState({ ticketId }: { ticketId: string }) {
  return (
    <div className="backdrop-blur-xs bg-white/50 absolute left-0 top-0.5 w-full h-full z-20 flex flex-col gap-4 items-center justify-center">
      <Icon name="ticket" variant="fal" className="size-6! text-gray-400" />
      <p className="text-gray-600 text-sm">This ticket is closed.</p>
      <div className="flex flex-col gap-2 items-stretch">
        <Button variant="outline" className="font-semibold" onClick={() => reopenTicket(ticketId)}>
          Reopen ticket
        </Button>
        <Inert className={cn(buttonClass("default"), "font-semibold")}>Create new ticket</Inert>
        <Inert className={cn(buttonClass("ghost"), "font-semibold")}>View conversation history</Inert>
      </div>
    </div>
  );
}
