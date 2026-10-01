import { useState, type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import { AiAvatar } from "./AiAvatar";
import { stamp } from "./format";
import { Counter, FormCard, IntegrationPicker, RadioDot, SheetFooter } from "./parts";

// ai.personality.signatureSettings.*; the emoji is lifted out of the gradient text as the app's
// `.emoji` rule does, or the gradient would paint through it.
const emojiStyle = { WebkitTextFillColor: "initial", color: "initial", background: "none", backgroundClip: "initial" } as const;
const exampleMsg = (
  <>
    Let me know how I can assist you further! <span style={emojiStyle}>😊</span>
  </>
);

function SignatureOption({ checked, onSelect, label, signed }: { checked: boolean; onSelect: () => void; label: string; signed?: boolean }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        "flex disabled:opacity-50 flex-col p-3 border rounded-lg text-left transition-all gap-2",
        checked ? "border-electric-green-500" : "border-gray-200 bg-white hover:border-gray-300",
      )}
    >
      <div className="flex items-center space-x-2">
        <RadioDot checked={checked} />
        <span className="text-sm font-medium text-gray-800">{label}</span>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg flex-1 w-full">
        <div className="flex justify-end items-end gap-2">
          <div className="bg-(image:--color-ai-gradient-light) rounded-lg p-3 text-sm">
            <span className="ai-gradient-text whitespace-pre-line">
              {exampleMsg}
              {signed && " \n\nSent by AI Agent"}
            </span>
          </div>
          <AiAvatar />
        </div>
      </div>
    </button>
  );
}

/** "Add new personality" sheet (Step 11 (2)), markup from the saved English page. */
export function AddPersonalitySheet({ onDone }: { onDone: () => void }) {
  return (
    <SheetContent title="Add new personality">
      <PersonalityForm onDone={onDone} />
    </SheetContent>
  );
}

function PersonalityForm({ onDone }: { onDone: () => void }) {
  const user = useDemo((s) => s.user);
  const [name, setName] = useState("");
  const [integrations, setIntegrations] = useState<string[]>([]);
  const [style, setStyle] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const ready = name.trim() !== "";

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!ready) return;
    const now = stamp();
    updateDemo((s) => ({
      ...s,
      personalities: [...s.personalities, { id: crypto.randomUUID(), name: name.trim(), enabled: true, integrations, createdBy: user.name, createdAt: now }],
    }));
    // The catalog has no "personality created" toast, so none is shown.
    onDone();
  }

  return (
    <section className="flex flex-col gap-5 bg-gray-50 overflow-auto px-7 py-4 text-sm">
      <form className="space-y-5" onSubmit={submit}>
        <FormCard>
          <label htmlFor="personality-name" className="text-base font-medium text-gray-800 mb-2">
            Name
          </label>
          <Input id="personality-name" className="mt-2 rounded-md" placeholder="Enter personality name" maxLength={100} value={name} onChange={(e) => setName(e.target.value)} />
          <Counter value={name} max={100} />
        </FormCard>

        <FormCard className="space-y-3">
          <div className="space-y-1">
            <label className="text-base font-medium text-gray-800 mb-2">Integrations applied</label>
            <p className="text-gray-500 whitespace-pre-line">Select the integrations where this personality will be applied to.</p>
          </div>
          <IntegrationPicker value={integrations} onChange={setIntegrations} />
        </FormCard>

        <FormCard className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="personality-style" className="text-base font-medium text-gray-800">
              Style your AI agent to match your brand personality
            </label>
            <p className="text-gray-500 whitespace-pre-line">
              Describe the personality that fits your brand voice. The AI will respond in this style.{"\n\n"}
              <b>For example</b>: "You're a calm and witty tech expert who explains things like a helpful friend."
            </p>
          </div>
          <Input
            id="personality-style"
            className="mt-2 rounded-md"
            placeholder="Describe your AI agent's personality and tone—how it should sound, speak, and engage with customers..."
            maxLength={150}
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          />
          <Counter value={style} max={150} />
        </FormCard>

        <FormCard className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="personality-guidelines" className="text-base font-medium text-gray-800">
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
            id="personality-guidelines"
            className="mt-2 min-h-[108px] resize-none"
            placeholder="Write specific guidelines for the AI to follow - language, word choice, formatting rules..."
            maxLength={250}
            value={guidelines}
            onChange={(e) => setGuidelines(e.target.value)}
          />
          <Counter value={guidelines} max={250} />
        </FormCard>

        <FormCard>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-base font-medium text-gray-800">Signature Settings</label>
              <div className="space-y-1">
                <h4 className="text-gray-800 font-medium">Add a signature at the end of every AI reply</h4>
                <p className="text-gray-500">Used to clarify that a message is from an AI</p>
              </div>
            </div>
            <div role="radiogroup" aria-label="Signature Settings" className="grid grid-cols-2 gap-4">
              <SignatureOption checked={hasSignature} onSelect={() => setHasSignature(true)} label="Custom signature" signed />
              <SignatureOption checked={!hasSignature} onSelect={() => setHasSignature(false)} label="No signature" />
            </div>
          </div>
        </FormCard>

        <SheetFooter onCancel={onDone} submitLabel="Create" disabled={!ready} large />
      </form>
    </section>
  );
}
