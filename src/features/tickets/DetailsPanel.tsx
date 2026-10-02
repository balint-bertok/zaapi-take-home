import * as Collapsible from "@radix-ui/react-collapsible";
import { useEffect, useState, type ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip } from "@/components/ui/tooltip";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { setContactField } from "./actions";
import { ContactAvatar } from "./avatars";
import type { ContactFieldKey, Ticket } from "./fixtures";
import { iconButton } from "./styles";

// Contact field labels from the catalog (the Thai capture shows the same fields, machine-translated).
const contactFields: { key: ContactFieldKey; label: string; multiline?: boolean }[] = [
  { key: "firstName", label: "First Name" },
  { key: "lastName", label: "Last Name" },
  { key: "phone", label: "Phone Number" },
  { key: "email", label: "Email" },
  { key: "secondaryPhone", label: "Secondary phone numbers" },
  { key: "secondaryEmail", label: "Secondary emails" },
  { key: "shipping", label: "Shipping Details", multiline: true },
  { key: "note", label: "Note", multiline: true },
];

const valueClass = "min-w-0 rounded-lg border-transparent px-2 text-[12px] hover:border-gray-200";

/** The 320px right-hand panel: contact, linked conversations, labels, ticket history, location, activity. */
export function DetailsPanel({ ticket }: { ticket: Ticket }) {
  const account = useDemo((s) => s.integrations.find((i) => i.id === ticket.integrationId)?.name ?? "");
  const tab = "flex items-center text-sm justify-center border-transparent p-2.5 rounded-md focus-visible:outline-gray-300";
  return (
    <aside aria-label="Contact" className="flex w-[320px] shrink-0 min-w-0 flex-col overflow-hidden border-l border-gray-200 bg-white">
      <div className="flex gap-3 items-center p-3 border-b border-gray-200">
        <button type="button" aria-label="Zaapi Contact Information" aria-pressed="true" className={cn(tab, "bg-gray-200")}>
          <Icon name="user" variant="fas" className="size-6! text-gray-600" />
        </button>
        <Inert className={cn(tab, "hover:bg-gray-50")} aria-label="Notes">
          <Icon name="note-sticky" variant="fal" className="size-6! text-gray-500" />
        </Inert>
        <Inert className={cn(tab, "hover:bg-gray-50")} aria-label="Workflows">
          <Icon name="sitemap" variant="fal" className="size-6! text-gray-500 -rotate-90" />
        </Inert>
      </div>
      <div className="w-full min-w-0 flex-1 divide-y divide-gray-200 overflow-x-hidden overflow-y-auto border-b border-gray-200 bg-white text-sm">
        <Section title="Zaapi Contact Information">
          <div className="min-w-0 space-y-3 px-4 pt-0.5 pb-4">
            <div className="flex w-full min-w-0 flex-col gap-y-3">
              {contactFields.map((f) => (
                <ContactField key={`${ticket.id}-${f.key}`} ticket={ticket} field={f} />
              ))}
              {/* Empty group present in the saved markup; it sets the gap above the buttons. */}
              <div />
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <Inert className={buttonClass("outline", "sm")}>
                <Icon name="sliders" className="size-4!" />
                Edit fields
              </Inert>
              <Inert className={buttonClass("outline", "sm")}>
                <Icon name="user" variant="far" className="size-4!" />
                View contact
              </Inert>
            </div>
          </div>
        </Section>

        <Section
          title="Linked Conversations"
          info="These conversations belong to the same contact."
          action={
            <Inert aria-label="Add conversation" className={cn(buttonClass("ghost"), "size-8 p-0")}>
              <Icon name="plus" variant="fal" className="size-4! text-gray-500" />
            </Inert>
          }
        >
          <section className="px-4 pb-4 space-y-3">
            <ul className="space-y-3">
              <li className="flex gap-2 justify-between items-center">
                <div className="flex gap-x-2 items-center min-w-0">
                  <ContactAvatar size={36} />
                  <div className="min-w-0">
                    <div className="flex min-w-0 gap-1.5 items-center">
                      <div className="truncate">{ticket.contactName}</div>
                      <Chip className="bg-gray-100 text-gray-500 text-[10px]">Current</Chip>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{account}</div>
                  </div>
                </div>
                <Inert className={iconButton}>
                  <Icon name="ellipsis-vertical" />
                </Inert>
              </li>
            </ul>
          </section>
        </Section>

        <Section title="Conversation labels">
          <Inert className="bg-white flex w-full items-start gap-x-2 py-2 px-4 min-h-[40px] flex-wrap pt-0">
            <span className="text-gray-400 text-sm select-none mt-1">Add labels</span>
          </Inert>
        </Section>

        <Section title="Ticket History">
          <section className="px-4 pb-4 space-y-3">
            <Tabs defaultValue="conversation" className="flex flex-col gap-2 w-full">
              <TabsList>
                <TabsTrigger value="conversation">This conversation</TabsTrigger>
                <TabsTrigger value="contact">This contact</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex flex-col gap-2">
              <HistoryRow ticket={ticket} />
            </div>
          </section>
        </Section>

        <Section title="Location">
          <div className="space-y-4 px-4 pb-4">
            <div className="flex gap-2 items-center">
              <div className="relative size-[22px] rounded-full overflow-hidden border border-gray-200">
                <img alt="Thai" src={asset("images/TH.svg")} className="absolute inset-0 h-full w-full" />
              </div>
              <span className="text-gray-800">Thailand</span>
            </div>
            <div className="space-y-2">
              <span className="block font-medium text-gray-600">Timezone</span>
              <span className="text-gray-800">Asia/Bangkok</span>
            </div>
          </div>
        </Section>

        <Section title="Website activity">
          <ul className="relative space-y-4 overflow-hidden px-4 pb-4">
            <li className="border border-gray-200 rounded-lg bg-white px-3 py-2 w-full shadow-xs space-y-1.5">
              {/* The captured page is an external URL: shown, never linked (no outbound navigation). */}
              <p className="text-[12px] text-gray-600 block wrap-anywhere">https://demo.zaapi.com/?zcwopen=1</p>
              <div className="text-[11px] text-gray-400">01 Oct 2026, 11:17</div>
              <div className="flex gap-2 items-center">
                <Chip className="bg-gray-100 text-gray-500">Landing page</Chip>
                <Chip className="bg-green-50 text-green-600">Ticket start page</Chip>
              </div>
            </li>
          </ul>
        </Section>
      </div>
    </aside>
  );
}

function Section({
  title,
  info,
  action,
  children,
}: {
  title: string;
  info?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Collapsible.Root defaultOpen className="group/section min-w-0 max-w-full">
      <div className="flex items-center">
        <Collapsible.Trigger className="group text-sm flex w-full flex-1 min-w-0 gap-2 items-center p-4 data-[state=closed]:hover:bg-gray-100 focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-gray-300">
          <span className="font-medium">{title}</span>
          {info && (
            <Tooltip content={info}>
              <span className="flex items-center">
                <Icon name="circle-info" className="size-3.5! text-gray-400" />
              </span>
            </Tooltip>
          )}
          <Icon
            name="caret-down"
            variant="fas"
            className="size-3! text-gray-400 transition-transform duration-300 group-data-[state=closed]:-rotate-90"
          />
        </Collapsible.Trigger>
        {action && <div className="shrink-0 pr-4">{action}</div>}
      </div>
      <Collapsible.Content className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down min-w-0 max-w-full">
        {children}
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function ContactField({ ticket, field }: { ticket: Ticket; field: (typeof contactFields)[number] }) {
  const value = ticket.contact[field.key] ?? "";
  const commit = (v: string) => setContactField(ticket.id, field.key, v.trim());
  return (
    <div className="flex w-full min-w-0 items-start gap-2 text-sm">
      <span className="h-7 w-[40%] max-w-[180px] min-w-0 shrink-0 truncate leading-7 text-gray-500">{field.label}</span>
      <div className="group relative flex min-w-0 flex-1 items-start gap-2 break-words text-gray-700">
        {field.multiline ? (
          <Textarea
            aria-label={field.label}
            placeholder="Empty"
            rows={1}
            defaultValue={value}
            onBlur={(e) => commit(e.target.value)}
            className={cn(valueClass, "text-gray-800 rounded-md min-h-7 resize-none py-1 leading-normal overflow-hidden")}
          />
        ) : (
          <Input
            aria-label={field.label}
            placeholder="Empty"
            type="text"
            defaultValue={value}
            onBlur={(e) => commit(e.target.value)}
            className={cn(valueClass, "text-gray-700 h-7 truncate")}
          />
        )}
        {value && (
          <span className="absolute right-1 z-10 flex items-center gap-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100">
            <button
              type="button"
              aria-label="Copy"
              onClick={() => void navigator.clipboard?.writeText(value).catch(() => {})}
              className={cn(buttonClass("outline"), "size-5 rounded-sm p-0")}
            >
              <Icon name="copy" className="size-3! text-gray-400" />
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

/** One ticket in "Ticket History": number, status ring, "Current", and its running timer. */
function HistoryRow({ ticket }: { ticket: Ticket }) {
  const open = ticket.status === "open";
  const now = useNow(open);
  const elapsed = Math.max(0, Math.floor(((ticket.closedAt ?? now) - ticket.openedAt) / 1000));
  const hms = [Math.floor(elapsed / 3600), Math.floor(elapsed / 60) % 60, elapsed % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
  return (
    <Inert className="w-full text-left border border-gray-200 rounded-lg bg-white px-3 py-2 text-sm space-y-1 hover:bg-gray-50">
      <span className="flex items-center justify-between gap-2">
        <span className="flex min-w-0 flex-1 items-center gap-1.5">
          <span className="min-w-0 truncate font-medium text-gray-800">#{ticket.number}</span>
          {open ? (
            <span className="shrink-0 p-1 flex items-center justify-center rounded-full bg-warning-50">
              <span className="size-3.5 border border-warning-500 border-dashed rounded-full" />
            </span>
          ) : (
            <Icon name="circle-check" variant="fas" className="size-4! text-green-500" />
          )}
          <span className="shrink-0 rounded bg-gray-100 px-1 py-px text-[10px] font-medium text-gray-500">Current</span>
        </span>
        <span className="inline-flex gap-1.5 shrink-0 items-center justify-center text-sm text-gray-500">
          <span className="inline-block text-[12px] tabular-nums mt-px">{hms}</span>
          <Icon name="clock" className="size-4! text-gray-400" />
        </span>
      </span>
    </Inert>
  );
}

function useNow(running: boolean) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [running]);
  return now;
}

function Chip({ className, children }: { className: string; children: ReactNode }) {
  return (
    <span className={cn("w-fit py-0.5 shrink-0 rounded-2xl text-center font-medium text-[12px] px-2", className)}>{children}</span>
  );
}
