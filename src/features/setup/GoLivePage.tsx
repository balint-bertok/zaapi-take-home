// Stub from the guided-setup scaffold; the go-live page agent replaces it.
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

export default function GoLivePage() {
  return (
    <SetupPage
      step={5}
      title="Go live"
      footer={
        <>
          <BackLink to="/ai/setup/test" />
          <ContinueButton to="/ai/setup/live/done" />
        </>
      }
    >
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
