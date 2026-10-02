// Stub from the guided-setup scaffold; the persona page agent replaces it.
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

export default function PersonaFilledPage() {
  return (
    <SetupPage
      step={1}
      title="Persona"
      footer={
        <>
          <BackLink to="/ai/setup" />
          <ContinueButton to="/ai/setup/scenarios" />
        </>
      }
    >
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
