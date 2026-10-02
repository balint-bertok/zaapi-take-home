// The writes behind the setup modal's persona and scenarios screens: one `updateDemo` call each.
import { updateDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { templates } from "../ai/scenarioTemplates";
import { channelLanguage } from "./content";
import { withStep } from "./fixtures";
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

/** One scenario row per picked template, rows of unpicked templates removed, the step marked done. */
export function saveScenarios(pickedIds: string[]) {
  const chosen = templates.filter((t) => pickedIds.includes(t.id));
  const dropped = new Set(templates.filter((t) => !pickedIds.includes(t.id)).map((t) => t.form.name));
  const now = stamp();
  updateDemo((s) => ({
    ...s,
    scenarios: [
      // Only rows named after an unpicked template go; scenarios added elsewhere stay.
      ...s.scenarios.filter((r) => !dropped.has(r.name)),
      ...chosen
        .filter((t) => !s.scenarios.some((r) => r.name === t.form.name))
        .map((t) => ({ id: crypto.randomUUID(), name: t.form.name, enabled: true, handling: t.form.handling, integrations: [], createdBy: s.user.name, createdAt: now })),
    ],
    setupDone: withStep(s.setupDone, "scenarios"),
  }));
}

/** The step marked done with no scenario rows. */
export function skipScenarios() {
  updateDemo((s) => ({ ...s, setupDone: withStep(s.setupDone, "scenarios") }));
}
