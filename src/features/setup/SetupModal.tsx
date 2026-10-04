import { useState, type MouseEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import { Inert } from "@/components/Inert";
import { ModalTour, StepCard } from "@/components/ModalTour";
import { Button } from "@/components/ui/button";
import { updateDemo, useDemo } from "@/store/store";
import { ChoiceCard, ScenarioForm } from "../ai/AddScenarioSheet";
import { AiCallout, FormCard, RadioCard } from "../ai/parts";
import { AccountLabel, TestChat } from "../ai/TestChat";
import { isTemplateName, manualEntry, scratch, templates, type Template } from "../ai/scenarioTemplates";
import {
  flowBlocks,
  flowTemplate,
  flowTemplates,
  neededPolicies,
  pauseNote,
  personaSuggestion,
  policies,
  setupSteps,
  shares,
  skipConsequence,
  stepsIntro,
  writtenScenario,
} from "./content";
import { IconRow } from "./IconRow";
import { ChannelRow, StepsAhead } from "./Intro";
import { KnowledgeForm, type Knowledge } from "./KnowledgeForm";
import { PersonaForm, type Persona } from "./PersonaForm";
import { Readiness } from "./Readiness";
import { markTested, saveKnowledge, savePersona, saveScenarios, skipScenarios } from "./save";
import { BackButton, BackLink, ContinueButton, setupCard, setupCardTitle } from "./SetupPage";
import { SetupProgress, type ProgressStep } from "./SetupProgress";

// The setup's screens, welcome through go live, in the inbox onboarding's modal frame, over the
// setup page. Copy is not from the catalog (see content.ts).

// Each step's URL by key, from the step list; the persona's filled twin and the welcome are not steps.
const path = Object.fromEntries(setupSteps.map((s) => [s.step ?? "live", s.to])) as Record<ProgressStep, string>;
const { persona: personaPath, scenarios: scenariosPath, knowledge: knowledgePath, test: testPath, live: livePath } = path;
const filledPath = "/ai/setup/persona/filled";
const welcomePath = "/ai/setup";

/** Each modal URL's screen. */
const screens: Record<string, () => ReactNode> = {
  [welcomePath]: () => <WelcomeStep />,
  [personaPath]: () => <PersonaStep filled={false} />,
  [filledPath]: () => <PersonaStep filled />,
  [scenariosPath]: () => <ScenariosStep />,
  [knowledgePath]: () => <KnowledgeStep />,
  [testPath]: () => <TestStep />,
  [livePath]: () => <GoLiveStep />,
};

// The card's width and the screens' body height, so the card is one size and its footer sits at the
// same place on every screen, and no screen scrolls to reach the next step (user decision
// 2026-10-03): the taller screens (persona, scenario form, test, go live) lay their content out in two
// columns instead, and every screen's content fits the body, with the whole card fitting a laptop
// window (docs/measurements.md, guarded by the setup-path suite). The card is a column capped at the
// window's height, so in a window shorter than the card the body alone scrolls and the title and
// footer stay on screen; the body also scrolls if content ever outgrows it, so nothing is unreachable.
// Wide enough for the test chat's header beside the readiness card without a sideways scroll
// (user report 2026-10-03).
const cardWidth = "w-[1040px] flex max-h-[calc(100vh-2rem)] flex-col";
const bodyHeight = 516;
const footerClass = "border-t bg-gray-50 px-6 py-3 flex justify-between items-center gap-4";
const sectionTitle = "text-base font-medium text-gray-800";

// The screens open with the card itself focused: Radix would focus the first field, and focusing
// a persona field fills the form in.
const focusCard = (e: Event) => {
  e.preventDefault();
  (e.target as HTMLElement).focus();
};

/**
 * The modal's card: one size for every screen, so the footer does not move between steps; the
 * step bar on top (`step` current, none on the welcome), the screen's body (held at the body
 * height), the gray footer row. Opened with the card focused.
 */
function SetupCard({
  step,
  title,
  subtitle,
  footer,
  children,
}: {
  step?: ProgressStep;
  title: string;
  subtitle: string;
  footer: ReactNode;
  children: ReactNode;
}) {
  return (
    <StepCard width={cardWidth} top={<SetupProgress current={step} />} title={title} subtitle={subtitle} onOpenAutoFocus={focusCard}>
      {/* The design height, shrinking only when the window is shorter than the card. */}
      <div data-testid="setup-body" className="min-h-0 overflow-y-auto" style={{ height: bodyHeight }}>
        {children}
      </div>
      <div className={footerClass}>{footer}</div>
    </StepCard>
  );
}

/**
 * Shown on every setup URL but the done page. Mounted once by SetupShell, so it survives moving
 * between its screens.
 */
export default function SetupModal() {
  const { pathname } = useLocation();
  const screen = screens[pathname];
  return screen ? <ModalTour>{screen()}</ModalTour> : null;
}

/**
 * The persona form's local state: `initial()` on mount, and again each time its URL is entered (a
 * new history entry has a new key), reset during render rather than in an effect. Both persona
 * URLs render the same component in the same slot, so without the reset the filled twin would keep
 * the earlier run's edits; the empty twin never reads the value.
 */
function useFilledState<T>(initial: () => T) {
  const { key } = useLocation();
  const [value, setValue] = useState(initial);
  const [shownKey, setShownKey] = useState(key);
  if (shownKey !== key) {
    setShownKey(key);
    setValue(initial());
  }
  return [value, setValue] as const;
}

/** "Finish later" is inert: the demo keeps its viewer on the path (user decision 2026-10-03). */
function LaterButton() {
  return <Inert className="text-sm font-medium text-gray-800 hover:text-gray-600 transition-colors">Finish later</Inert>;
}

function WelcomeStep() {
  return (
    <SetupCard
      title="Set up your first AI Agent"
      subtitle={stepsIntro}
      footer={
        <>
          <LaterButton />
          <ContinueButton variant="default" to={personaPath}>Start</ContinueButton>
        </>
      }
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
    </SetupCard>
  );
}

const empty: Persona = { name: "", style: "", guidelines: "", language: null, signature: false };
// A choice made on the empty form (language card, signature card) that the filled form keeps.
type Picked = Partial<Pick<Persona, "language" | "signature">>;
const suggestion = ({ language, signature }: Picked) => ({
  ...personaSuggestion,
  language: language ?? personaSuggestion.language,
  signature: signature ?? personaSuggestion.signature,
});

/**
 * Persona, on both its URLs. Empty, the demo fills the form in for the viewer rather than making
 * them type, whichever way they reach for it: touching any field, language or signature card, or
 * Continue, moves to the filled URL, a picked language or signature carried along. Filled, the
 * suggestion sits in local state, editable; arriving on the filled URL resets it.
 */
function PersonaStep({ filled }: { filled: boolean }) {
  const navigate = useNavigate();
  // A card picked on the empty form arrives as navigation state and wins over the suggestion.
  const picked = (useLocation().state as Picked | null) ?? {};
  const [persona, setPersona] = useFilledState<Persona>(() => suggestion(picked));
  const fill = ({ language, signature }: Picked = {}) => navigate(filledPath, { state: { language, signature } });
  const name = persona.name.trim();
  return (
    <SetupCard
      step="persona"
      title="Persona"
      subtitle="Name your agent and decide how it sounds. Language defaults to what your customers write in."
      footer={
        <>
          <div className="flex items-center gap-4">
            <BackLink to={welcomePath} />
            <LaterButton />
          </div>
          <ContinueButton variant="default" to={filled ? scenariosPath : filledPath} disabled={filled && !name} onClick={filled ? () => savePersona(persona) : undefined}>
            Continue
          </ContinueButton>
        </>
      }
    >
      <div className="px-6 py-5">
        <PersonaForm
          value={filled ? persona : empty}
          onChange={filled ? (patch) => setPersona((p) => ({ ...p, ...patch })) : fill}
          onFocus={filled ? undefined : () => fill()}
        />
      </div>
    </SetupCard>
  );
}

/**
 * Scenarios: pick the scenario templates, or write one. Opens with what the store holds, so coming back
 * shows the picks. Picking a template opens its prefilled scenario form in the same card, as the "Add
 * scenario" sheet does; creating it adds the row and returns to the cards with that one checked (unless
 * renamed: the card stands for the template's name). Unchecking a card only drops the pick: Continue
 * removes its row. "Manual entry" opens the empty form, as the sheet's does (user decision 2026-10-03);
 * like the other empty forms it fills itself in on first touch, or on Create, with a scenario the
 * merchant might write; each scenario it creates stays, and counts on its card.
 */
function ScenariosStep() {
  const scenarios = useDemo((s) => s.scenarios);
  const navigate = useNavigate();
  // A card is checked while its template has a row (matched by name, as the knowledge step does) and
  // it has not been unchecked here; unchecked rows go on Continue.
  const [unchecked, setUnchecked] = useState<string[]>([]);
  const created = (t: Template) => scenarios.some((s) => s.name === t.form.name);
  const picked = templates.filter((t) => created(t) && !unchecked.includes(t.id)).map((t) => t.id);
  // Rows not named after a template: written by hand here (or on the Scenario Handling page).
  const written = scenarios.filter((s) => !isTemplateName(s.name)).length;
  const [editing, setEditing] = useState<Pick<Template, "title" | "form"> | null>(null);
  // Skipping asks inline, not in a second dialog over this one.
  const [skipping, setSkipping] = useState(false);
  const pick = (t: Template) => {
    setSkipping(false);
    if (picked.includes(t.id)) setUnchecked((u) => [...u, t.id]);
    // Created earlier and unchecked since: its row is still there, so checking it again needs no second one.
    else if (created(t)) setUnchecked((u) => u.filter((x) => x !== t.id));
    else setEditing(t);
  };
  const skip = () => {
    skipScenarios();
    navigate(knowledgePath);
  };
  if (editing) {
    const empty = editing.form === scratch;
    const written = editing.title === manualEntry.title;
    const fill = () => setEditing({ ...editing, form: writtenScenario });
    return (
      <ScenarioForm
        start={editing.form}
        compact
        onTouch={empty ? fill : undefined}
        // A template's new row checks its card; a written one counts on Manual entry.
        onDone={() => setEditing(null)}
        frame={(form, submit) => (
          <SetupCard
            step="scenarios"
            title={editing.title}
            subtitle={written ? "Describe when it should trigger and how the agent handles it. You can edit it later." : "Review the ready-made steps, then create the scenario. You can edit it later."}
            footer={
              <>
                <div className="flex items-center gap-4">
                  <BackButton onClick={() => setEditing(null)} />
                  <LaterButton />
                </div>
                {/* On the empty form Create fills it in instead of submitting, like Continue on the persona. The
                    default is prevented because the fill re-renders this button as the submit before the click's
                    default action runs. */}
                <Button
                  {...(empty
                    ? {
                        type: "button" as const,
                        onClick: (e: MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault();
                          fill();
                        },
                      }
                    : { type: "submit" as const, ...submit })}
                >
                  Create scenario
                </Button>
              </>
            }
          >
            {form}
          </SetupCard>
        )}
      />
    );
  }
  return (
    <SetupCard
      step="scenarios"
      title="Scenarios"
      subtitle="Pick what your agent should handle. Your picks decide which policy questions we ask next."
      footer={
        <>
          <div className="flex items-center gap-4">
            <BackLink to={filledPath} />
            <LaterButton />
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
          <ContinueButton variant="default" to={knowledgePath} disabled={!picked.length && !written} onClick={() => saveScenarios(picked)}>
            Continue to knowledge
          </ContinueButton>
        </>
      }
    >
      <div className="px-6 py-5 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {templates.map((t) => (
            <ChoiceCard key={t.id} icon={t.icon} title={t.title} description={t.description} checked={picked.includes(t.id)} onClick={() => pick(t)} />
          ))}
          <ChoiceCard
            plain
            icon="pencil"
            title={manualEntry.title}
            description={written ? `${written} written so far. Add another.` : manualEntry.description}
            onClick={() => {
              setSkipping(false);
              setEditing({ title: manualEntry.title, form: scratch });
            }}
          />
        </div>
        <p className="text-sm text-gray-500">The complaint scenario hands the conversation to your team straight away.</p>
      </div>
    </SetupCard>
  );
}

/** The answers as they open: pre-filled from the chat history (content.ts), no reference yet. */
const historyKnowledge = (): Knowledge => ({ answers: Object.fromEntries(policies.map((p) => [p.key, p.answer])) as Knowledge["answers"], reference: null });

/**
 * Knowledge: opens filled in from the merchant's Helpdesk chat history, each answer citing the past
 * reply it came from (user decision 2026-10-04: the checklist no longer starts blank, so it has no
 * empty twin URL). The answers sit in local state, editable. Continue saves
 * each answered policy as a written knowledge source, the reference as a website or file source,
 * and moves to the test screen. With nothing asked (no scenario picked) Continue is always open.
 */
function KnowledgeStep() {
  const scenarios = useDemo((s) => s.scenarios);
  const [knowledge, setKnowledge] = useState(historyKnowledge);
  const asked = neededPolicies(scenarios.map((s) => s.name));
  const ready = asked.length === 0 || asked.some((p) => knowledge.answers[p.key].trim() !== "") || (knowledge.reference ?? "").trim() !== "";
  return (
    <SetupCard
      step="knowledge"
      title="Knowledge"
      subtitle="We filled these in from your Helpdesk chat history. Check them; short edits are fine."
      footer={
        <>
          <div className="flex items-center gap-4">
            <BackLink to={scenariosPath} />
            <LaterButton />
          </div>
          <ContinueButton variant="default" to={testPath} disabled={!ready} onClick={() => saveKnowledge(knowledge)}>
            Continue to test
          </ContinueButton>
        </>
      }
    >
      <div className="px-6 py-5">
        <KnowledgeForm asked={asked} value={knowledge} onChange={(patch) => setKnowledge((k) => ({ ...k, ...patch }))} />
      </div>
    </SetupCard>
  );
}

/**
 * Test: what the agent covers so far beside the AI Agent > Test chat to try it, in two columns so
 * nothing scrolls (user decision 2026-10-03: the test runs in the modal too). Continue marks the step
 * done and moves to the go-live screen.
 */
function TestStep() {
  return (
    <SetupCard
      step="test"
      title="Test"
      subtitle="Here's what your agent can handle so far. Try a conversation before anyone else can."
      footer={
        <>
          <div className="flex items-center gap-4">
            <BackLink to={knowledgePath} />
            <LaterButton />
          </div>
          <ContinueButton variant="default" to={livePath} onClick={markTested}>
            Continue to go live
          </ContinueButton>
        </>
      }
    >
      {/* One definite row, so the chat's full height resolves against it; the readiness card keeps its own. */}
      <div className="h-full px-6 py-5 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] grid-rows-[minmax(0,1fr)] gap-5">
        <div className="self-start">
          <Readiness />
        </div>
        {/* As tall as the body allows; the thread scrolls on its own, as on the Test page. */}
        <TestChat className="h-full" />
      </div>
    </SetupCard>
  );
}

/**
 * Go live: pick when the agent answers and the channel's share, see what publishing does, then go
 * live (user decision 2026-10-03: go live runs in the modal too). "When" is the flow template the
 * publish creates, the gallery's two "AI agent" templates (user decision 2026-10-04: a go-live
 * setting, not a step of its own). Nothing is stored until "Go live", which leaves the modal for
 * the end-of-demo page.
 */
function GoLiveStep() {
  const [share, setShare] = useState(useDemo((s) => s.agentShare));
  const [when, setWhen] = useState(useDemo((s) => s.flowTemplate));
  const flow = flowTemplate(when);
  const goLive = () => updateDemo((s) => ({ ...s, agentLive: true, agentShare: share, flowTemplate: when }));
  return (
    <SetupCard
      step="live"
      title="Go live"
      subtitle="Start small. The agent handles a share of new conversations; your team sees the rest as usual."
      footer={
        <>
          <div className="flex items-center gap-4">
            <BackLink to={testPath} />
            <LaterButton />
          </div>
          <ContinueButton variant="default" to="/ai/setup/live/done" onClick={goLive}>
            Go live
          </ContinueButton>
        </>
      }
    >
      <div className="px-6 py-5 grid grid-cols-2 gap-5 items-start text-sm">
        <div className="space-y-5">
          <FormCard className={setupCard}>
            <h2 className={setupCardTitle}>Channel</h2>
            {/* The account row of the Test chat's account picker. */}
            <div className="text-gray-800 mt-3">
              <AccountLabel />
            </div>
            <p className="text-gray-500 mt-1">Chat Widget</p>
          </FormCard>
          <FormCard className={setupCard}>
            <h2 className={setupCardTitle}>When the agent answers</h2>
            <div role="radiogroup" aria-label="When the agent answers" className="flex gap-4 mt-3">
              {flowTemplates.map((t) => (
                <RadioCard key={t.id} checked={when === t.id} onSelect={() => setWhen(t.id)} detail={t.detail}>
                  {t.label}
                </RadioCard>
              ))}
            </div>
          </FormCard>
          <FormCard className={setupCard}>
            <h2 className={setupCardTitle}>Share of new conversations</h2>
            <div role="radiogroup" aria-label="Share of new conversations" className="flex gap-4 mt-3">
              {shares.map((s) => (
                <RadioCard key={s.value} checked={share === s.value} onSelect={() => setShare(s.value)}>
                  {s.label}
                </RadioCard>
              ))}
            </div>
            <p className="text-gray-500 mt-3">
              A wrong answer in the first week then affects one conversation in five, not every customer. We'll suggest widening after a week with
              no handoffs.
            </p>
          </FormCard>
        </div>
        <div className="space-y-5">
          <FormCard className={setupCard}>
            <h2 className={setupCardTitle}>What this publishes</h2>
            <p className="text-gray-500 mt-1">“{flow.name}”, a flow in Flow Builder. You can change it there later.</p>
            <ol aria-label="Flow blocks" className="mt-3 divide-y divide-gray-200 rounded-lg border border-gray-200">
              {flowBlocks(flow, share).map((b) => (
                <IconRow key={b.label} icon={b.icon} iconClassName={b.iconClassName} className="p-3">
                  <span className="font-medium">{b.label}</span>
                  <span className="text-gray-500">: {b.detail}</span>
                </IconRow>
              ))}
            </ol>
          </FormCard>
          <AiCallout role="note">Your team can take over any conversation at any time. {pauseNote}</AiCallout>
        </div>
      </div>
    </SetupCard>
  );
}
