import { Link } from "react-router";
import { Inert } from "@/components/Inert";
import { Tooltip } from "@/components/ui/tooltip";
import { Icon, type IconName } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import { sectionHome, type SectionKey } from "./sections";

type RailItem = { label: string; icon: IconName; section?: SectionKey };

const button =
  "gap-x-2 whitespace-nowrap text-sm ease-(--ease-out-quart) duration-300 active:scale-[0.98] focus-visible:outline-0 focus-visible:ring-1 focus-visible:ring-gray-300 relative hover:bg-sidebar-accent flex items-center justify-center size-9 rounded-md transition-colors";
const divider = <div className="w-8 h-px bg-gray-200 my-3" />;

// Order, labels and icon styles from the saved markup. Only captured sections navigate.
const top: RailItem[] = [
  { label: "Notifications", icon: "bell" },
  { label: "Search", icon: "magnifying-glass" },
];
const main: RailItem[] = [
  { label: "Tickets", icon: "message-dots", section: "tickets" },
  { label: "AI Agent", icon: "ai-symbol", section: "ai" },
  { label: "Analytics", icon: "chart-line" },
  { label: "Automations", icon: "bolt", section: "automations" },
  { label: "Broadcast", icon: "bullhorn" },
  { label: "Contacts", icon: "user-group" },
  { label: "Settings", icon: "gear", section: "settings" },
];

// Demo tour: until the first AI Agent is live, AI Agent leads into the guided setup and every other
// section but Tickets is inert; the dashboard opens up once the agent goes live.
function railTarget(section: SectionKey | undefined, agentLive: boolean) {
  if (!section || agentLive || section === "tickets") return section && sectionHome(section);
  return section === "ai" ? "/ai/setup" : undefined;
}

function RailButton({ item, current }: { item: RailItem; current?: SectionKey }) {
  const agentLive = useDemo((s) => s.agentLive);
  const to = railTarget(item.section, agentLive);
  const active = !!item.section && item.section === current;
  // The active entry switches to the solid glyph, as on app.zaapi.com (ai-symbol has only one).
  const icon = (
    <Icon
      name={item.icon}
      variant={active ? "fas" : undefined}
      className={cn("size-4.5!", active ? "text-gray-500" : "text-gray-400")}
    />
  );
  const className = cn(button, active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "bg-transparent");
  return (
    <Tooltip content={item.label} side="right" plain>
      {to ? (
        <Link to={to} aria-label={item.label} className={className}>
          {icon}
        </Link>
      ) : (
        <Inert aria-label={item.label} className={className}>
          {icon}
        </Inert>
      )}
    </Tooltip>
  );
}

/** The 56px icon rail on the left of every section page. */
export function Rail({ section }: { section: SectionKey }) {
  const workspace = useDemo((s) => s.workspace.name);
  return (
    <nav
      aria-label="Main"
      className="fixed inset-y-0 left-0 z-30 flex flex-col items-center bg-sidebar border-gray-200 py-3 gap-2 h-(--height-page-content-with-banner) top-(--banner-height) border-r w-[56px]"
    >
      <Tooltip content={workspace} side="right" plain>
        <Inert
          aria-label={`Store: ${workspace}`}
          className="flex items-center justify-center size-9 rounded-lg hover:bg-gray-200 shrink-0 mb-1"
        >
          <Icon name="buildings" variant="fas" className="size-5 text-gray-400" />
        </Inert>
      </Tooltip>
      <RailButton item={{ label: "Toggle sidebar (⌘B)", icon: "sidebar" }} />
      {divider}
      <div className="space-y-3">
        {top.map((item) => (
          <RailButton key={item.label} item={item} />
        ))}
        {divider}
      </div>
      <div className="flex flex-col items-center gap-4 flex-1 overflow-y-auto overflow-x-hidden">
        {main.map((item) => (
          <RailButton key={item.label} item={item} current={section} />
        ))}
      </div>
      <RailButton item={{ label: "Live Chat Support", icon: "circle-question" }} />
    </nav>
  );
}
