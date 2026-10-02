import { useDemo } from "@/store/store";
import { FormCard } from "../ai/parts";
import { setupSteps } from "./content";
import { ChannelRow, StepsAhead } from "./Intro";
import { ContinueButton, SetupPage } from "./SetupPage";

const card = "border border-gray-200 space-y-3";
const cardTitle = "text-base font-medium text-gray-800";

/**
 * The page behind the setup modal, on the welcome, persona, scenarios and knowledge URLs alike:
 * which channel the agent starts on, and the five steps ahead. Its button leads to the first step not done.
 * After "Do it later" closed the modal, Start and the "Continue with" buttons open it again: the modal
 * shows on those URLs whatever the flag says, so nothing here needs to clear it.
 */
export default function SetupHomePage() {
  const setupDone = useDemo((s) => s.setupDone);
  const next = setupSteps.find((s) => s.step && s.step !== "test" && !setupDone.includes(s.step));
  const [to, label] = !next
    ? ["/ai/setup/test", "Continue to test"]
    : next === setupSteps[0]
      ? [next.to, "Start"]
      : [next.to, `Continue with ${next.label.toLowerCase()}`];
  return (
    <SetupPage
      title="Set up your first AI Agent"
      description="Five short steps, then your agent answers customers on one channel. You can stop and come back; progress is saved."
      footer={
        <>
          {/* Nothing to go back to: the empty span keeps the button on the right. */}
          <span />
          <ContinueButton to={to}>{label}</ContinueButton>
        </>
      }
    >
      <div className="space-y-5 text-sm">
        <FormCard className={card}>
          <h2 className={cardTitle}>Channel</h2>
          <ChannelRow />
        </FormCard>
        <FormCard className={card}>
          <h2 className={cardTitle}>What's ahead</h2>
          <StepsAhead />
        </FormCard>
      </div>
    </SetupPage>
  );
}
