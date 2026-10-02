import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { skipConsequence } from "./content";

/**
 * "Skip scenarios?": the activation step's question dialog (`ConfirmDialog` in automations), with
 * the consequence of skipping and where to add scenarios later on two lines.
 */
export function SkipDialog({ open, onOpenChange, onSkip }: { open: boolean; onOpenChange: (open: boolean) => void; onSkip: () => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-y-1 p-5">
          <DialogTitle className="text-[16px] font-bold text-gray-900">Skip scenarios?</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-gray-600">
            {skipConsequence}
            <br />
            You can add them any time from Scenario Handling.
          </DialogDescription>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3.5">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Go back
          </Button>
          <Button onClick={onSkip}>Skip anyway</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
