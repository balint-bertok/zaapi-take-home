import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Input, Textarea } from "@/components/ui/input";
import { SheetContent } from "@/components/ui/sheet";
import { Icon, type IconName } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import type { ScenarioHandling } from "./fixtures";
import { handlingLabel, stamp } from "./format";
import { FormCard, IntegrationPicker, RadioCard, Rich, RichTextEditor, SheetFooter } from "./parts";
import { scratch, templates, type Template } from "./scenarioTemplates";

/** "Add scenario" sheet (Step 10 (2) to (4)): pick scratch or a template, then fill the form. */
export function AddScenarioSheet({ onDone }: { onDone: () => void }) {
  return (
    <SheetContent title="Add scenario">
      <ScenarioFlow onDone={onDone} />
    </SheetContent>
  );
}

function ScenarioFlow({ onDone }: { onDone: () => void }) {
  const [start, setStart] = useState<Template["form"] | null>(null);
  return start ? <ScenarioForm start={start} onDone={onDone} /> : <Chooser onPick={setStart} />;
}

const card =
  "relative transition-all disabled:opacity-80 flex flex-col gap-4 p-4 rounded-lg border border-gray-200 disabled:pointer-events-none hover:border-electric-green-500 hover:ring-[3px] hover:ring-electric-green-500/20";

/** A start option. With `checked` set (the guided setup's scenario step) it is a toggle that keeps the hover ring while selected. */
export function ChoiceCard({
  icon,
  title,
  description,
  onClick,
  plain,
  checked,
}: {
  icon: IconName;
  title: string;
  description: string;
  onClick: () => void;
  plain?: boolean;
  checked?: boolean;
}) {
  const toggle = checked !== undefined;
  return (
    <button
      type="button"
      role={toggle ? "checkbox" : undefined}
      aria-checked={checked}
      className={cn(card, checked && "border-electric-green-500 ring-[3px] ring-electric-green-500/20")}
      onClick={onClick}
    >
      {checked && <Icon name="check" className="absolute top-3 right-3 size-3.5! text-electric-green-600" />}
      <div className={cn("size-20 flex items-center rounded-lg justify-center", plain ? "bg-gray-50" : "bg-(image:--color-ai-gradient-light)")}>
        <Icon name={icon} variant="fas" className={cn("size-7!", plain ? "text-gray-500" : "ai-gradient-icon")} />
      </div>
      <div className="text-left text-sm">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <p className="text-gray-400 font-normal mt-1 text-sm">{description}</p>
      </div>
    </button>
  );
}

function Chooser({ onPick }: { onPick: (form: Template["form"]) => void }) {
  return (
    <div className="grow px-6 py-5 space-y-7 overflow-auto">
      <div className="space-y-4 p-4 rounded-lg bg-white">
        <h2 className="text-base font-medium">Create from scratch</h2>
        <div className="grid grid-cols-3 gap-4">
          <ChoiceCard plain icon="pencil" title="Manual entry" description="Manually create a unique scenario tailored to your use case." onClick={() => onPick(scratch)} />
        </div>
      </div>
      <div className="space-y-4 p-4 rounded-lg bg-white">
        <h2 className="text-base font-medium">Select from templates</h2>
        <div className="grid grid-cols-3 gap-4">
          {templates.map((t) => (
            <ChoiceCard key={t.id} icon={t.icon} title={t.title} description={t.description} onClick={() => onPick(t.form)} />
          ))}
        </div>
      </div>
    </div>
  );
}

/** The template's markdown steps as the rich-text editor shows them: "## " lines are headings. */
function Steps({ markdown }: { markdown: string }) {
  return markdown.split("\n\n").map((block, i) =>
    block.startsWith("## ") ? <h2 key={i}>{block.slice(3).replace(/\*\*/g, "")}</h2> : <p key={i}>{block}</p>,
  );
}

function ScenarioForm({ start, onDone }: { start: Template["form"]; onDone: () => void }) {
  const user = useDemo((s) => s.user);
  const [name, setName] = useState(start.name);
  const [trigger, setTrigger] = useState(start.trigger);
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [handling, setHandling] = useState<ScenarioHandling>(start.handling);
  const ready = name.trim() !== "" && trigger.trim() !== "";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    const now = stamp();
    updateDemo((s) => ({
      ...s,
      scenarios: [
        ...s.scenarios,
        { id: crypto.randomUUID(), name: name.trim(), enabled: true, handling, integrations, createdBy: user.name, createdAt: now },
      ],
    }));
    toast.success("Scenario successfully created");
    onDone();
  }

  return (
    <section className="flex flex-col gap-5 bg-gray-50 overflow-auto p-6 text-sm">
      <form className="space-y-5" onSubmit={submit}>
        {/* The cards keep their wider spacing; the footer keeps the section's gap, as in the live sheet. */}
        <div className="space-y-6">
          <FormCard className="space-y-2">
            <h3 className="text-base font-medium text-gray-800">Scenario name</h3>
            <p className="text-gray-500 whitespace-pre-line">Create a short, clear name to organize this scenario.</p>
            <Input
              aria-label="Scenario name"
              className="rounded-md"
              maxLength={255}
              placeholder="For your reference only—AI agent won’t read this."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormCard>

          <FormCard className="space-y-2">
            <h3 className="text-base font-medium text-gray-800">When this scenario should trigger</h3>
            <p className="text-gray-500 whitespace-pre-line">
              <Rich
                bold="font-medium"
                text={
                  "Describe the scenario when this scenario should trigger so the AI agent can recognize it and respond properly. Think about what the customer might say or need help with.\n\n<b>Examples</b>: ‘If a customer asks about delivery status.’"
                }
              />
            </p>
            <Textarea
              aria-label="When this scenario should trigger"
              maxLength={500}
              placeholder="For AI agent to identify this scenario."
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
            />
          </FormCard>

          <FormCard className="space-y-3">
            <div className="space-y-1">
              <label className="text-base font-medium text-gray-800 mb-2">Where should this scenario run?</label>
              <p className="text-gray-500 whitespace-pre-line">
                Select the integrations where this scenario will be active. AI only replies to unassigned tickets from selected integrations. It won’t respond if a human agent is
                already assigned.
              </p>
            </div>
            <IntegrationPicker value={integrations} onChange={setIntegrations} />
          </FormCard>

          <FormCard className="space-y-4">
            <div>
              <h3 className="text-base font-medium text-gray-800">How should AI respond?</h3>
              <p className="text-gray-500 whitespace-pre-line mt-1">Choose how AI should handle the customer intent.</p>
              <div role="radiogroup" aria-label="How should AI respond?" className="flex gap-4 mt-3">
                {(Object.keys(handlingLabel) as ScenarioHandling[]).map((h) => (
                  <RadioCard key={h} checked={handling === h} onSelect={() => setHandling(h)}>
                    {handlingLabel[h]}
                  </RadioCard>
                ))}
              </div>
            </div>
            {/* Hidden rather than unmounted, so edits to the steps survive switching to Escalate and back. */}
            <div hidden={handling !== "follow_instruction"}>
              <div className="space-y-1">
                <h4 className="font-medium text-gray-800">Describe reply steps the AI should take</h4>
                <p className="whitespace-pre-line text-gray-500">
                  <Rich
                    bold="font-medium"
                    text="<b>Tip</b>: organize the text using proper headings (like H1, H2) and paragraphs into a step-by-step format like 1, 2, 3 for clarity."
                  />
                </p>
              </div>
              <div className="mt-4">
                <RichTextEditor label="Reply steps">{start.instruction ? <Steps markdown={start.instruction} /> : undefined}</RichTextEditor>
              </div>
            </div>
            {handling === "escalate_to_human_agent" && (
              <p className="text-gray-500">The AI Agent will send a message informing the customer that their ticket is being escalated to a human agent.</p>
            )}
          </FormCard>
        </div>
        <SheetFooter onCancel={onDone} submitLabel="Create scenario" disabled={!ready} />
      </form>
    </section>
  );
}
