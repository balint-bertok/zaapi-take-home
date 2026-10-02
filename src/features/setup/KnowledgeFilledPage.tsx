// Stub from the guided-setup scaffold; the knowledge page agent replaces it.
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

export default function KnowledgeFilledPage() {
  return (
    <SetupPage
      step={3}
      title="Knowledge"
      footer={
        <>
          <BackLink to="/ai/setup/scenarios" />
          <ContinueButton to="/ai/setup/test" />
        </>
      }
    >
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
