import { ReactFlowProvider } from "@xyflow/react";
import { Navigate, useSearchParams } from "react-router";
import { useDemo } from "@/store/store";
import { FlowCanvas } from "./flows/FlowCanvas";

/** /automations/flow-builder?id=…: the canvas for one stored flow; an unknown id goes back to the list. */
export default function FlowBuilderPage() {
  const [params] = useSearchParams();
  const id = params.get("id");
  const flow = useDemo((s) => s.flows.find((f) => f.id === id));
  if (!flow) return <Navigate to="/automations/flows" replace />;
  return (
    <div className="flex bg-sidebar">
      <section className="grow relative overflow-hidden bg-(--content-area-background)">
        <div className="w-full bg-gray-50 h-[calc(100vh-var(--banner-height))]">
          <ReactFlowProvider>
            <FlowCanvas key={flow.id} flow={flow} />
          </ReactFlowProvider>
        </div>
      </section>
    </div>
  );
}
