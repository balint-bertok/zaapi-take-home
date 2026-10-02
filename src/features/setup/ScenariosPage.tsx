import { useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { FormCard } from "../ai/parts";
import { templates, type Template } from "../ai/scenarioTemplates";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";
import { SkipDialog } from "./SkipDialog";
import type { SetupStep } from "./fixtures";

const withStep = (done: SetupStep[], step: SetupStep) => (done.includes(step) ? done : [...done, step]);

// The "Add scenario" sheet's template card (`ChoiceCard`), as a toggle: selected keeps the hover ring.
const card =
  "relative transition-all flex flex-col gap-4 p-4 rounded-lg border border-gray-200 hover:border-electric-green-500 hover:ring-[3px] hover:ring-electric-green-500/20";

function TemplateCard({ template, checked, onToggle }: { template: Template; checked: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="checkbox" aria-checked={checked} className={cn(card, checked && "border-electric-green-500 ring-[3px] ring-electric-green-500/20")} onClick={onToggle}>
      {checked && <Icon name="check" className="absolute top-3 right-3 size-3.5! text-electric-green-600" />}
      <div className="size-20 flex items-center rounded-lg justify-center bg-(image:--color-ai-gradient-light)">
        <Icon name={template.icon} variant="fas" className="size-7! ai-gradient-icon" />
      </div>
      <div className="text-left text-sm">
        <h4 className="font-medium text-gray-800">{template.title}</h4>
        <p className="text-gray-400 font-normal mt-1 text-sm">{template.description}</p>
      </div>
    </button>
  );
}

/** Step 2: pick the scenario templates the agent should handle. Coming back shows what was picked. */
export default function ScenariosPage() {
  const scenarios = useDemo((s) => s.scenarios);
  const navigate = useNavigate();
  const [picked, setPicked] = useState(() => templates.filter((t) => scenarios.some((s) => s.name === t.form.name)).map((t) => t.id));
  const [skipping, setSkipping] = useState(false);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  function save() {
    const chosen = templates.filter((t) => picked.includes(t.id));
    const dropped = new Set(templates.filter((t) => !picked.includes(t.id)).map((t) => t.form.name));
    const now = stamp();
    updateDemo((s) => ({
      ...s,
      scenarios: [
        // Only rows named after an unpicked template go; scenarios added elsewhere stay.
        ...s.scenarios.filter((r) => !dropped.has(r.name)),
        ...chosen
          .filter((t) => !s.scenarios.some((r) => r.name === t.form.name))
          .map((t) => ({ id: crypto.randomUUID(), name: t.form.name, enabled: true, handling: t.form.handling, integrations: [], createdBy: s.user.name, createdAt: now })),
      ],
      setupDone: withStep(s.setupDone, "scenarios"),
    }));
  }

  function skip() {
    updateDemo((s) => ({ ...s, setupDone: withStep(s.setupDone, "scenarios") }));
    navigate("/ai/setup/knowledge");
  }

  return (
    <SetupPage
      step={2}
      title="Scenarios"
      description="Pick what your agent should handle. Each one comes with ready-made steps you can edit later."
      footer={
        <>
          <div className="flex items-center gap-4">
            <BackLink to="/ai/setup/persona" />
            <button type="button" className="text-sm text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline" onClick={() => setSkipping(true)}>
              Skip this step
            </button>
          </div>
          <ContinueButton to="/ai/setup/knowledge" disabled={!picked.length} onClick={save} />
        </>
      }
    >
      <FormCard className="space-y-4 border border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} checked={picked.includes(t.id)} onToggle={() => toggle(t.id)} />
          ))}
        </div>
        <p className="text-sm text-gray-500">The complaint scenario hands the conversation to your team straight away.</p>
      </FormCard>
      <SkipDialog open={skipping} onOpenChange={setSkipping} onSkip={skip} />
    </SetupPage>
  );
}
