// Stub from the guided-setup scaffold; the intro page agent replaces it.
import { ContinueButton, SetupPage } from "./SetupPage";

export default function IntroPage() {
  return (
    <SetupPage
      step={0}
      title="Set up your first AI Agent"
      footer={
        <>
          {/* Nothing to go back to: the empty span keeps Start on the right. */}
          <span />
          <ContinueButton to="/ai/setup/persona">Start</ContinueButton>
        </>
      }
    >
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
