import { Panel } from "@xyflow/react";
import { useState, type ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/menu";
import { Switch } from "@/components/ui/switch";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import type { FlowVersion } from "../fixtures";
import { smallSwitch } from "./shared";
import { versionTime } from "./model";
import { Avatar } from "./nodes";
import { StatusBadge } from "./StatusBadge";

export type SidePanelKey = "history" | "logs";

/** A 380px panel that slides in from the right under the top bar, as in the saved builder page. */
function SidePanel({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Panel
      position="top-right"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        "m-0! pt-[calc(var(--workflow-top-control-panel-height)-1px)] h-full transition-all duration-200",
        open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0",
      )}
      style={{ width: 380 }}
    >
      <div className="w-full h-full border-l border-t border-gray-200 bg-white text-sm flex flex-col">
        <div className="p-4 flex items-center justify-between gap-4 border-b border-gray-200 shrink-0">
          <span className="font-medium">{title}</span>
          <button type="button" aria-label="Close" onClick={onClose} className="cursor-pointer">
            <Icon name="xmark" variant="fal" className="size-4 text-gray-800" />
          </button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">{children}</div>
      </div>
    </Panel>
  );
}

export function SidePanels({ open, versions, onClose }: { open: SidePanelKey | null; versions: FlowVersion[]; onClose: () => void }) {
  return (
    <>
      <SidePanel open={open === "history"} title="Version history" onClose={onClose}>
        <VersionHistory versions={versions} />
      </SidePanel>
      <SidePanel open={open === "logs"} title="Automation logs" onClose={onClose}>
        <AutomationLogs />
      </SidePanel>
    </>
  );
}

function VersionHistory({ versions }: { versions: FlowVersion[] }) {
  const user = useDemo((s) => s.user.name);
  return (
    <div className="p-4 space-y-3">
      <p className="text-gray-500">Sorted by the most recent versions.</p>
      <ul className="space-y-4 relative z-0">
        <div className="absolute left-2.5 top-10 bottom-10 w-px bg-gray-200 -z-10" />
        {versions.map((v, i) => {
          const body = (
            <>
              <div className="flex items-center justify-between gap-3">
                <span className="text-gray-600">{versionTime(v.at)}</span>
                <StatusBadge status={v.status} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex gap-x-2 items-center">
                  <Avatar initial={v.by[0]} size={16} />
                  <span className="font-semibold text-gray-800">{v.by}</span>
                  {v.by === user && <span className="text-gray-400">(You)</span>}
                </div>
              </div>
            </>
          );
          const card = "w-full hover:bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 text-left";
          return (
            <li key={v.at + v.status}>
              <div className="flex gap-4 items-center">
                <div className="size-5 shrink-0 bg-white rounded-full flex items-center justify-center border-2 border-dashed border-gray-200" />
                {/* The newest entry is the version on the canvas; older ones open a preview that was not captured. */}
                {i === 0 ? (
                  <div className={cn(card, "bg-gray-50")}>{body}</div>
                ) : (
                  <Inert className={card}>{body}</Inert>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const runStatuses = ["All Status", "Completed", "Failed", "Waiting", "Waiting for reply", "AI handling"];

function AutomationLogs() {
  const [status, setStatus] = useState(runStatuses[0]);
  const [unlinkedOnly, setUnlinkedOnly] = useState(false);
  return (
    <div className="p-4 space-y-6">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-10 w-full items-center justify-between text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-300 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer">
          <span>{status}</span>
          <Icon name="chevron-down" className="h-4 w-4 text-gray-800! ml-1" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-(--radix-dropdown-menu-trigger-width) p-1">
          {runStatuses.map((s) => (
            <DropdownMenuItem key={s} onSelect={() => setStatus(s)} className="justify-between">
              {s}
              {s === status && <Icon name="check" className="size-4 text-gray-800" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="flex items-center gap-3">
        <Switch
          id="noConversationOnly"
          checked={unlinkedOnly}
          onCheckedChange={setUnlinkedOnly}
          {...smallSwitch}
        />
        <label htmlFor="noConversationOnly" className="text-sm text-gray-800 font-medium">
          Only runs not linked to a conversation
        </label>
      </div>
      <p className="text-sm text-gray-500 text-center pt-4">No data</p>
    </div>
  );
}
