import { useDemo } from "@/store/store";
import { templates } from "../ai/scenarioTemplates";
import { FormCard } from "../ai/parts";
import { channelLanguage, policies, type Language } from "./content";
import { IconRow } from "./IconRow";
import { setupCard, setupCardTitle } from "./SetupPage";

type Row = { ok: boolean; text: string };

function readiness(scenarioNames: string[], sourceNames: string[], language: Language): Row[] {
  const covered = templates.map((t) => t.form.name).filter((n) => scenarioNames.includes(n));
  const answered = policies.filter((p) => sourceNames.includes(p.label)).length;
  return [
    covered.length
      ? { ok: true, text: `Scenarios: ${covered.join(", ")}` }
      : { ok: false, text: "Scenarios: none. Refunds and cancellations will go to your team." },
    answered === policies.length
      ? { ok: true, text: "Policies: shipping, returns and cancellations answered" }
      : { ok: false, text: answered ? `Policies: ${answered} of ${policies.length} answered` : "Policies: none answered yet" },
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
