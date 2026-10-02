import { useState } from "react";
import { Icon } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { updateDemo, useDemo } from "@/store/store";
import { FormCard, RadioCard } from "../ai/parts";
import { BackLink, ContinueButton, SetupPage } from "./SetupPage";

/** Share of new conversations the agent takes, as a percentage. */
const shares = [
  { value: 20, label: "1 in 5" },
  { value: 50, label: "Half" },
  { value: 100, label: "All" },
];

const card = "border border-gray-200";
const cardTitle = "text-base font-medium text-gray-800";

/** Step 5: pick the channel's share, then go live. Nothing is stored until "Go live". */
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
        <div className="flex items-center text-sm text-gray-800 mt-3">
          <div className="relative">
            <img alt="Test (Demo)" className="rounded-full object-cover size-[20px]" src={asset("images/default-chat-account.png")} />
            <div className="absolute -right-1 -bottom-1">
              <img alt="widget icon" className="size-[12px]" src={asset("images/channels/chat-widget.svg")} />
            </div>
          </div>
          <div className="ml-3 font-medium">Test (Demo)</div>
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

      {/* The AI Agent > Test page's callout. */}
      <div className="p-3.5 rounded-md text-sm border-l-4 bg-(image:--color-ai-gradient-light) border-electric-green-500" role="alert">
        <div className="flex flex-row gap-2">
          <div className="mt-[2px]">
            <Icon name="ai-symbol" className="size-5! ai-gradient-icon shrink-0" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="ai-gradient-text">
              Your team can take over any conversation at any time. Switching the agent off is one click on the AI Agent page.
            </div>
          </div>
        </div>
      </div>
    </SetupPage>
  );
}
