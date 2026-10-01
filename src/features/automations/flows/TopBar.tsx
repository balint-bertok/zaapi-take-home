import { Panel } from "@xyflow/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Inert } from "@/components/Inert";
import { Button, buttonClass } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { useDemo } from "@/store/store";
import type { Flow } from "../fixtures";
import { publishFlow } from "./model";
import type { SidePanelKey } from "./SidePanels";
import { StatusBadge } from "./StatusBadge";

const iconButton = (active: boolean) =>
  cn(buttonClass("ghost", "icon"), "group hover:opacity-100 hover:bg-gray-100", active && "bg-gray-100");

/** The builder's 56px top bar: back, version history, logs, name with status, saved state, publish. */
export function TopBar({ flow, panel, onPanel }: { flow: Flow; panel: SidePanelKey | null; onPanel: (p: SidePanelKey) => void }) {
  const navigate = useNavigate();
  const user = useDemo((s) => s.user.name);
  const [confirming, setConfirming] = useState(false);
  const published = flow.status === "published";

  const publish = () => {
    publishFlow(flow.id, user);
    setConfirming(false);
    toast.success(published ? "Update Successful" : "Successfully published automation");
  };

  return (
    <Panel
      position="top-center"
      className="w-full h-(--workflow-top-control-panel-height) border-b border-gray-100 flex items-center justify-between gap-4 m-0! px-7 py-3 bg-white"
    >
      <div className="flex gap-3">
        <Button variant="outline" size="icon" aria-label="Back" onClick={() => navigate("/automations/flows")}>
          <Icon name="chevron-left" variant="fal" className="size-4" />
        </Button>
        <button type="button" aria-label="Version history" className={cn(iconButton(panel === "history"), "ml-1")} onClick={() => onPanel("history")}>
          <Icon name="clock-rotate-left" variant="fal" className="size-4 text-gray-500 group-hover:text-gray-800" />
        </button>
        <button type="button" aria-label="Automation logs" className={iconButton(panel === "logs")} onClick={() => onPanel("logs")}>
          <Icon name="sitemap" variant="fal" className="size-4 text-gray-500 group-hover:text-gray-800 -rotate-90" />
        </button>
      </div>
      <div className="flex items-center gap-1">
        <div className="flex gap-0.5">
          <Inert className="px-3 py-2 rounded-lg hover:bg-gray-50 max-w-[440px]">
            <h1 className="text-sm font-medium truncate">{flow.name}</h1>
          </Inert>
          <Inert className="py-2 px-1.5 hover:bg-gray-50 rounded-lg">
            <StatusBadge status={flow.status} />
          </Inert>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-gray-400 text-sm flex gap-1.5 items-center">
          <Icon name="circle-check" className="size-3.5 text-gray-400" />
          Saved
        </div>
        {published ? (
          <Button size="sm" disabled={!flow.unpublishedChanges} onClick={publish}>
            <Icon name="play" className="size-4" />
            Update
          </Button>
        ) : (
          <Button size="sm" onClick={() => setConfirming(true)}>
            <Icon name="play" className="size-4" />
            Publish
          </Button>
        )}
      </div>

      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <DialogTitle className="tracking-tight font-medium mb-0 text-lg">Do you want to publish this automation?</DialogTitle>
          </div>
          <p className="whitespace-pre-line text-gray-500 text-sm">
            {"This automation is enabled immediately upon publishing. You can adjust or pause the flow at any time after publishing.\n\nNote: Changes made after publishing will not affect the active automation until you click 'Update' to apply them."}
          </p>
          <div className="flex justify-end items-center gap-3 mt-4 pt-4 border-t border-gray-200">
            <DialogClose className={buttonClass("outline")}>Cancel</DialogClose>
            <Button onClick={publish}>Publish now</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
