import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps, ReactNode } from "react";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";

// Right-hand sheet on Radix Dialog. Class lists copied from the "Add new personality" and
// "Add scenario" sheets open in the saved AI Agent pages: 3/5 of the viewport, capped at 800px,
// gray-50 body under a bordered title row, close "x" top right, black/50 backdrop.
export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

type Props = Omit<ComponentProps<typeof DialogPrimitive.Content>, "title"> & { title: ReactNode };

export function SheetContent({ title, className, children, ...props }: Props) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        aria-describedby={undefined}
        className={cn(
          "fixed z-50 rounded-lg overflow-hidden shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 top-3 bottom-3 right-3 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right bg-gray-50 flex flex-col gap-0 p-0 max-w-[800px] w-3/5",
          className,
        )}
        {...props}
      >
        <div className="flex flex-col space-y-2 text-left px-7 py-4 border-b bg-gray-50">
          <DialogPrimitive.Title className="font-semibold text-gray-800 text-lg">{title}</DialogPrimitive.Title>
        </div>
        {children}
        <DialogPrimitive.Close className="absolute flex right-4 top-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-hidden disabled:pointer-events-none">
          <Icon name="x" className="size-4! m-auto" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
