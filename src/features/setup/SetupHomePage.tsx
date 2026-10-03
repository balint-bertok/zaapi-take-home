import { FormCard } from "../ai/parts";
import { setupSteps } from "./content";
import { ChannelRow, StepsAhead } from "./Intro";
import { ContinueButton, SetupPage } from "./SetupPage";

const card = "border border-gray-200 space-y-3";
const cardTitle = "text-base font-medium text-gray-800";

/**
 * The page behind the setup modal, on the welcome, persona, scenarios and knowledge URLs alike:
 * which channel the agent starts on, and the five steps ahead. The modal cannot be left ("Finish
 * later" is inert), so the page is only ever its backdrop and its Start button is never reached.
 */
export default function SetupHomePage() {
  return (
    <SetupPage
      title="Set up your first AI Agent"
      description="Five short steps, then your agent answers customers on one channel."
      footer={
        <>
          {/* Nothing to go back to: the empty span keeps the button on the right. */}
          <span />
          <ContinueButton to={setupSteps[0].to}>Start</ContinueButton>
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
