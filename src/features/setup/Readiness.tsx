import { useDemo } from "@/store/store";
import { isTemplateName, templates } from "../ai/scenarioTemplates";
import { FormCard } from "../ai/parts";
import { channelLanguage, neededPolicies, type Language } from "./content";
import { IconRow } from "./IconRow";
import { setupCard, setupCardTitle } from "./SetupPage";

type Row = { ok: boolean; text: string };

function readiness(scenarioNames: string[], sourceNames: string[], referenced: boolean, language: Language): Row[] {
  // Template names in their catalog order, then the scenarios written by hand.
  const fromTemplates = templates.map((t) => t.form.name).filter((n) => scenarioNames.includes(n));
  const covered = [...fromTemplates, ...scenarioNames.filter((n) => !isTemplateName(n))];
  const needed = neededPolicies(scenarioNames);
  const answered = needed.filter((p) => sourceNames.includes(p.label)).length;
  return [
    covered.length
      ? { ok: true, text: `Scenarios: ${covered.join(", ")}` }
      : { ok: false, text: "Scenarios: none. Refunds and complaints will go to your team." },
    needed.length === 0
      ? { ok: true, text: "Policies: none needed by your scenarios" }
      : answered === needed.length
        ? { ok: true, text: `Policies: ${needed.map((p) => p.label.toLowerCase()).join(", ")} answered` }
        : referenced
          ? { ok: true, text: "Policies: in the file or website you added" }
          : { ok: false, text: answered ? `Policies: ${answered} of ${needed.length} answered` : "Policies: none answered yet" },
    language === channelLanguage
      ? { ok: true, text: `Language: ${language}, matches your Test (Demo) customers` }
      : { ok: false, text: `Language: ${language}. Most of your Test (Demo) customers write in ${channelLanguage}.` },
    { ok: true, text: "Channel: Test (Demo), Chat Widget" },
  ];
}

/** "Ready to go live?": what the agent covers so far, read from the store. Warnings never block. */
export function Readiness() {
  const scenarios = useDemo((s) => s.scenarios);
  const sources = useDemo((s) => s.knowledgeSources);
  const language = useDemo((s) => s.personaLanguage);
  const rows = readiness(
    scenarios.map((s) => s.name),
    sources.map((k) => k.name),
    sources.some((k) => k.type === "website" || k.type === "file"),
    language,
  );
  return (
    <FormCard className={setupCard}>
      <h2 className={setupCardTitle}>Ready to go live?</h2>
      <ul className="space-y-3 mt-3">
        {rows.map((r) => (
          <IconRow key={r.text} icon={r.ok ? "circle-check" : "circle-exclamation"} iconClassName={r.ok ? "text-electric-green-600" : "text-warning-500"}>
            {r.text}
          </IconRow>
        ))}
      </ul>
      {rows.some((r) => !r.ok) && (
        <p className="text-xs text-gray-500 mt-3">You can still go live. Each warning is one conversation type the agent will hand to your team.</p>
      )}
    </FormCard>
  );
}
