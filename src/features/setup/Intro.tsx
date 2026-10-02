import { asset } from "@/lib/asset";
import { useDemo } from "@/store/store";
import { setupSteps } from "./content";

// What the setup's welcome shows, on the page behind the modal and in the modal itself.

/** The chat account as the AI Agent test chat labels it: avatar with the channel badge. */
export function ChannelRow() {
  const channel = useDemo((s) => s.integrations[0]);
  return (
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
  );
}

/** The five steps ahead, numbered. */
export function StepsAhead() {
  return (
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
  );
}
