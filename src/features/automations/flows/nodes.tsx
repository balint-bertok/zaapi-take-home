import { Handle, Position, useNodeConnections, type Node, type NodeProps } from "@xyflow/react";
import type { ReactNode } from "react";
import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Popover, PopoverContent, PopoverTrigger } from "@/components/ui/menu";
import { Icon, type IconName } from "@/icons/Icon";
import { asset } from "@/lib/asset";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import type { FlowNodeData } from "../fixtures";
import { CheckItem, CheckMark } from "./Checkbox";
import { toggleIn } from "./shared";
import { editFlow } from "./model";

// The four node types of the saved builder page, markup and class lists copied from it. Settings
// live in the store (flow.nodes[].data); React Flow only carries position and the flow id.

export type CanvasNode = Node<{ flowId: string }>;

const empty: FlowNodeData = {};

function useNodeData(flowId: string, nodeId: string) {
  const data = useDemo((s) => s.flows.find((f) => f.id === flowId)?.nodes.find((n) => n.id === nodeId)?.data);
  const set = (patch: FlowNodeData) =>
    editFlow(flowId, (f) => ({ nodes: f.nodes.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n)) }));
  return [data ?? empty, set] as const;
}

const accents = {
  trigger: { bar: "border-electric-green-500", hover: "hover:border-electric-green-500 active:border-electric-green-500", title: "text-electric-green-600" },
  action: { bar: "border-indigo-500", hover: "hover:border-indigo-500 active:border-indigo-500", title: "text-indigo-600" },
  ai: { bar: "border-indigo-500", hover: "hover:border-indigo-500 active:border-indigo-500", title: "ai-gradient-text" },
};

type ShellProps = {
  accent: keyof typeof accents;
  tile: ReactNode;
  title: string;
  description: string;
  /** The trigger has the Start pill instead of an incoming handle. */
  start?: boolean;
  children: ReactNode;
};

function NodeShell({ accent, tile, title, description, start, children }: ShellProps) {
  const a = accents[accent];
  return (
    <div role="button" className={cn("group/node border border-gray-200 rounded-lg bg-white text-sm shadow-sm w-[320px] transition-all duration-200", a.hover)}>
      <div className="border-b border-gray-200 py-3">
        <div className="pr-3 flex gap-3">
          <div>
            <div className={cn("flex pl-3 border-l-4", a.bar, !start && "relative")}>
              {tile}
              {start ? (
                <div className={cn(buttonClass(), "pointer-events-none bg-electric-green-500 mt-4 absolute top-0 -left-24 w-fit")}>
                  <Icon name="flag-swallowtail" variant="fal" className="size-4 text-white mt-0.5" />
                  Start
                </div>
              ) : (
                <Handle type="target" position={Position.Left} className="size-3! invisible" />
              )}
            </div>
          </div>
          <div className="space-y-1 text-left flex-1 min-w-0">
            <h4 className={cn("font-medium truncate", a.title)}>{title}</h4>
            <p className="text-gray-500">{description}</p>
          </div>
        </div>
      </div>
      {children}
      <div className="cursor-default absolute flex justify-center items-center -top-12 pb-4 w-full opacity-0 pointer-events-none group-hover/node:opacity-100 group-hover/node:pointer-events-auto transition-opacity duration-150">
        <div className="w-fit border bg-white p-1 border-gray-200 rounded-lg flex justify-center items-center">
          <Inert aria-label="Duplicate" className={cn(buttonClass("ghost"), "size-8 rounded-sm text-gray-600")}>
            <Icon name="clone" className="size-4" />
          </Inert>
          <Inert aria-label="Delete" className={cn(buttonClass("ghost"), "size-8 rounded-sm text-gray-600 hover:text-error-600")}>
            <Icon name="trash" className="size-4" />
          </Inert>
        </div>
      </div>
    </div>
  );
}

function Tile({ icon, tone }: { icon: IconName; tone: "green" | "indigo" | "ai" }) {
  const bg = { green: "bg-electric-green-50", indigo: "bg-indigo-50", ai: "ai-gradient-light-bg" }[tone];
  const fg = { green: "size-5! text-electric-green-500", indigo: "size-5! text-indigo-500", ai: "size-6! ai-gradient-icon" }[tone];
  return (
    <div className={cn("shrink-0 size-11 flex items-center justify-center rounded-lg", bg)}>
      <Icon name={icon} variant="fas" className={fg} />
    </div>
  );
}

/** "Then, do the following ○": a right-aligned label with the outgoing handle on the node edge. */
function Outlet({ label, id, className }: { label: string; id?: string; className: string }) {
  const connected = useNodeConnections({ handleType: "source", handleId: id }).length > 0;
  return (
    <div className={cn("relative text-right", className)}>
      <span className="mr-4 text-gray-600">{label}</span>
      <Handle
        type="source"
        position={Position.Right}
        id={id}
        className={cn("size-3! border! border-gray-400! hover:size-5! transition-all duration-200", connected ? "bg-gray-300!" : "bg-gray-50!")}
      />
    </div>
  );
}

const field = "px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg min-h-10 text-left w-full nodrag nopan cursor-pointer";

export function MessageReceivedNode({ id, data }: NodeProps<CanvasNode>) {
  const [settings, set] = useNodeData(data.flowId, id);
  const integrations = useDemo((s) => s.integrations);
  const selected = settings.integrationIds ?? [];

  return (
    <NodeShell
      accent="trigger"
      start
      tile={<Tile icon="message-arrow-down" tone="green" />}
      title="Message received"
      description="When customer sends you a new message."
    >
      <div className="px-3 pt-3 mb-4 space-y-1">
        <label className="font-medium text-gray-800 block">Messaging channels</label>
        <Popover>
          <PopoverTrigger className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center gap-4 nodrag nopan cursor-pointer">
            <div className="flex">
              <div className="rounded-full border border-white -mr-2">
                <img alt="widget icon" src={asset("images/channels/chat-widget.svg")} className="size-5" />
              </div>
            </div>
            <span className="text-gray-400">
              {selected.length === 0
                ? "Select integrations"
                : `${selected.length} ${selected.length === 1 ? "integration" : "integrations"}`}
            </span>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-[296px] p-1">
            {integrations.map((i) => (
              <CheckItem key={i.id} checked={selected.includes(i.id)} onToggle={() => set({ integrationIds: toggleIn(selected, i.id) })}>
                <img alt="widget icon" src={asset("images/channels/chat-widget.svg")} className="size-5" />
                {i.name}
              </CheckItem>
            ))}
          </PopoverContent>
        </Popover>
      </div>
      <Outlet label="Then, do the following" className="mb-4" />
    </NodeShell>
  );
}

export function LetAiReplyNode() {
  return (
    <NodeShell
      accent="ai"
      tile={<Tile icon="ai-symbol" tone="ai" />}
      title="Let AI reply"
      description="Let the AI Agent respond to the customer."
    >
      <Outlet label="If no customer response after 1 hours" id="ai-chatbot-timeout" className="py-3" />
      <Outlet label="When AI agent cannot handle effectively" id="ai-chatbot-escalate" className="pb-3" />
    </NodeShell>
  );
}

export function CloseTicketNode() {
  return (
    <NodeShell
      accent="action"
      tile={<Tile icon="circle-check" tone="indigo" />}
      title="Close ticket"
      description="Automatically close the ticket"
    >
      <Outlet label="Then, do the following" className="py-3" />
    </NodeShell>
  );
}

const outsideHours = {
  stop: "Stop assignment outside of working hours",
  continue: "Continue assigning outside working hours",
} as const;
const preferences = {
  prioritizeLastAssigned: "Prioritize Last Assigned Agent",
  roundRobinOnly: "Use Round Robin Only",
} as const;

export function AssignToNode({ id, data }: NodeProps<CanvasNode>) {
  const [settings, set] = useNodeData(data.flowId, id);
  const user = useDemo((s) => s.user);
  const assigned = settings.assigneeIds ?? [];
  const isAssigned = assigned.includes(user.id);

  return (
    <NodeShell accent="action" tile={<Tile icon="user-plus" tone="indigo" />} title="Assign to" description="Assign to agent">
      <div className="px-3 pt-3 space-y-4">
        <div className="space-y-1 text-left">
          <label className="text-gray-800 font-medium block">Assign to</label>
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(field, "space-y-2 block")} aria-label="Assign to">
              {isAssigned && (
                <span className="flex gap-x-2 items-center h-8">
                  <Avatar initial={user.name[0]} />
                  <span className="text-sm leading-4 text-gray-800">{user.name}</span>
                  <Icon name="clock" className="min-w-4 h-4 text-gray-400" />
                </span>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[296px] p-1">
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  set({ assigneeIds: isAssigned ? [] : [user.id] });
                }}
              >
                <CheckMark checked={isAssigned} />
                <Avatar initial={user.name[0]} />
                {user.name}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Choice
          label="Assignment logic for tickets outside agents' working hours"
          options={outsideHours}
          value={settings.outsideHours ?? "stop"}
          onChange={(v) => set({ outsideHours: v })}
        />
        <Choice
          label="Assignment preference"
          options={preferences}
          value={settings.preference ?? "prioritizeLastAssigned"}
          onChange={(v) => set({ preference: v })}
        />
      </div>
      <Outlet label="Then, do the following" className="py-3" />
    </NodeShell>
  );
}

function Choice<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Record<K, string>;
  value: K;
  onChange: (v: K) => void;
}) {
  return (
    <div className="space-y-1 text-left">
      <label className="text-gray-800 font-medium block">{label}</label>
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(field, "text-gray-400 whitespace-pre-line block")}>{options[value]}</DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[296px] p-1">
          {(Object.keys(options) as K[]).map((k) => (
            <DropdownMenuItem key={k} onSelect={() => onChange(k)} className="justify-between">
              {options[k]}
              {k === value && <Icon name="check" className="size-4 text-gray-800" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** The app's initial avatar (gray-500 disc, white initial) at the node's 24px size. */
export function Avatar({ initial, size = 24 }: { initial: string; size?: number }) {
  return (
    <span
      className="relative flex items-center justify-center rounded-full select-none shrink-0 bg-gray-500"
      style={{ width: size, height: size }}
    >
      <span className={cn("text-white", size > 16 ? "text-[12px]" : "font-medium text-sm")}>{initial}</span>
    </span>
  );
}
