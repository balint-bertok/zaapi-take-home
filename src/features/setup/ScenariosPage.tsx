// Stub from the guided-setup scaffold; the scenarios page agent replaces it.
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

export default function ScenariosPage() {
  return (
    <SetupPage
      step={2}
      title="Scenarios"
      footer={
        <>
          <BackLink to="/ai/setup/persona" />
          <ContinueButton to="/ai/setup/knowledge" />
        </>
      }
    >
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
