import { useState } from "react";
import { updateDemo } from "@/store/store";
import { stamp } from "../ai/format";
import { policies } from "./content";
import { KnowledgeForm, type Answers } from "./KnowledgeForm";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

const suggested = Object.fromEntries(policies.map((p) => [p.key, p.answer])) as Answers;

/** Step 3, filled with Brand One's answers. Continue saves each answered policy as a written knowledge source. */
export default function KnowledgeFilledPage() {
  const [answers, setAnswers] = useState(suggested);
  const answered = policies.filter((p) => answers[p.key].trim() !== "");

  function save() {
    const now = stamp();
    updateDemo((s) => ({
      ...s,
      knowledgeSources: [
        ...s.knowledgeSources,
        ...answered
          .filter((p) => !s.knowledgeSources.some((k) => k.name === p.label))
          .map((p) => ({
            id: crypto.randomUUID(),
            name: p.label,
            enabled: true,
            source: s.user.name,
            type: "manual_input" as const,
            detail: p.label,
            integrations: [],
            characters: answers[p.key].trim().length,
            createdAt: now,
          })),
      ],
      setupDone: s.setupDone.includes("knowledge") ? s.setupDone : [...s.setupDone, "knowledge"],
    }));
  }

  return (
    <SetupPage
      step={3}
      title="Knowledge"
      description="Answer the policies your scenarios need. Short answers are fine; the agent fills in the wording."
      footer={
        <>
          <BackLink to="/ai/setup/knowledge" />
          <ContinueButton to="/ai/setup/test" disabled={!answered.length} onClick={save} />
        </>
      }
    >
      <KnowledgeForm answers={answers} onChange={(key, value) => setAnswers((a) => ({ ...a, [key]: value }))} />
    </SetupPage>
  );
}
