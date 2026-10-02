// The persona step's form, shared by its empty and filled pages. The Name, Style and Guidelines
// cards are the "Add new personality" sheet's, labels and help text included; Integrations and
// the signature are left out (the setup has one channel, and the signature can wait). Language is
// the setup's own field.
import { Input, Textarea } from "@/components/ui/input";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { Counter, FormCard, RadioCard } from "../ai/parts";
import { languageNote, languages, type Language } from "./content";

export type Persona = { name: string; style: string; guidelines: string; language: Language | null };

// The sheet's cards sit on its gray panel; on the near-white page they need the table's border.
const card = "border border-gray-200";

/** `onFocus` runs when any text field gets focus; `onChange` gets each edit as a patch. */
export function PersonaForm({ value, onChange, onFocus }: { value: Persona; onChange: (patch: Partial<Persona>) => void; onFocus?: () => void }) {
  return (
    <form className="space-y-5 text-sm" onSubmit={(e) => e.preventDefault()}>
      <FormCard className={card}>
        <label htmlFor="persona-name" className="text-base font-medium text-gray-800 mb-2">
          Name
        </label>
        <Input
          id="persona-name"
          className="mt-2 rounded-md"
          placeholder="Enter personality name"
          maxLength={100}
          value={value.name}
          onFocus={onFocus}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        <Counter value={value.name} max={100} />
      </FormCard>

      <FormCard className={cn(card, "space-y-4")}>
        <div className="space-y-1">
          <label htmlFor="persona-style" className="text-base font-medium text-gray-800">
            Style your AI agent to match your brand personality
          </label>
          <p className="text-gray-500 whitespace-pre-line">
            Describe the personality that fits your brand voice. The AI will respond in this style.{"\n\n"}
            <b>For example</b>: "You're a calm and witty tech expert who explains things like a helpful friend."
          </p>
        </div>
        <Input
          id="persona-style"
          className="mt-2 rounded-md"
          placeholder="Describe your AI agent's personality and tone—how it should sound, speak, and engage with customers..."
          maxLength={150}
          value={value.style}
          onFocus={onFocus}
          onChange={(e) => onChange({ style: e.target.value })}
        />
        <Counter value={value.style} max={150} />
      </FormCard>

      <FormCard className={cn(card, "space-y-4")}>
        <div className="space-y-1">
          <label htmlFor="persona-guidelines" className="text-base font-medium text-gray-800">
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
        <Textarea
          id="persona-guidelines"
          className="mt-2 min-h-[108px] resize-none"
          placeholder="Write specific guidelines for the AI to follow - language, word choice, formatting rules..."
          maxLength={250}
          value={value.guidelines}
          onFocus={onFocus}
          onChange={(e) => onChange({ guidelines: e.target.value })}
        />
        <Counter value={value.guidelines} max={250} />
      </FormCard>

      <FormCard className={cn(card, "space-y-3")}>
        <div className="space-y-1">
          <label className="text-base font-medium text-gray-800">Language</label>
          <p className="text-gray-500">The language your agent answers in.</p>
        </div>
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
      </FormCard>
    </form>
  );
}
