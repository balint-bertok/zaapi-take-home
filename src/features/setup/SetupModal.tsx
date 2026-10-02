import { useState, type ComponentProps, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { ModalTour, StepCard } from "@/components/ModalTour";
import { updateDemo, useDemo } from "@/store/store";
import { ChoiceCard } from "../ai/AddScenarioSheet";
import { templates } from "../ai/scenarioTemplates";
import { personaSuggestion, policies, skipConsequence, stepCounter, type Language } from "./content";
import { ChannelRow, StepsAhead } from "./Intro";
import { KnowledgeForm, type Answers } from "./KnowledgeForm";
import { PersonaForm, type Persona } from "./PersonaForm";
import { saveKnowledge, savePersona, saveScenarios, skipScenarios } from "./save";
import { BackLink, ContinueButton } from "./SetupPage";

// The setup's first four screens, in the inbox onboarding's modal frame, over the setup page.
// Copy is not from the catalog (see content.ts).

const personaPath = "/ai/setup/persona";
const filledPath = "/ai/setup/persona/filled";
const scenariosPath = "/ai/setup/scenarios";
const knowledgePath = "/ai/setup/knowledge";
const knowledgeFilledPath = "/ai/setup/knowledge/filled";

/** Each modal URL's screen, and the step number under the card (none on the welcome). */
const screens: Record<string, { step?: number; body: () => ReactNode }> = {
  "/ai/setup": { body: () => <WelcomeStep /> },
  [personaPath]: { step: 1, body: () => <PersonaStep filled={false} /> },
  [filledPath]: { step: 1, body: () => <PersonaStep filled /> },
  [scenariosPath]: { step: 2, body: () => <ScenariosStep /> },
  [knowledgePath]: { step: 3, body: () => <KnowledgeStep filled={false} /> },
  [knowledgeFilledPath]: { step: 3, body: () => <KnowledgeStep filled /> },
};

const footer = "border-t bg-gray-50 px-6 py-3 flex justify-between items-center gap-4";
const sectionTitle = "text-base font-medium text-gray-800";

// The screens open with the card itself focused: Radix would focus the first field, and focusing
// a persona field fills the form in.
const focusCard = (e: Event) => {
  e.preventDefault();
  (e.target as HTMLElement).focus();
};

/** The modal's card: one width for every screen, opened with the card focused. */
function SetupCard(props: Omit<ComponentProps<typeof StepCard>, "width" | "onOpenAutoFocus">) {
  return <StepCard width="w-[668px]" onOpenAutoFocus={focusCard} {...props} />;
}

/**
 * Shown on the welcome, persona, scenarios and knowledge URLs; on the welcome alone, "Do it later" keeps it
 * closed. Mounted once by SetupShell, so it survives moving between its screens.
 */
export default function SetupModal() {
  const { pathname } = useLocation();
  const dismissed = useDemo((s) => s.setupModalDismissed);
  const screen = screens[pathname];
  if (!screen || (!screen.step && dismissed)) return null;
  return <ModalTour counter={screen.step ? stepCounter(screen.step) : undefined}>{screen.body()}</ModalTour>;
}

/**
 * A filled form's local state: `initial()` on mount, and again each time the filled URL is entered
 * (a new history entry has a new key), reset during render rather than in an effect.
 */
function useFilledState<T>(filled: boolean, initial: () => T) {
  const { key } = useLocation();
  const [value, setValue] = useState(initial);
  const [shownKey, setShownKey] = useState(key);
  if (shownKey !== key) {
    setShownKey(key);
    if (filled) setValue(initial());
  }
  return [value, setValue] as const;
}

/** "Do it later": closes the modal onto the setup page, and keeps it closed there. */
function LaterButton() {
  const navigate = useNavigate();
  const later = () => {
    updateDemo((s) => ({ ...s, setupModalDismissed: true }));
    navigate("/ai/setup");
  };
  return (
    <button type="button" onClick={later} className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">
      Do it later
    </button>
  );
}

function WelcomeStep() {
  return (
    <SetupCard
      title="Set up your first AI Agent"
      subtitle="Five short steps, then your agent answers customers on one channel."
    >
      <div className="px-6 py-5 space-y-5 text-sm">
        <div className="space-y-3">
          <h2 className={sectionTitle}>Channel</h2>
          <ChannelRow />
        </div>
        <div className="space-y-3">
          <h2 className={sectionTitle}>What's ahead</h2>
          <StepsAhead />
        </div>
      </div>
      <div className={footer}>
        <LaterButton />
        <ContinueButton variant="default" to={personaPath}>Start</ContinueButton>
      </div>
    </SetupCard>
  );
}

const empty: Persona = { name: "", style: "", guidelines: "", language: null };
const suggestion = (language?: Language) => ({ ...personaSuggestion, language: language ?? personaSuggestion.language });

/**
 * Step 1, on both persona URLs. Empty, the demo fills the form in for the viewer rather than making
 * them type: touching any field or language card moves to the filled URL, carrying a picked language
 * along. Filled, the suggestion sits in local state, editable; arriving on the filled URL resets it.
 */
function PersonaStep({ filled }: { filled: boolean }) {
  const navigate = useNavigate();
  // A language picked on the empty form arrives as navigation state and wins over the suggestion.
  const picked = (useLocation().state as Pick<Persona, "language"> | null)?.language ?? undefined;
  const [persona, setPersona] = useFilledState<Persona>(filled, () => suggestion(picked));
  const fill = (patch?: Partial<Persona>) => navigate(filledPath, { state: patch?.language ? { language: patch.language } : undefined });
  const name = persona.name.trim();
  return (
    <SetupCard
      title="Persona"
      subtitle="Name your agent and decide how it sounds. Language defaults to what your customers write in."
    >
      <div className="px-6 py-5">
        <PersonaForm
          value={filled ? persona : empty}
          onChange={filled ? (patch) => setPersona((p) => ({ ...p, ...patch })) : fill}
          onFocus={filled ? undefined : () => fill()}
        />
      </div>
      <div className={footer}>
        <div className="flex items-center gap-4">
          {/* After "Do it later" the welcome stays closed, so Back lands on the page Start came from. */}
          <BackLink to="/ai/setup" />
          <LaterButton />
        </div>
        <ContinueButton variant="default" to={scenariosPath} disabled={!filled || !name} onClick={() => savePersona(persona)}>
          Continue
        </ContinueButton>
      </div>
    </SetupCard>
  );
}

/** Step 2: pick the scenario templates. Opens with what the store holds, so coming back shows the picks. */
function ScenariosStep() {
  const scenarios = useDemo((s) => s.scenarios);
  const navigate = useNavigate();
  const [picked, setPicked] = useState(() => templates.filter((t) => scenarios.some((s) => s.name === t.form.name)).map((t) => t.id));
  // Skipping asks inline, not in a second dialog over this one.
  const [skipping, setSkipping] = useState(false);
  const toggle = (id: string) => {
    setSkipping(false);
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };
  const skip = () => {
    skipScenarios();
    navigate(knowledgePath);
  };
  return (
    <SetupCard
      title="Scenarios"
      subtitle="Pick what your agent should handle. Each one comes with ready-made steps you can edit later."
    >
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {templates.map((t) => (
            <ChoiceCard key={t.id} icon={t.icon} title={t.title} description={t.description} checked={picked.includes(t.id)} onClick={() => toggle(t.id)} />
          ))}
        </div>
        <p className="text-sm text-gray-500">The complaint scenario hands the conversation to your team straight away.</p>
      </div>
      <div className={footer}>
        <div className="flex items-center gap-4">
          <BackLink to={filledPath} />
          {skipping ? (
            <p className="text-sm text-gray-600">
              {skipConsequence}{" "}
              <button type="button" onClick={skip} className="text-gray-800 font-medium underline-offset-2 hover:underline">
                Skip anyway
              </button>
            </p>
          ) : (
            <button type="button" className="text-sm text-gray-500 hover:text-gray-700 underline-offset-2 hover:underline" onClick={() => setSkipping(true)}>
              Skip this step
            </button>
          )}
        </div>
        <ContinueButton variant="default" to={knowledgePath} disabled={!picked.length} onClick={() => saveScenarios(picked)}>
          Continue to knowledge
        </ContinueButton>
      </div>
    </SetupCard>
  );
}

const noAnswers: Answers = { shipping: "", returns: "", cancellations: "" };
const suggestedAnswers = Object.fromEntries(policies.map((p) => [p.key, p.answer])) as Answers;

/**
 * Step 3, on both knowledge URLs. Empty, focusing any answer moves to the filled URL, as on the
 * persona; filled, Brand One's answers sit in local state, editable. Continue saves each answered
 * policy as a written knowledge source and leaves the modal for the test page.
 */
function KnowledgeStep({ filled }: { filled: boolean }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useFilledState(filled, () => suggestedAnswers);
  const answered = policies.some((p) => answers[p.key].trim() !== "");
  return (
    <SetupCard
      title="Knowledge"
      subtitle="Answer the policies your scenarios need. Short answers are fine; the agent fills in the wording."
    >
      <div className="px-6 py-5">
        <KnowledgeForm
          answers={filled ? answers : noAnswers}
          onChange={(key, value) => filled && setAnswers((a) => ({ ...a, [key]: value }))}
          onFocus={filled ? undefined : () => navigate(knowledgeFilledPath)}
        />
      </div>
      <div className={footer}>
        <div className="flex items-center gap-4">
          <BackLink to={scenariosPath} />
          <LaterButton />
        </div>
        <ContinueButton variant="default" to="/ai/setup/test" disabled={!filled || !answered} onClick={() => saveKnowledge(answers)}>
          Continue to test
        </ContinueButton>
      </div>
    </SetupCard>
  );
}
