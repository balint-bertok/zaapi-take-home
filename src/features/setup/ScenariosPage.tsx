import { useState } from "react";
import { useNavigate } from "react-router";
import { updateDemo, useDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { ChoiceCard } from "../ai/AddScenarioSheet";
import { FormCard } from "../ai/parts";
import { templates } from "../ai/scenarioTemplates";
import { ConfirmDialog } from "../automations/basic/ConfirmDialog";
import { skipConsequence } from "./content";
import { withStep } from "./fixtures";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

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
            <ChoiceCard key={t.id} icon={t.icon} title={t.title} description={t.description} checked={picked.includes(t.id)} onClick={() => toggle(t.id)} />
          ))}
        </div>
        <p className="text-sm text-gray-500">The complaint scenario hands the conversation to your team straight away.</p>
      </FormCard>
      {/* The activation step's question dialog, stating what skipping costs and where to add scenarios later. */}
      <ConfirmDialog
        open={skipping}
        onOpenChange={setSkipping}
        title="Skip scenarios?"
        description={
          <>
            {skipConsequence}
            <br />
            You can add them any time from Scenario Handling.
          </>
        }
        secondary="Go back"
        onSecondary={() => setSkipping(false)}
        primary="Skip anyway"
        onPrimary={skip}
      />
    </SetupPage>
  );
}
