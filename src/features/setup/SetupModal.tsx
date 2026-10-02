import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import { ModalTour, StepCard } from "../auth/onboarding/ModalTour";
import { ChoiceCard } from "../ai/AddScenarioSheet";
import { templates } from "../ai/scenarioTemplates";
import { personaSuggestion, setupSteps, skipConsequence, type Language } from "./content";
import { ChannelRow, StepsAhead } from "./Intro";
import { PersonaForm, type Persona } from "./PersonaForm";
import { savePersona, saveScenarios, skipScenarios } from "./save";
import { BackLink } from "./SetupPage";

// The setup's first three screens, in the inbox onboarding's modal frame, over the setup page.
// Copy is not from the catalog (see content.ts).

const personaPath = "/ai/setup/persona";
const filledPath = "/ai/setup/persona/filled";
const screens: Record<string, "welcome" | "persona" | "scenarios"> = {
  "/ai/setup": "welcome",
  [personaPath]: "persona",
  [filledPath]: "persona",
  "/ai/setup/scenarios": "scenarios",
};

const footer = "border-t bg-gray-50 px-6 py-3 flex justify-between items-center gap-4";
const sectionTitle = "text-base font-medium text-gray-800";
const counter = (step: number) => `Step ${step} of ${setupSteps.length}`;

// The screens open with the card itself focused: Radix would focus the first field, and focusing
// a persona field fills the form in.
const focusCard = (e: Event) => {
  e.preventDefault();
  (e.target as HTMLElement).focus();
};

/**
 * Shown on the welcome, persona and scenarios URLs; on the welcome alone, "Do it later" keeps it
 * closed. Mounted once by SetupShell, so it survives moving between its screens.
 */
export function SetupModal() {
  const { pathname } = useLocation();
  const dismissed = useDemo((s) => s.setupModalDismissed);
  const screen = screens[pathname];
  if (!screen || (screen === "welcome" && dismissed)) return null;
  if (screen === "welcome") return (
      <ModalTour>
        <WelcomeStep />
      </ModalTour>
    );
  if (screen === "persona")
    return (
      <ModalTour counter={counter(1)}>
        <PersonaStep filled={pathname === filledPath} />
      </ModalTour>
    );
  return (
    <ModalTour counter={counter(2)}>
      <ScenariosStep />
    </ModalTour>
  );
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

/** The inbox onboarding's dark Continue as a link; disabled, a dimmed button that does nothing. */
function NextLink({ to, disabled, onClick, children }: { to: string; disabled?: boolean; onClick?: () => void; children: ReactNode }) {
  if (disabled)
    return (
      <button type="button" disabled className={cn(buttonClass("default"), "opacity-50 pointer-events-none")}>
        {children}
      </button>
    );
  return (
    <Link to={to} onClick={onClick} className={buttonClass("default")}>
      {children}
    </Link>
  );
}

function WelcomeStep() {
  return (
    <StepCard
      width="w-[668px]"
      title="Set up your first AI Agent"
      subtitle="Five short steps, then your agent answers customers on one channel."
      onOpenAutoFocus={focusCard}
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
        <NextLink to={personaPath}>Start</NextLink>
      </div>
    </StepCard>
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
  const location = useLocation();
  // A language picked on the empty form arrives as navigation state and wins over the suggestion.
  const picked = (location.state as Pick<Persona, "language"> | null)?.language ?? undefined;
  const [persona, setPersona] = useState<Persona>(() => suggestion(picked));
  // Reset during render when the filled URL is entered again (a new history entry has a new key).
  const [shownKey, setShownKey] = useState(location.key);
  if (shownKey !== location.key) {
    setShownKey(location.key);
    if (filled) setPersona(suggestion(picked));
  }
  const fill = (patch?: Partial<Persona>) => navigate(filledPath, { state: patch?.language ? { language: patch.language } : undefined });
  const name = persona.name.trim();
  return (
    <StepCard
      width="w-[668px]"
      title="Persona"
      subtitle="Name your agent and decide how it sounds. Language defaults to what your customers write in."
      onOpenAutoFocus={focusCard}
    >
      <div className="px-6 py-5">
        {filled ? (
          <PersonaForm compact value={persona} onChange={(patch) => setPersona((p) => ({ ...p, ...patch }))} />
        ) : (
          <PersonaForm compact value={empty} onChange={fill} onFocus={() => fill()} />
        )}
      </div>
      <div className={footer}>
        <div className="flex items-center gap-4">
          {/* After "Do it later" the welcome stays closed, so Back lands on the page Start came from. */}
          <BackLink to="/ai/setup" />
          <LaterButton />
        </div>
        <NextLink to="/ai/setup/scenarios" disabled={!filled || !name} onClick={() => savePersona(persona)}>
          Continue
        </NextLink>
      </div>
    </StepCard>
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
    navigate("/ai/setup/knowledge");
  };
  return (
    <StepCard
      width="w-[668px]"
      title="Scenarios"
      subtitle="Pick what your agent should handle. Each one comes with ready-made steps you can edit later."
      onOpenAutoFocus={focusCard}
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
        <NextLink to="/ai/setup/knowledge" disabled={!picked.length} onClick={() => saveScenarios(picked)}>
          Continue to knowledge
        </NextLink>
      </div>
    </StepCard>
  );
}
