import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { SheetContent } from "@/components/ui/sheet";
import { Icon, type IconName } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import type { ScenarioHandling } from "./fixtures";
import { handlingLabel, stamp } from "./format";
import { FormCard, IntegrationPicker, RadioCard, Rich, SheetFooter } from "./parts";

type Template = {
  id: string;
  icon: IconName;
  title: string;
  description: string;
  form: { name: string; trigger: string; handling: ScenarioHandling; instruction?: string };
};

// ai.scenarioTraining.templates.*, verbatim. The complaint template has no reply steps in the
// catalog: it hands the ticket to a person ("requires human interaction").
const templates: Template[] = [
  {
    id: "checkOrderStatus",
    icon: "truck",
    title: "Check order status",
    description: "Use this scenario when a customer asks a question about the status of their order.",
    form: {
      name: "Check order status",
      trigger:
        "You said:\nWhen a customer asks about the status of their order, delivery progress, tracking information, or expected arrival date.\n\nE.g., “Where is my order?”, “Has my package shipped?”, “I want to track my order.”",
      handling: "follow_instruction",
      instruction:
        "## 1. Greet the customer politely\n\nAcknowledge their question and thank them for reaching out.\n\n## 2. Acknowledge their question and thank them for reaching out\n\nPrompt the customer to provide their order number or relevant tracking details, if not already given.\n\n## **3. Check order status**\n\nUse the provided order number to look up the order in the system. Retrieve the current status (e.g., shipped, out for delivery, delivered, delayed).\n\n## 4. Share the status clearly\n\nRespond with a friendly summary of the order status. Include key details like estimated delivery time, tracking link, or delay reason if applicable.\n\n## 5. Offer further help\n\nAsk if there’s anything else the customer needs help with before ending the conversation.",
    },
  },
  {
    id: "returnOrRefund",
    icon: "hand-holding-box",
    title: "Return or refund",
    description: "Use this scenario when a customer requests a return or a refund for their order.",
    form: {
      name: "Return or refund",
      trigger:
        "Use this scenario when a customer asks about returning a product or getting a refund for their order.\n\nE.g., “I want to return my order”, “How do I get a refund?”, “Refund request”, “Send back my purchase”",
      handling: "follow_instruction",
      instruction:
        "## 1. Greet the customer politely\n\nStart with a friendly greeting to acknowledge their message.\n\n## 2. Request relevant order information\n\nAsk for the order number and product they wish to return.\n\n## 3. Check if the item qualifies for a return/refund\n\nUse return policy rules (e.g., within 30 days, unused, original packaging).\n\n## 4. Provide clear return/refund instructions\n\nShare next steps: where to send the item, how refunds are processed, or provide a return label.\n\n## 5. Confirm once done\n\nLet the customer know you’ve submitted their request or what to expect next.",
    },
  },
  {
    id: "customerComplaint",
    icon: "user-headset",
    title: "Customer complaint",
    description: "Use this scenario when a customer lodges a complaint that requires human interaction",
    form: {
      name: "Customer complaint",
      trigger:
        "Use this scenario when a customer expresses dissatisfaction, frustration, or issues with a product, service, or experience.\nE.g., “I’m not happy with this”, “This doesn’t work”, “I want to make a complaint”, “Terrible service”, “I’m upset about my order”",
      handling: "escalate_to_human_agent",
    },
  },
];

const scratch: Template["form"] = { name: "", trigger: "", handling: "follow_instruction" };

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

function ChoiceCard({ icon, title, description, onClick, plain }: { icon: IconName; title: string; description: string; onClick: () => void; plain?: boolean }) {
  return (
    <button type="button" className={card} onClick={onClick}>
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

const toolbar: { icon: IconName; label: string; menu?: boolean }[][] = [
  [
    { icon: "rotate-left", label: "Undo" },
    { icon: "rotate-right", label: "Redo" },
  ],
  [
    { icon: "heading", label: "Heading", menu: true },
    { icon: "list-ul", label: "List", menu: true },
    { icon: "block-quote", label: "Blockquote" },
    { icon: "square-code", label: "Code Block" },
    { icon: "table", label: "Table", menu: true },
  ],
  [
    { icon: "bold", label: "Bold" },
    { icon: "italic", label: "Italic" },
    { icon: "strikethrough", label: "Strikethrough" },
    { icon: "code", label: "Code" },
    { icon: "underline", label: "Underline" },
    { icon: "link", label: "Link" },
  ],
];

const editor =
  "min-h-[200px] w-full px-4 py-3 text-sm text-gray-800 focus:outline-none [&_h2]:my-2 [&_h2]:text-lg [&_h2]:font-bold [&_p]:my-2 [&>*:first-child]:mt-0! [&>*:last-child]:mb-0!";

function StepsEditor({ markdown }: { markdown?: string }) {
  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white">
      {/* Formatting controls render as captured; the demo editor is plain contenteditable. */}
      <div className="flex shrink-0 items-center gap-0.5 border-b border-gray-200 px-2 py-1">
        {toolbar.map((group, g) => (
          <div key={g} className="contents">
            {g > 0 && <div className="mx-1 h-5 w-px bg-gray-200" />}
            {group.map((b) => (
              <Inert key={b.label} aria-label={b.label} className={cn(buttonClass("ghost", "icon"), "text-gray-700", b.menu && "gap-x-0.5 pl-2 pr-1")}>
                <Icon name={b.icon} variant="fal" className="size-3.5" />
                {b.menu && <Icon name="caret-down" className="size-2! text-gray-600" />}
              </Inert>
            ))}
          </div>
        ))}
      </div>
      <div className="min-h-0 flex-auto overflow-y-auto">
        <div role="textbox" aria-multiline="true" aria-label="Reply steps" contentEditable suppressContentEditableWarning className={editor}>
          {markdown ? <Steps markdown={markdown} /> : <p />}
        </div>
      </div>
    </div>
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
      <form className="space-y-6" onSubmit={submit}>
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
              <StepsEditor markdown={start.instruction} />
            </div>
          </div>
          {handling === "escalate_to_human_agent" && (
            <p className="text-gray-500">The AI Agent will send a message informing the customer that their ticket is being escalated to a human agent.</p>
          )}
        </FormCard>

        <SheetFooter onCancel={onDone} submitLabel="Create scenario" disabled={!ready} />
      </form>
    </section>
  );
}
