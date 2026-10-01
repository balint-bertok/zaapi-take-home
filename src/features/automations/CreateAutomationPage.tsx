import { useState, type ReactNode } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Inert } from "@/components/Inert";
import { Button } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { Breadcrumb } from "@/shell/Breadcrumb";
import { updateDemo, useDemo } from "@/store/store";
import type { Automation } from "./fixtures";
import { automationSettings, listPath, today } from "./basic/automation";
import { ConfirmDialog } from "./basic/ConfirmDialog";
import { Avatar, Checkbox, RadioCards } from "./basic/controls";

// Texts verbatim from the catalog (automations.*, common.general.*), markup from the saved create page.
const outsideHoursOptions = [
  {
    value: "stop",
    title: "Stop assignment outside of working hours",
    description:
      "If no agent is available, the system stops assignments, and all tickets received outside working hours will remain unassigned.",
  },
  {
    value: "continue",
    title: "Continue assigning outside working hours",
    description:
      "If no agent is available, tickets will be assigned to the next available agent to ensure none are left unassigned. (Note: Assignment logic doesn’t impact agent performance; only messages sent during business hours count in analytics)",
  },
] as const;
const preferenceOptions = [
  {
    value: "prioritize_last_assigned",
    title: "Prioritize Last Assigned Agent",
    description:
      "Assign to the last agent who handled the ticket if they're within working hours and selected below. Otherwise, use round robin.",
  },
  { value: "round_robin_only", title: "Use Round Robin Only", description: "Always assign tickets using round robin." },
] as const;
const assignToOptions = [
  { value: "individualUsers", title: "Individual users" },
  { value: "team", title: "Team (you have no team yet)", disabled: true },
] as const;

const input =
  "text-sm border-gray-200 focus:border-gray-300 focus:outline-hidden h-full w-full border bg-white px-4 py-4 outline-[0.5px] selection:bg-gray-100 placeholder-gray-300 placeholder:font-normal rounded-lg";

function Card({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-lg p-4 bg-white border border-gray-100 flex flex-col gap-y-4 z-10", className)}>
      <h2 className="font-medium text-gray-800 text-lg">{title}</h2>
      {children}
    </div>
  );
}

function TextField(props: { label: string; placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="font-medium leading-5 text-gray-800">{props.label}</span>
      <div className="mt-[0.550rem] h-10 relative flex w-full flex-row items-center justify-center">
        <input
          className={input}
          placeholder={props.placeholder}
          type="text"
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    </label>
  );
}

const toggle = (ids: string[], id: string, on: boolean) => (on ? [...ids, id] : ids.filter((x) => x !== id));

/** /automations/basic-automations/create?type=chatAssignment, also the edit form with `&id=`. */
export default function CreateAutomationPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const existing = useDemo((s) => s.automations.find((a) => a.id === params.get("id")));
  const user = useDemo((s) => s.user);
  // The chat widget accounts are the only integrations the demo workspace has.
  const integrations = useDemo((s) => s.integrations);
  const widgets = integrations.filter((i) => i.channel === "chat-widget");

  const [form, setForm] = useState(() => automationSettings(existing));
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }));
  const [expanded, setExpanded] = useState(false);
  const [activating, setActivating] = useState(false);

  const selected = form.integrationIds.length;
  const allWidgets = widgets.length > 0 && widgets.every((w) => form.integrationIds.includes(w.id));
  const setAllWidgets = (on: boolean) => set("integrationIds", on ? widgets.map((w) => w.id) : []);
  const userSelected = form.assigneeIds.includes(user.id);
  const valid = selected > 0 && form.assigneeIds.length > 0 && form.name.trim() !== "";
  const fields = { ...form, name: form.name.trim(), description: form.description.trim() || undefined };

  const create = (enabled: boolean) => {
    const automation: Automation = {
      id: crypto.randomUUID(),
      type: "assign-to-agents",
      enabled,
      createdBy: user.name,
      updatedBy: null,
      updatedAt: today(),
      ...fields,
    };
    updateDemo((s) => ({ ...s, automations: [...s.automations, automation] }));
    toast.success("Successfully created automation");
    navigate(listPath);
  };

  const submit = () => {
    if (!existing) return setActivating(true);
    updateDemo((s) => ({
      ...s,
      automations: s.automations.map((a) =>
        a.id === existing.id ? { ...a, ...fields, updatedBy: user.name, updatedAt: today() } : a,
      ),
    }));
    toast.success("Successfully Updated");
    navigate(listPath);
  };

  return (
    <div className="bg-(--content-area-background) md:px-10 overscroll-x-none h-(--height-page-content-with-banner) px-0 overflow-hidden">
      <div className="mx-auto flex flex-col h-full">
        <div className="w-full mx-auto px-4 md:px-0 max-w-[700px] pt-7">
          <Breadcrumb
            trail={[
              { label: "Automations", to: listPath },
              { label: "Basic Automations", to: listPath },
              { label: "Create automation" },
            ]}
          />
        </div>
        <div className="flex-1 mt-3 overflow-y-auto pb-4">
          <main className="px-4 md:px-0 max-w-[700px] mx-auto w-full">
            <h1 className="text-2xl font-semibold mb-8">Assign to agents</h1>
            <div className="flex flex-col gap-y-6 relative before:content-[''] before:absolute before:bg-gray-300 before:left-12 before:top-0 before:h-full before:w-0.5">
              <Card title="Where would you like to use this automation?">
                <div>
                  <p className="font-medium text-gray-800 text-sm">Integrations</p>
                  <div className="flex items-center justify-between mb-4 mt-2">
                    <p className="text-gray-800 text-sm">
                      {selected} {selected === 1 ? "Integration" : "Integrations"} Selected
                    </p>
                    <Checkbox label="Integrations" checked={allWidgets} onCheckedChange={setAllWidgets} />
                  </div>
                  <div className="flex items-start justify-between gap-x-2">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setExpanded(!expanded)}
                      className="flex flex-1 gap-x-2 items-center justify-start pb-4 text-sm font-medium transition-all hover:underline"
                    >
                      <Icon
                        name="chevron-right"
                        variant="fas"
                        className={cn("h-4 w-4 text-gray-400 transition-transform duration-200", expanded && "rotate-90")}
                      />
                      <span className="flex space-x-3 items-center min-w-0">
                        <span className="flex items-center justify-center shrink-0 size-[20px]">
                          <img alt="widget icon" src={asset("images/channels/chat-widget.svg")} className="size-[22px] max-w-none" />
                        </span>
                        <span className="text-gray-800 text-sm font-normal text-start truncate">Chat Widget</span>
                      </span>
                    </button>
                    <Checkbox label="Chat Widget" checked={allWidgets} onCheckedChange={setAllWidgets} />
                  </div>
                  {expanded && (
                    <ul className="flex flex-col gap-y-2 pb-4 pl-14 text-sm text-gray-800">
                      {widgets.map((w) => (
                        <li key={w.id} className="flex items-center justify-between h-8">
                          <span className="truncate">{w.name}</span>
                          <Checkbox
                            label={w.name}
                            checked={form.integrationIds.includes(w.id)}
                            onCheckedChange={(on) => set("integrationIds", toggle(form.integrationIds, w.id, on))}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>

              <Card title="When this happens" className="gap-y-2">
                <p className="text-gray-500 text-sm">When an unassigned ticket receives a new message.</p>
              </Card>

              <Card title="Take this action">
                <p className="text-gray-500 text-sm">
                  Assign to members based on round-robin logic within their working hours.{" "}
                  {/* Leads to Settings > Team Management, which was not captured. */}
                  <Inert className="underline">Set up agent working hours.</Inert>
                </p>
                <div className="bg-gray-100 border-l-[3px] border-gray-600 flex gap-x-2 px-4 py-2.5 rounded-md">
                  <Icon name="lightbulb-on" variant="far" className="h-4 min-w-4 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-600 text-sm">How Zaapi's Round Robin assignment logic works</p>
                    <p className="text-gray-500 text-sm">
                      For example, with 3 agents, the first ticket goes to Agent A, the second to Agent B, the third to
                      Agent C, and the fourth returns to Agent A, repeating this pattern.
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium mb-3">Assignment logic for tickets outside agents' working hours</div>
                  <RadioCards
                    label="Assignment logic for tickets outside agents' working hours"
                    className="mb-2"
                    value={form.outsideHours}
                    onChange={(v) => set("outsideHours", v)}
                    options={[...outsideHoursOptions]}
                  />
                </div>
                <div className="mt-2">
                  <div className="text-sm font-medium mb-3">Assignment preference</div>
                  <RadioCards
                    label="Assignment preference"
                    className="mb-2"
                    value={form.preference}
                    onChange={(v) => set("preference", v)}
                    options={[...preferenceOptions]}
                  />
                </div>
                <div>
                  <div className="text-sm font-medium mb-3">Assign to</div>
                  {/* The workspace has no team, so "Team" stays disabled, as captured. */}
                  <RadioCards label="Assign to" value="individualUsers" onChange={() => {}} options={[...assignToOptions]} />
                </div>
                <div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="leading-5 text-gray-800 text-sm">{form.assigneeIds.length} agent selected</p>
                    <Checkbox
                      label="All agents"
                      checked={userSelected}
                      onCheckedChange={(on) => set("assigneeIds", on ? [user.id] : [])}
                    />
                  </div>
                  <div className="border border-gray-100 my-2" />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-x-2 items-center h-8 min-w-0">
                      <Avatar name={user.name} />
                      <span className="text-sm leading-4 text-gray-800 truncate">{user.name}</span>
                      <Icon name="clock" variant="far" className="min-w-4 h-4 text-gray-400" />
                    </div>
                    <Checkbox
                      label={user.name}
                      checked={userSelected}
                      onCheckedChange={(on) => set("assigneeIds", toggle(form.assigneeIds, user.id, on))}
                    />
                  </div>
                </div>
              </Card>

              <Card title="Automation settings" className="text-sm">
                <TextField
                  label="Automation name"
                  placeholder="Enter automation name"
                  value={form.name}
                  onChange={(v) => set("name", v)}
                />
                <TextField
                  label="Automation description (optional)"
                  placeholder="Enter automation description"
                  value={form.description}
                  onChange={(v) => set("description", v)}
                />
              </Card>
            </div>
          </main>
        </div>
        <div className="flex items-center justify-between bg-white border-t border-x rounded-t border-gray-100 py-3 px-4 mx-auto w-full max-w-[700px]">
          <p className="text-sm text-gray-500">
            Learn more about how to <Inert className="underline">create automations</Inert>
          </p>
          <div className="flex gap-x-3">
            <Button variant="outline" onClick={() => navigate(listPath)}>
              Cancel
            </Button>
            <Button disabled={!valid} onClick={submit}>
              {existing ? "Save changes" : "Create automation"}
            </Button>
          </div>
        </div>
      </div>
      <ConfirmDialog
        open={activating}
        onOpenChange={setActivating}
        title="Do you want to activate this automation?"
        description="This automation will be enabled immediately after creation if you activate it. Do you want to activate it now or save it without activating?"
        secondary="Save without activating"
        onSecondary={() => create(false)}
        primary="Activate now"
        onPrimary={() => create(true)}
      />
    </div>
  );
}
