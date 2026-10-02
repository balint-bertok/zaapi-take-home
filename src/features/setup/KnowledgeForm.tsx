import { Textarea } from "@/components/ui/input";
import { useDemo } from "@/store/store";
import { fieldLabel } from "@/components/ModalTour";
import { templates } from "../ai/scenarioTemplates";
import { policies, type Policy } from "./content";

export type Answers = Record<Policy["key"], string>;

/**
 * The knowledge step's form in the setup modal: one answer per policy, tagged with the scenario
 * that needs it. Files and websites go through Knowledge Source later; its sheet would open over
 * the modal.
 */
export function KnowledgeForm({ answers, onChange, onFocus }: { answers: Answers; onChange: (key: Policy["key"], value: string) => void; onFocus?: () => void }) {
  const scenarios = useDemo((s) => s.scenarios);
  return (
    <div className="space-y-4 text-sm">
      {policies.map((p) => {
        const template = templates.find((t) => t.id === p.neededBy);
        const picked = template && scenarios.some((s) => s.name === template.form.name);
        return (
          <div key={p.key}>
            <label htmlFor={`policy-${p.key}`} className={fieldLabel}>
              {p.label}
            </label>
            <p className="text-xs text-gray-500 -mt-1 mb-2">{p.question}</p>
            <Textarea
              id={`policy-${p.key}`}
              maxLength={500}
              className="min-h-[72px] resize-none"
              value={answers[p.key]}
              onChange={(e) => onChange(p.key, e.target.value)}
              onFocus={onFocus}
            />
            <p className="text-xs text-gray-400 mt-1">{picked ? `Needed by ${template.title}` : "Not needed by the scenarios you picked, still useful"}</p>
          </div>
        );
      })}
      <p className="text-xs text-gray-500">Files and websites can be added later from Knowledge Source.</p>
    </div>
  );
}
