// The persona step's form. The Name, Style and Guidelines cards are the "Add new personality"
// sheet's, labels and help text included; Integrations and the signature are left out (the setup
// has one channel, and the signature can wait). Language is the setup's own field. `compact` is
// the setup modal's version: bare fields with the inbox onboarding's labels, no help text.
import type { ReactNode } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { fieldLabel } from "../auth/onboarding/ModalTour";
import { Counter, FormCard, RadioCard } from "../ai/parts";
import { languageNote, languages, type Language } from "./content";

export type Persona = { name: string; style: string; guidelines: string; language: Language | null };

// The sheet's cards sit on its gray panel; on the near-white page they need the table's border.
const card = "border border-gray-200";
const label = "text-base font-medium text-gray-800";

/** `onFocus` runs when any text field gets focus; `onChange` gets each edit as a patch. */
export function PersonaForm({
  value,
  onChange,
  onFocus,
  compact,
}: {
  value: Persona;
  onChange: (patch: Partial<Persona>) => void;
  onFocus?: () => void;
  compact?: boolean;
}) {
  // A card on the page, a plain block in the modal (which is already a card).
  const field = (className: string, children: ReactNode) => (compact ? <div>{children}</div> : <FormCard className={cn(card, className)}>{children}</FormCard>);
  // Inputs sit under the label's margin in the modal, under their own on the page.
  const inputGap = compact ? undefined : "mt-2";
  return (
    <form className={cn(compact ? "space-y-4" : "space-y-5", "text-sm")} onSubmit={(e) => e.preventDefault()}>
      {field(
        "",
        <>
          <label htmlFor="persona-name" className={compact ? fieldLabel : cn(label, "mb-2")}>
            Name
          </label>
          <Input
            id="persona-name"
            className={cn(inputGap, "rounded-md")}
            placeholder="Enter personality name"
            maxLength={100}
            value={value.name}
            onFocus={onFocus}
            onChange={(e) => onChange({ name: e.target.value })}
          />
          <Counter value={value.name} max={100} />
        </>,
      )}

      {field(
        "space-y-4",
        <>
          {compact ? (
            <label htmlFor="persona-style" className={fieldLabel}>
              Style your AI agent to match your brand personality
            </label>
          ) : (
            <div className="space-y-1">
              <label htmlFor="persona-style" className={label}>
                Style your AI agent to match your brand personality
              </label>
              <p className="text-gray-500 whitespace-pre-line">
                Describe the personality that fits your brand voice. The AI will respond in this style.{"\n\n"}
                <b>For example</b>: "You're a calm and witty tech expert who explains things like a helpful friend."
              </p>
            </div>
          )}
          <Input
            id="persona-style"
            className={cn(inputGap, "rounded-md")}
            placeholder="Describe your AI agent's personality and tone—how it should sound, speak, and engage with customers..."
            maxLength={150}
            value={value.style}
            onFocus={onFocus}
            onChange={(e) => onChange({ style: e.target.value })}
          />
          <Counter value={value.style} max={150} />
        </>,
      )}

      {field(
        "space-y-4",
        <>
          {compact ? (
            <label htmlFor="persona-guidelines" className={fieldLabel}>
              Custom guidelines for response generation
            </label>
          ) : (
            <div className="space-y-1">
              <label htmlFor="persona-guidelines" className={label}>
                Custom guidelines for response generation
              </label>
              <div className="text-gray-500 whitespace-pre-line">
                Set specific rules to shape how the AI replies. This helps ensure consistency with your brand's voice and customer expectations. (By default, the AI replies in the
                customer's last-used language.){"\n\n"}
                <b>For example</b>:
                <ul className="list-disc list-inside">
                  <li>"Always respond in English."</li>
                  <li>"Use emojis sparingly."</li>
                  <li>"Avoid big paragraphs—keep answers short and digestible."</li>
                </ul>
              </div>
            </div>
          )}
          <Textarea
            id="persona-guidelines"
            className={cn(inputGap, "min-h-[108px] resize-none")}
            placeholder="Write specific guidelines for the AI to follow - language, word choice, formatting rules..."
            maxLength={250}
            value={value.guidelines}
            onFocus={onFocus}
            onChange={(e) => onChange({ guidelines: e.target.value })}
          />
          <Counter value={value.guidelines} max={250} />
        </>,
      )}

      {field(
        "space-y-3",
        <>
          {compact ? (
            <span className={fieldLabel}>Language</span>
          ) : (
            <div className="space-y-1">
              <label className={label}>Language</label>
              <p className="text-gray-500">The language your agent answers in.</p>
            </div>
          )}
          <div>
            <div role="radiogroup" aria-label="Language" className="flex gap-4">
              {languages.map((l) => (
                <RadioCard key={l} checked={value.language === l} onSelect={() => onChange({ language: l })}>
                  {l}
                </RadioCard>
              ))}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
              <Icon name="circle-exclamation" className="size-3.5! text-gray-400" />
              {languageNote}
            </div>
          </div>
        </>,
      )}
    </form>
  );
}
