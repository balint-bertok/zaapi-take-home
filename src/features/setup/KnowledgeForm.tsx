import { Checkbox } from "@/components/ui/checkbox";
import { Input, Textarea } from "@/components/ui/input";
import { fieldLabel } from "@/components/ModalTour";
import { templates } from "../ai/scenarioTemplates";
import type { Policy } from "./content";

type Answers = Record<Policy["key"], string>;

/** What the knowledge step holds: one answer per policy, and the inline reference once its box is checked. */
export type Knowledge = { answers: Answers; reference: string | null };

export const referenceLabel = "I have a file or website URL that includes this info";

/**
 * The knowledge step's form in the setup modal: one answer per policy the picked scenarios need,
 * each tagged with that scenario, and a line for a file name or website URL that holds the
 * information instead (user decision 2026-10-03). With no scenario picked there is nothing to
 * answer, and the line is the one field.
 */
export function KnowledgeForm({
  asked,
  value,
  onChange,
  onFocus,
}: {
  asked: Policy[];
  value: Knowledge;
  onChange: (patch: Partial<Knowledge>) => void;
  onFocus?: () => void;
}) {
  const checked = value.reference !== null;
  const toggle = () => {
    onFocus?.();
    onChange({ reference: checked ? null : "" });
  };
  return (
    <div className="space-y-4 text-sm">
      {asked.length === 0 && (
        <p className="text-gray-500">None of your scenarios needs a policy answer. Add a file or website below, or continue to test.</p>
      )}
      {asked.map((p) => (
        <div key={p.key}>
          <label htmlFor={`policy-${p.key}`} className={fieldLabel}>
            {p.label}
          </label>
          <p className="text-xs text-gray-500 -mt-1 mb-2">{p.question}</p>
          <Textarea
            id={`policy-${p.key}`}
            maxLength={500}
            className="min-h-[72px] resize-none"
            value={value.answers[p.key]}
            onChange={(e) => onChange({ answers: { ...value.answers, [p.key]: e.target.value } })}
            onFocus={onFocus}
          />
          <p className="text-xs text-gray-400 mt-1">Needed by {templates.find((t) => t.id === p.neededBy)?.title}</p>
        </div>
      ))}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={toggle} label={referenceLabel} className="size-4.5" />
          {/* The text toggles the box too, as a label would; the box carries the accessible name. */}
          <span className="text-gray-800 cursor-pointer" onClick={toggle}>
            {referenceLabel}
          </span>
        </div>
        {checked && (
          <Input
            aria-label="File name or website URL"
            placeholder="Paste the URL or the file name"
            maxLength={200}
            value={value.reference ?? ""}
            onChange={(e) => onChange({ reference: e.target.value })}
            onFocus={onFocus}
          />
        )}
      </div>
    </div>
  );
}
