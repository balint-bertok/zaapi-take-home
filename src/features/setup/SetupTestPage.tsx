// Stub from the guided-setup scaffold; the test page agent replaces it.
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

export default function SetupTestPage() {
  return (
    <SetupPage
      step={4}
      title="Test"
      footer={
        <>
          <BackLink to="/ai/setup/knowledge" />
          <ContinueButton to="/ai/setup/live" />
        </>
      }
    >
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
