// The persona step's form in the setup modal. The Name, Style and Guidelines fields are the "Add new
// personality" sheet's, with the inbox onboarding's labels and no help text; Integrations and the
// signature are left out (the setup has one channel, and the signature can wait). Language is the
// setup's own field.
import { Input, Textarea } from "@/components/ui/input";
import { fieldLabel } from "@/components/ModalTour";
import { Icon } from "@/icons/Icon";
import { Counter, RadioCard } from "../ai/parts";
import { languageNote, languages, type Language } from "./content";

export type Persona = { name: string; style: string; guidelines: string; language: Language | null };

/** `onFocus` runs when any text field gets focus; `onChange` gets each edit as a patch. */
export function PersonaForm({ value, onChange, onFocus }: { value: Persona; onChange: (patch: Partial<Persona>) => void; onFocus?: () => void }) {
  return (
    <form className="space-y-4 text-sm" onSubmit={(e) => e.preventDefault()}>
      <div>
        <label htmlFor="persona-name" className={fieldLabel}>
          Name
        </label>
        <Input
          id="persona-name"
          className="rounded-md"
          placeholder="Enter personality name"
          maxLength={100}
          value={value.name}
          onFocus={onFocus}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <Counter value={value.name} max={100} />
      </div>

      <div>
        <label htmlFor="persona-style" className={fieldLabel}>
          Style your AI agent to match your brand personality
        </label>
        <Input
          id="persona-style"
          className="rounded-md"
          placeholder="Describe your AI agent's personality and tone—how it should sound, speak, and engage with customers..."
          maxLength={150}
          value={value.style}
          onFocus={onFocus}
          onChange={(e) => onChange({ style: e.target.value })}
        />
        <Counter value={value.style} max={150} />
      </div>

      <div>
        <label htmlFor="persona-guidelines" className={fieldLabel}>
          Custom guidelines for response generation
        </label>
        <Textarea
          id="persona-guidelines"
          className="min-h-[108px] resize-none"
          placeholder="Write specific guidelines for the AI to follow - language, word choice, formatting rules..."
          maxLength={250}
          value={value.guidelines}
          onFocus={onFocus}
          onChange={(e) => onChange({ guidelines: e.target.value })}
        />
        <Counter value={value.guidelines} max={250} />
      </div>

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
    </form>
  );
}
