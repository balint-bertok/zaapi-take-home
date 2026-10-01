import { Inert } from "@/components/Inert";
import { Icon, type IconName } from "@/icons/Icon";
import { asset } from "@/lib/asset";

// Strings from the catalog (common.navigation.integrationCTA, chats.noChatsConnected); markup from
// the saved tickets page. Each row leaves the app (demo booking, demo widget, integrations), none
// of which was captured, so the rows are inert.
const actions: [IconName, string][] = [
  ["play", "Watch a quick demo"],
  ["mobile", "Send a test message"],
  ["message", "Integrate messaging channels"],
];

const mutedChannels = [
  "facebook",
  "instagram",
  "line",
  "whatsapp",
  "lazada",
  "shopee",
  "tiktok-shop",
  "chat-widget",
  "gmail",
  "outlook",
];

/** The inbox's empty state before any channel is connected; fills the content card. */
export function GetStartedCard() {
  return (
    <div className="flex w-full h-(--height-page-content-with-banner)">
      <div className="flex w-full h-full gap-3 flex-col items-center justify-center">
        <div className="bg-gray-50 w-[472px] h-[292px] px-10 py-8 rounded-lg space-y-7 flex flex-col justify-center items-center">
          <h1 className="text-gray-800 text-xl font-semibold flex gap-2 items-center">
            <span className="inline-block">⚡️</span>
            Ready to get started?
          </h1>
          <ul className="space-y-4">
            {actions.map(([icon, label]) => (
              <li key={label} className="flex gap-2 items-center">
                <Icon name={icon} variant="fal" className="size-4! text-gray-500" />
                <Inert className="text-gray-500 text-sm font-medium hover:underline">{label}</Inert>
              </li>
            ))}
          </ul>
          <div className="flex gap-4 items-center flex-wrap">
            {mutedChannels.map((name) => (
              <img key={name} alt="" className="size-6" src={asset(`images/channels/muted/${name}.svg`)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
