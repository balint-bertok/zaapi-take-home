import "@xyflow/react/dist/style.css";
import "./flow-builder.css";
import {
  Background,
  BackgroundVariant,
  MarkerType,
  MiniMap,
  Panel,
  ReactFlow,
  useNodesState,
  useReactFlow,
  useStore,
  type Connection,
  type Edge,
} from "@xyflow/react";
import { useMemo, useRef, useState } from "react";
import { Inert } from "@/components/Inert";
import { buttonClass } from "@/components/ui/button";
import { Icon, type IconName } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import type { Flow } from "../fixtures";
import { editFlow } from "./model";
import { AssignToNode, CloseTicketNode, LetAiReplyNode, MessageReceivedNode, type CanvasNode } from "./nodes";
import { SidePanels, type SidePanelKey } from "./SidePanels";
import { TopBar } from "./TopBar";

const nodeTypes = {
  message_received: MessageReceivedNode,
  chatbot: LetAiReplyNode,
  close_chat: CloseTicketNode,
  chat_assign: AssignToNode,
};

// The saved builder page's viewport at 1440 wide: the "94%" in the zoom control.
const initialViewport = { x: 143, y: 144.144, zoom: 0.935099 };
const marker = { type: MarkerType.Arrow, width: 24, height: 24 };
const proOptions = { hideAttribution: true };

type Positions = Record<string, { x: number; y: number }>;

/** The React Flow canvas with the builder's panels. Node positions persist to the store on drop. */
export function FlowCanvas({ flow }: { flow: Flow }) {
  const [initialNodes] = useState<CanvasNode[]>(() =>
    flow.nodes.map((n) => ({ id: n.id, type: n.type, position: n.position, data: { flowId: flow.id } })),
  );
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const edges = useMemo<Edge[]>(() => flow.edges.map((e) => ({ ...e, markerEnd: marker })), [flow.edges]);
  const [panel, setPanel] = useState<SidePanelKey | null>(null);

  // Undo/redo of node moves (connections and node settings are not recorded).
  const [past, setPast] = useState<Positions[]>([]);
  const [future, setFuture] = useState<Positions[]>([]);
  const dragStart = useRef<Positions | null>(null);
  const positions = (): Positions => Object.fromEntries(nodes.map((n) => [n.id, n.position]));
  const persist = (p: Positions) =>
    editFlow(flow.id, (f) => ({ nodes: f.nodes.map((n) => (p[n.id] ? { ...n, position: p[n.id] } : n)) }));
  const moveTo = (target: Positions) => {
    setNodes((ns) => ns.map((n) => (target[n.id] ? { ...n, position: target[n.id] } : n)));
    persist(target);
  };
  const undo = () => {
    const target = past.at(-1);
    if (!target) return;
    setPast(past.slice(0, -1));
    setFuture([...future, positions()]);
    moveTo(target);
  };
  const redo = () => {
    const target = future.at(-1);
    if (!target) return;
    setFuture(future.slice(0, -1));
    setPast([...past, positions()]);
    moveTo(target);
  };

  const onConnect = (c: Connection) => {
    const sourceHandle = c.sourceHandle ?? null;
    if (flow.edges.some((e) => e.source === c.source && e.target === c.target && e.sourceHandle === sourceHandle)) return;
    editFlow(flow.id, (f) => ({
      edges: [...f.edges, { id: crypto.randomUUID(), source: c.source, target: c.target, sourceHandle }],
    }));
  };

  return (
    <ReactFlow
      className="overflow-none [--workflow-top-control-panel-height:56px]"
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onConnect={onConnect}
      onNodeDragStart={() => (dragStart.current = positions())}
      onNodeDragStop={(_, __, dragged) => {
        const before = dragStart.current;
        if (before) {
          setPast((p) => [...p, before]);
          setFuture([]);
        }
        dragStart.current = null;
        persist(Object.fromEntries(dragged.map((n) => [n.id, n.position])));
      }}
      defaultViewport={initialViewport}
      deleteKeyCode={null}
      proOptions={proOptions}
    >
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} color="#b2b8c3" />
      <TopBar flow={flow} panel={panel} onPanel={(p) => setPanel((cur) => (cur === p ? null : p))} />
      <SidePanels open={panel} versions={flow.versions} onClose={() => setPanel(null)} />
      <Toolbar
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={undo}
        onRedo={redo}
      />
      <MiniMap position="bottom-left" maskColor="rgba(152, 162, 179, 0.4)" className="[&_.react-flow\_\_minimap-svg]:rounded-lg" />
    </ReactFlow>
  );
}

const toolButton = cn(buttonClass("ghost"), "size-8 hover:opacity-100 hover:bg-gray-100");

function ToolButton({ icon, label, onClick, disabled }: { icon: IconName; label: string; onClick?: () => void; disabled?: boolean }) {
  const glyph = <Icon name={icon} variant="fal" className="size-4 text-gray-600" />;
  return onClick ? (
    <button type="button" aria-label={label} className={toolButton} onClick={onClick} disabled={disabled}>
      {glyph}
    </button>
  ) : (
    <Inert aria-label={label} className={toolButton}>
      {glyph}
    </Inert>
  );
}

function Toolbar(props: { canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void }) {
  const { zoomIn, zoomOut, setViewport } = useReactFlow();
  const zoom = useStore((s) => s.transform[2]);
  return (
    <Panel position="bottom-center" className="bg-white p-2 rounded-xl border border-gray-200 shadow-xs flex gap-2">
      <ToolButton icon="arrow-turn-left" label="Undo" onClick={props.onUndo} disabled={!props.canUndo} />
      <ToolButton icon="arrow-turn-right" label="Redo" onClick={props.onRedo} disabled={!props.canRedo} />
      <div className="border-l border-gray-200" />
      <ToolButton icon="flag-swallowtail" label="Go to start" onClick={() => setViewport(initialViewport, { duration: 300 })} />
      <ToolButton icon="square-dashed" label="Select" />
      <ToolButton icon="magnifying-glass" label="Search" />
      <div className="flex">
        <ToolButton icon="circle-minus" label="Zoom out" onClick={() => zoomOut({ duration: 200 })} />
        <Inert className="flex gap-0.5 items-center hover:bg-gray-100 px-1.5 rounded-lg">
          <span className="text-xs text-gray-600">{Math.round(zoom * 100)}%</span>
          <Icon name="caret-down" variant="fas" className="size-3" />
        </Inert>
        <ToolButton icon="circle-plus" label="Zoom in" onClick={() => zoomIn({ duration: 200 })} />
      </div>
    </Panel>
  );
}
