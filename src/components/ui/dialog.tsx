import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

// Centered dialog and right-hand sheet, with class lists from the dialogs open in the saved pages.
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

type ContentProps = ComponentProps<typeof DialogPrimitive.Content>;

/** The dimmed, blurred backdrop every modal in the app shares. */
export function DialogOverlay() {
  return (
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#1D2939]/40 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
  );
}

function Modal({ className, ...props }: ContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content aria-describedby={undefined} className={className} {...props} />
    </DialogPrimitive.Portal>
  );
}

export function DialogContent({ className, ...props }: ContentProps) {
  return (
    <Modal
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 rounded-lg w-[560px] p-4",
        className,
      )}
      {...props}
    />
  );
}

export function SheetContent({ className, ...props }: ContentProps) {
  return (
    <Modal
      className={cn(
        "fixed z-50 rounded-lg overflow-hidden p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 top-3 bottom-3 right-3 max-w-sm md:max-w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right bg-gray-50 flex flex-col gap-0",
        className,
      )}
      {...props}
    />
  );
}
