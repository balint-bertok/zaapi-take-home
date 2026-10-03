// The writes behind the setup modal's persona, scenarios and knowledge screens: one `updateDemo` call each.
import { updateDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { templates } from "../ai/scenarioTemplates";
import { channelLanguage, neededPolicies, referenceType } from "./content";
import { withStep } from "./fixtures";
import type { Knowledge } from "./KnowledgeForm";
import type { Persona } from "./PersonaForm";

/**
 * The personality row (once per name, so Back then Continue does not duplicate it), the language
 * the later steps read back, and the step marked done.
 */
export function savePersona(persona: Persona) {
  const name = persona.name.trim();
  updateDemo((s) => ({
    ...s,
    personalities: s.personalities.some((p) => p.name === name)
      ? s.personalities
      : [...s.personalities, { id: crypto.randomUUID(), name, enabled: true, integrations: [], createdBy: s.user.name, createdAt: stamp() }],
    personaLanguage: persona.language ?? channelLanguage,
    setupDone: withStep(s.setupDone, "persona"),
  }));
}

/**
 * Rows of unpicked templates removed and the step marked done. Picked templates already have their
 * rows: the scenario form adds each one when it is created.
 */
export function saveScenarios(pickedIds: string[]) {
  const dropped = new Set(templates.filter((t) => !pickedIds.includes(t.id)).map((t) => t.form.name));
  updateDemo((s) => ({
    ...s,
    // Only rows named after an unpicked template go; scenarios added elsewhere stay.
    scenarios: s.scenarios.filter((r) => !dropped.has(r.name)),
    setupDone: withStep(s.setupDone, "scenarios"),
  }));
}

/** The step marked done with no scenario rows. */
export function skipScenarios() {
  updateDemo((s) => ({ ...s, setupDone: withStep(s.setupDone, "scenarios") }));
}

/**
 * Each answered policy the picked scenarios need as a written knowledge source, the reference (if
 * given) as a website or file source, each once per name, and the step marked done.
 */
export function saveKnowledge({ answers, reference }: Knowledge) {
  const now = stamp();
  const ref = reference?.trim() ?? "";
  updateDemo((s) => {
    const answered = neededPolicies(s.scenarios.map((r) => r.name)).filter((p) => answers[p.key].trim() !== "");
    const fresh = (name: string) => !s.knowledgeSources.some((k) => k.name === name);
    const refIsNew = ref !== "" && fresh(ref) && !answered.some((p) => p.label === ref);
    const row = { enabled: true, source: s.user.name, integrations: [], createdAt: now };
    return {
      ...s,
      knowledgeSources: [
        ...s.knowledgeSources,
        ...answered
          .filter((p) => fresh(p.label))
          .map((p) => ({ ...row, id: crypto.randomUUID(), name: p.label, type: "manual_input" as const, detail: p.label, characters: answers[p.key].trim().length })),
        ...(refIsNew ? [{ ...row, id: crypto.randomUUID(), name: ref, type: referenceType(ref), detail: ref, characters: null }] : []),
      ],
      setupDone: withStep(s.setupDone, "knowledge"),
    };
  });
}
