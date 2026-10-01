// Formatting shared by the AI Agent tables.
import type { ScenarioHandling } from "./fixtures";

/** "01 Oct 2026, 11:18", the date format of the app's tables. */
export function stamp(date = new Date()) {
  return date
    .toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(/ at /, ", ");
}

export const integrationsLabel = (names: string[]) => (names.length ? names.join(", ") : "All integrations");

/** ai.scenarioTraining.type.* */
export const handlingLabel: Record<ScenarioHandling, string> = {
  follow_instruction: "Follow instructions",
  escalate_to_human_agent: "Escalate to a human agent immediately",
};

/** Rows whose name contains the search text, ignoring case and surrounding spaces. */
export const byName = <T extends { name: string }>(rows: T[], query: string) =>
  rows.filter((r) => r.name.toLowerCase().includes(query.trim().toLowerCase()));
