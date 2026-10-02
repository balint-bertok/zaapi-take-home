import { useState } from "react";
import { useLocation } from "react-router";
import { updateDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { channelLanguage, personaSuggestion } from "./content";
import { withStep } from "./fixtures";
import { PersonaForm, type Persona } from "./PersonaForm";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

/** Step 1 with the suggested answers in place; still editable. */
export default function PersonaFilledPage() {
  // A language picked on the empty page arrives as navigation state and wins over the suggestion.
  const picked = (useLocation().state as Pick<Persona, "language"> | null)?.language;
  const [persona, setPersona] = useState<Persona>(() => ({ ...personaSuggestion, language: picked ?? personaSuggestion.language }));
  const name = persona.name.trim();

  // One write: the personality row (once per name, so Back then Continue does not duplicate it),
  // the language the later steps read back, and the step marked done.
  function save() {
    updateDemo((s) => ({
      ...s,
      personalities: s.personalities.some((p) => p.name === name)
        ? s.personalities
        : [...s.personalities, { id: crypto.randomUUID(), name, enabled: true, integrations: [], createdBy: s.user.name, createdAt: stamp() }],
      personaLanguage: persona.language ?? channelLanguage,
      setupDone: withStep(s.setupDone, "persona"),
    }));
  }

  return (
    <SetupPage
      step={1}
      title="Persona"
      description="Name your agent and decide how it sounds. Language defaults to what your customers write in."
      footer={
        <>
          <BackLink to="/ai/setup/persona" />
          <ContinueButton to="/ai/setup/scenarios" disabled={!name} onClick={save} />
        </>
      }
    >
      <PersonaForm value={persona} onChange={(patch) => setPersona((p) => ({ ...p, ...patch }))} />
    </SetupPage>
  );
}
