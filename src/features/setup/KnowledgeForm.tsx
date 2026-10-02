import { useState } from "react";
import { buttonClass } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Icon } from "@/icons/Icon";
import { useDemo } from "@/store/store";
import { AddKnowledgeSourceSheet } from "../ai/AddKnowledgeSourceSheet";
import { Counter, FormCard } from "../ai/parts";
import { templates } from "../ai/scenarioTemplates";
import { policies, type Policy } from "./content";

export type Answers = Record<Policy["key"], string>;

const max = 500;

/**
 * Step 3's form, shared by the empty and the filled page: one card per policy, tagged with the
 * scenario that needs it, then the real "Add New Knowledge Source" sheet for a file or a website.
 */
export function KnowledgeForm({ answers, onChange, onFocus }: { answers: Answers; onChange?: (key: Policy["key"], value: string) => void; onFocus?: () => void }) {
  const scenarios = useDemo((s) => s.scenarios);
  const [adding, setAdding] = useState(false);
  return (
    <>
      {/* The sheets' spacing between question cards, tighter than the page's sections. */}
      <div className="space-y-6">
        {policies.map((p) => {
          const template = templates.find((t) => t.id === p.neededBy);
          const picked = template && scenarios.some((s) => s.name === template.form.name);
          return (
            <FormCard key={p.key} className="space-y-2 border border-gray-200">
              <h2 className="text-base font-medium text-gray-800">{p.label}</h2>
              <p className="text-sm text-gray-500">{p.question}</p>
              <div>
                <Textarea
                  aria-label={p.label}
                  maxLength={max}
                  className="min-h-[88px] resize-none"
                  value={answers[p.key]}
                  onChange={(e) => onChange?.(p.key, e.target.value)}
                  onFocus={onFocus}
                />
                <Counter value={answers[p.key]} max={max} />
              </div>
              <p className="text-xs text-gray-400 mt-2">{picked ? `Needed by ${template.title}` : "Not needed by the scenarios you picked, still useful"}</p>
            </FormCard>
          );
        })}
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-500">
        Have a document or a website instead?
        <Sheet open={adding} onOpenChange={setAdding}>
          <SheetTrigger className={buttonClass("outline")}>
            <Icon name="plus" variant="fas" className="size-4!" />
            Add a file or website
          </SheetTrigger>
          <AddKnowledgeSourceSheet onDone={() => setAdding(false)} />
        </Sheet>
      </div>
    </>
  );
}
