import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/**
 * The two-button question dialog of the activation step (screenshot "Step 12 (automations) (4)"):
 * title and text on white, a gray footer with the secondary action left and the primary right.
 * The delete confirmation reuses it, as its own markup was not captured.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  secondary,
  onSecondary,
  primary,
  onPrimary,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  secondary: string;
  onSecondary: () => void;
  primary: string;
  onPrimary: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0">
        <div className="flex flex-col gap-y-1 p-5">
          <DialogTitle className="text-[16px] font-bold text-gray-900">{title}</DialogTitle>
          <DialogDescription className="text-sm leading-6 text-gray-600">{description}</DialogDescription>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-5 py-3.5">
          <Button variant="outline" onClick={onSecondary}>
            {secondary}
          </Button>
          <Button onClick={onPrimary}>{primary}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
