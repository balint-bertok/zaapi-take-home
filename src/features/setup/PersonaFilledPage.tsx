import { useState } from "react";
import { updateDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { personaSuggestion } from "./content";
import { PersonaForm, type Persona } from "./PersonaForm";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

/** Step 1 with the suggested answers in place; still editable. */
export default function PersonaFilledPage() {
  const [persona, setPersona] = useState<Persona>(() => {
    const { name, style, guidelines, language } = personaSuggestion;
    return { name, style, guidelines, language };
  });
  const name = persona.name.trim();

  // One write: the personality row (once per name, so Back then Continue does not duplicate it),
  // the language the later steps read back, and the step marked done.
  function save() {
    const language = persona.language ?? personaSuggestion.language;
    updateDemo((s) => ({
      ...s,
      personalities: s.personalities.some((p) => p.name === name)
        ? s.personalities
        : [...s.personalities, { id: crypto.randomUUID(), name, enabled: true, integrations: [], createdBy: s.user.name, createdAt: stamp() }],
      personaLanguage: language,
      setupDone: s.setupDone.includes("persona") ? s.setupDone : [...s.setupDone, "persona"],
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
