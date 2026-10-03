// The persona step's form in the setup modal. The Name, Style, Guidelines and Signature fields are
// the "Add new personality" sheet's, with its help texts and examples under the inbox onboarding's
// labels (user decision 2026-10-03); Integrations is left out (the setup has one channel). Language
// is the setup's own field. Two columns, so the step fits the card without scrolling.
import { Input, Textarea } from "@/components/ui/input";
import { fieldLabel } from "@/components/ModalTour";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { Counter, RadioCard } from "../ai/parts";
import { GuidelinesHelp, SignatureIntro, SignatureOptions, StyleHelp } from "../ai/personalityHelp";
import { languageNote, languages, type Language } from "./content";

export type Persona = { name: string; style: string; guidelines: string; language: Language | null; signature: boolean };

/** A field's label with its character counter on the same row, so the form stays short. */
function LabelRow({ htmlFor, label, value, max }: { htmlFor: string; label: string; value: string; max: number }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <label htmlFor={htmlFor} className={fieldLabel}>
        {label}
      </label>
      <Counter value={value} max={max} className="" />
    </div>
  );
}

/** `onFocus` runs when any text field gets focus; `onChange` gets each edit as a patch. */
export function PersonaForm({ value, onChange, onFocus }: { value: Persona; onChange: (patch: Partial<Persona>) => void; onFocus?: () => void }) {
  return (
    <form className="grid grid-cols-2 gap-x-6 text-sm items-start" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-3">
      <div>
        <LabelRow htmlFor="persona-name" label="Name" value={value.name} max={100} />
        <Input
          id="persona-name"
          className="rounded-md"
          placeholder="Enter personality name"
          maxLength={100}
          value={value.name}
          onFocus={onFocus}
          onChange={(e) => onChange({ name: e.target.value })}
        />
      </div>

      <div>
        <LabelRow htmlFor="persona-style" label="Style your AI agent to match your brand personality" value={value.style} max={150} />
        <div className="mb-2">
          <StyleHelp />
        </div>
        <Input
          id="persona-style"
          className="rounded-md"
          placeholder="Describe your AI agent's personality and tone—how it should sound, speak, and engage with customers..."
          maxLength={150}
          value={value.style}
          onFocus={onFocus}
          onChange={(e) => onChange({ style: e.target.value })}
        />
      </div>

      <div>
        <LabelRow htmlFor="persona-guidelines" label="Custom guidelines for response generation" value={value.guidelines} max={250} />
        <div className="mb-2">
          <GuidelinesHelp />
        </div>
        <Textarea
          id="persona-guidelines"
          className="min-h-[64px] resize-none"
          placeholder="Write specific guidelines for the AI to follow - language, word choice, formatting rules..."
          maxLength={250}
          value={value.guidelines}
          onFocus={onFocus}
          onChange={(e) => onChange({ guidelines: e.target.value })}
        />
      </div>
      </div>

      <div className="space-y-4">
      <div>
        <span className={fieldLabel}>Language</span>
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

      <div className="space-y-4">
        <div className="space-y-1">
          <span className={cn(fieldLabel, "mb-0")}>Signature Settings</span>
          <SignatureIntro />
        </div>
        <SignatureOptions value={value.signature} onChange={(signature) => onChange({ signature })} />
      </div>
      </div>
    </form>
  );
}
