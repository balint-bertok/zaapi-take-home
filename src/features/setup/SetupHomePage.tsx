import { useDemo } from "@/store/store";
import { FormCard } from "../ai/parts";
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
  const [to, label] = !setupDone.includes("persona")
    ? ["/ai/setup/persona", "Start"]
    : !setupDone.includes("scenarios")
      ? ["/ai/setup/scenarios", "Continue with scenarios"]
      : !setupDone.includes("knowledge")
        ? ["/ai/setup/knowledge", "Continue with knowledge"]
        : ["/ai/setup/test", "Continue to test"];
  return (
    <SetupPage
      step={0}
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
