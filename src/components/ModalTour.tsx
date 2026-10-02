import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { DialogOverlay } from "@/components/ui/dialog";
import { cn } from "@/lib/cn";

// The frame of the first-visit inbox modals (auth onboarding) and the guided setup's modal: markup and
// classes from the saved tickets pages.

/** The inbox modals' field label. */
export const fieldLabel = "text-gray-800 font-medium text-sm mb-2 inline-block";

/**
 * An always-open modal over the page: `children` is the card (a `StepCard`), `counter` the white
 * "Step N of M" line under it.
 */
export function ModalTour({ counter, children }: { counter?: string; children: ReactNode }) {
  return (
    <DialogPrimitive.Root open>
      <DialogPrimitive.Portal>
        {/* The steps sit inside the overlay, which scrolls, so a window smaller than a step can
            still reach its buttons; the modals cannot be dismissed any other way. */}
        <DialogOverlay className="overflow-auto">
          <div className="flex min-h-full min-w-fit flex-col items-center justify-center gap-8 p-4">
            {children}
            {counter && (
              <p className="text-sm text-white" aria-hidden="true">
                {counter}
              </p>
            )}
          </div>
        </DialogOverlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/**
 * One modal card: centred title and subtitle over the body, with `top` (the setup's step bar) above
 * them. Escape and outside clicks do nothing. The card takes focus itself when a step opens with no
 * field focused, without the browser's ring.
 */
export function StepCard({
  width,
  top,
  title,
  subtitle,
  onOpenAutoFocus,
  children,
}: {
  width: string;
  top?: ReactNode;
  title: string;
  subtitle: string;
  onOpenAutoFocus?: (e: Event) => void;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Content
      aria-describedby={undefined}
      onOpenAutoFocus={onOpenAutoFocus}
      onEscapeKeyDown={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      className={cn("rounded-lg border bg-white shadow-lg overflow-hidden outline-none", width)}
    >
      {top}
      <div className="flex flex-col items-center justify-center border-b px-6 py-4 text-center">
        <DialogPrimitive.Title className="text-base font-semibold text-gray-800">{title}</DialogPrimitive.Title>
        <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </DialogPrimitive.Content>
  );
}
