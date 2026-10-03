import { useState } from "react";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { updateDemo, useDemo } from "@/store/store";
import { FormCard, RadioCard } from "../ai/parts";
import { AccountLabel } from "../ai/TestChat";
import { flowBlocks, flowName, pauseNote, shares } from "./content";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

const card = "border border-gray-200";
const cardTitle = "text-base font-medium text-gray-800";

/** Step 5: pick the channel's share, see the flow this publishes, then go live. Nothing is stored until "Go live". */
export default function GoLivePage() {
  const stored = useDemo((s) => s.agentShare);
  const [share, setShare] = useState(stored);
  const goLive = () => updateDemo((s) => ({ ...s, agentLive: true, agentShare: share }));
  return (
    <SetupPage
      step={5}
      title="Go live"
      description="Start small. The agent handles a share of new conversations; your team sees the rest as usual."
      footer={
        <>
          <BackLink to="/ai/setup/test" />
          <ContinueButton to="/ai/setup/live/done" onClick={goLive}>
            Go live
          </ContinueButton>
        </>
      }
    >
      <FormCard className={card}>
        <h2 className={cardTitle}>Channel</h2>
        {/* The account row of the Test chat's account picker. */}
        <div className="text-sm text-gray-800 mt-3">
          <AccountLabel />
        </div>
        <p className="text-sm text-gray-500 mt-1">Chat Widget</p>
      </FormCard>

      <FormCard className={card}>
        <h2 className={cardTitle}>Share of new conversations</h2>
        <div role="radiogroup" aria-label="Share of new conversations" className="flex gap-4 mt-3">
          {shares.map((s) => (
            <RadioCard key={s.value} checked={share === s.value} onSelect={() => setShare(s.value)}>
              {s.label}
            </RadioCard>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-3">
          A wrong answer in the first week then affects one conversation in five, not every customer. We'll suggest widening after a week
          with no handoffs.
        </p>
      </FormCard>

      <FormCard className={card}>
        <h2 className={cardTitle}>What this publishes</h2>
        <p className="text-sm text-gray-500 mt-1">
          A flow in Flow Builder, "{flowName}". You can change it there later.
        </p>
        <ol aria-label="Flow blocks" className="mt-3 divide-y divide-gray-200 rounded-lg border border-gray-200">
          {flowBlocks(share).map((b) => (
            <li key={b.label} className="flex items-start gap-3 p-3 text-sm">
              <span className="flex items-center justify-center size-5 shrink-0">
                <Icon name={b.icon} className={cn("size-4!", b.icon === "ai-symbol" ? "ai-gradient-icon" : "text-gray-500")} />
              </span>
              <span className="text-gray-800">
                <span className="font-medium">{b.label}</span>
                <span className="text-gray-500">: {b.detail}</span>
              </span>
            </li>
          ))}
        </ol>
      </FormCard>

      {/* The AI Agent > Test page's callout. */}
      <div className="p-3.5 rounded-md text-sm border-l-4 bg-(image:--color-ai-gradient-light) border-electric-green-500" role="alert">
        <div className="flex flex-row gap-2">
          <div className="mt-[2px]">
            <Icon name="ai-symbol" className="size-5! ai-gradient-icon shrink-0" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="ai-gradient-text">Your team can take over any conversation at any time. {pauseNote}</div>
          </div>
        </div>
      </div>
    </SetupPage>
  );
}
