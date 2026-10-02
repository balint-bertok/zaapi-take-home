import { Link } from "react-router";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { useDemo } from "@/store/store";
import { shares } from "./content";
import { SetupPage } from "./SetupPage";

/** After "Go live": what the agent now does, and the way out into the opened dashboard. */
export default function LiveDonePage() {
  // Opened by URL before going live, the page describes the seeded share.
  const share = useDemo((s) => s.agentShare);
  const label = (shares.find((s) => s.value === share) ?? shares[0]).label.toLowerCase();
  return (
    <SetupPage step={5} title="Your agent is live">
      <div className="flex flex-col items-center text-center gap-4 py-10">
        <div className="size-16 rounded-full bg-(image:--color-ai-gradient-light) flex items-center justify-center">
          <Icon name="ai-symbol" className="ai-gradient-icon size-7!" />
        </div>
        <h2 className="text-lg font-medium text-gray-800">Live on Test (Demo)</h2>
        <p className="text-sm text-gray-500 max-w-[480px]">
          Your agent is answering {label} of new conversations on Chat Widget. We'll suggest widening to all of them after a week with no
          handoffs. Everything it knows is in the AI Agent pages, and the rest of the dashboard is now open.
        </p>
        <div className="flex gap-3">
          <Link to="/tickets" className={buttonClass("ai")}>
            Go to inbox
          </Link>
          <Link to="/ai/train/scenario-handling" className={buttonClass("outline")}>
            See your scenarios
          </Link>
        </div>
      </div>
    </SetupPage>
  );
}
