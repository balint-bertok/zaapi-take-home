import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input, Textarea } from "@/components/ui/input";
import { fieldLabel } from "@/components/ModalTour";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { templates } from "../ai/scenarioTemplates";
import type { Policy } from "./content";

type Answers = Record<Policy["key"], string>;

/** What the knowledge step holds: one answer per policy, and the inline reference once its box is checked. */
export type Knowledge = { answers: Answers; reference: string | null };

export const referenceLabel = "I have a file or website URL that includes this info";

/**
 * The knowledge step's form in the setup modal: one answer per policy the picked scenarios need,
 * pre-filled, with the past Helpdesk reply it was drawn from under it (user decision 2026-10-04)
 * and the scenario that needs it, and a line for a website URL (or a file name) that holds the
 * information instead, with an upload button beside it that is inert, since no file leaves the
 * browser (user decisions 2026-10-03). With no scenario picked there is nothing to answer, and the line is the one field.
 */
export function KnowledgeForm({ asked, value, onChange }: { asked: Policy[]; value: Knowledge; onChange: (patch: Partial<Knowledge>) => void }) {
  const checked = value.reference !== null;
  const toggle = () => onChange({ reference: checked ? null : "" });
  return (
    <div className="space-y-4 text-sm">
      {asked.length === 0 && (
        <p className="text-gray-500">None of your scenarios needs a policy answer. Add a file or website below, or continue to test.</p>
      )}
      {/* One column per policy, so three policies with their history lines fit the modal body without scrolling. */}
      {asked.length > 0 && (
        <div className="grid grid-flow-col auto-cols-fr gap-4">
          {asked.map((p) => (
            <div key={p.key}>
              <label htmlFor={`policy-${p.key}`} className={fieldLabel}>
                {p.label}
              </label>
              <p className="text-xs text-gray-500 -mt-1 mb-2">{p.question}</p>
              <Textarea
                id={`policy-${p.key}`}
                maxLength={500}
                className="min-h-[104px] resize-none"
                value={value.answers[p.key]}
                onChange={(e) => onChange({ answers: { ...value.answers, [p.key]: e.target.value } })}
              />
              <p className="text-xs text-gray-500 mt-1 flex gap-1.5">
                <Icon name="clock-rotate-left" className="size-3! mt-0.5 shrink-0" />
                <span>
                  From your chat history, your team to a customer, {p.history.when}: “{p.history.quote}”
                </span>
              </p>
              <p className="text-xs text-gray-400 mt-1">Needed by {templates.find((t) => t.id === p.neededBy)?.title}</p>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={toggle} label={referenceLabel} className="size-4.5" />
          {/* The text toggles the box too, as a label would; the box carries the accessible name. */}
          <span className="text-gray-800 cursor-pointer" onClick={toggle}>
            {referenceLabel}
          </span>
        </div>
        {checked && (
          <div className="flex items-center gap-2">
            <Input
              aria-label="File name or website URL"
              placeholder="Paste the website URL"
              maxLength={200}
              value={value.reference ?? ""}
              onChange={(e) => onChange({ reference: e.target.value })}
            />
            <Inert className={cn(buttonClass("outline"), "h-10 shrink-0")}>
              <Icon name="paperclip" className="size-4!" />
              Upload a file
            </Inert>
          </div>
        )}
      </div>
    </div>
  );
}
