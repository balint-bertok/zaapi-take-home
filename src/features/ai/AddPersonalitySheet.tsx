import { useState, type FormEvent } from "react";
import { Input, Textarea } from "@/components/ui/input";
import { SheetContent } from "@/components/ui/sheet";
import { updateDemo, useDemo } from "@/store/store";
import { stamp } from "./format";
import { Counter, FormCard, IntegrationPicker, SheetFooter } from "./parts";
import { GuidelinesHelp, SignatureIntro, SignatureOptions, StyleHelp } from "./personalityHelp";

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
            <StyleHelp />
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
            <GuidelinesHelp />
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
              <SignatureIntro />
            </div>
            <SignatureOptions value={hasSignature} onChange={setHasSignature} />
          </div>
        </FormCard>

        <SheetFooter onCancel={onDone} submitLabel="Create" disabled={!ready} large />
      </form>
    </section>
  );
}
