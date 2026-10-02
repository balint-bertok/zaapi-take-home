import { asset } from "@/lib/asset";
import { useDemo } from "@/store/store";
import { FormCard } from "../ai/parts";
import { setupSteps } from "./content";
import { ContinueButton, SetupPage } from "./SetupPage";

/** Step 0: which channel the agent starts on, and the five steps ahead. */
export default function IntroPage() {
  const channel = useDemo((s) => s.integrations[0]);
  return (
    <SetupPage
      step={0}
      title="Set up your first AI Agent"
      description="Five short steps, then your agent answers customers on one channel. You can stop and come back; progress is saved."
      footer={
        <>
          {/* Nothing to go back to: the empty span keeps Start on the right. */}
          <span />
          <ContinueButton to="/ai/setup/persona">Start</ContinueButton>
        </>
      }
    >
      <div className="space-y-5 text-sm">
        <FormCard className="border border-gray-200 space-y-3">
          <h2 className="text-base font-medium text-gray-800">Channel</h2>
          {/* The chat account as the AI Agent test chat labels it: avatar with the channel badge. */}
          <div className="flex items-center">
            <div className="relative shrink-0">
              <img alt={channel.name} className="rounded-full object-cover size-[20px]" src={asset("images/default-chat-account.png")} />
              <div className="absolute -right-1 -bottom-1">
                <img alt="widget icon" className="size-[12px]" src={asset(`images/channels/${channel.channel}.svg`)} />
              </div>
            </div>
            <div className="ml-3">
              <div className="font-medium text-gray-800">{channel.name}</div>
              <div className="text-gray-500">Pre-selected from the channel you already connected.</div>
            </div>
          </div>
        </FormCard>

        <FormCard className="border border-gray-200 space-y-3">
          <h2 className="text-base font-medium text-gray-800">What's ahead</h2>
          <ol className="space-y-3">
            {setupSteps.map((s, i) => (
              <li key={s.label} className="flex gap-3">
                <span className="size-6 shrink-0 rounded-full bg-gray-100 text-xs font-medium text-gray-600 flex items-center justify-center">{i + 1}</span>
                <div>
                  <div className="font-medium text-gray-800">{s.label}</div>
                  <div className="text-gray-500">{s.text}</div>
                </div>
              </li>
            ))}
          </ol>
        </FormCard>
      </div>
    </SetupPage>
  );
}
