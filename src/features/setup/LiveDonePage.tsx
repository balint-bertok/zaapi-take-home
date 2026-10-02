// Stub from the guided-setup scaffold; the go-live page agent replaces it.
import { SetupPage } from "./SetupPage";

export default function LiveDonePage() {
  return (
    <SetupPage step={5} title="Your agent is live">
      <p className="text-sm text-gray-500">Coming in this PR.</p>
    </SetupPage>
  );
}
