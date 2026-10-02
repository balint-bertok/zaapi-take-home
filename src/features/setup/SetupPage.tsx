import type { ReactNode } from "react";
import { Link } from "react-router";
import { buttonClass } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { ShellPage } from "@/shell/ShellPage";

/**
 * The frame every guided-setup page shares: breadcrumb, "Step N of 5" (none on the intro, step 0),
 * the title and description, the page's own content, and an optional footer row (Back, Continue).
 */
export function SetupPage({
  step,
  title,
  description,
  children,
  footer,
}: {
  step: 0 | 1 | 2 | 3 | 4 | 5;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Set up" }, { label: title }]} className="space-y-8 pb-7">
      <section>
        {step > 0 && <div className="text-xs font-medium text-gray-400">Step {step} of 5</div>}
        <h1 className="text-2xl font-medium">{title}</h1>
        {description && <div className="text-sm text-gray-500 mt-2">{description}</div>}
      </section>
      {children}
      {footer && <div className="flex justify-between items-center pt-2">{footer}</div>}
    </ShellPage>
  );
}

/** Outline "Back" to the previous step. */
export function BackLink({ to }: { to: string }) {
  return (
    <Link to={to} className={buttonClass("outline")}>
      {/* The saved pages carry no arrow-left glyph; arrow-right mirrored is the same shape. */}
      <Icon name="arrow-right" variant="far" className="size-3.5 -scale-x-100" />
      Back
    </Link>
  );
}

/**
 * Gradient "Continue" to the next step. `onClick` runs before the link navigates (mark the step
 * done, save the form). Disabled, it renders a dimmed button that does nothing.
 */
export function ContinueButton({
  to,
  disabled,
  onClick,
  children = "Continue",
}: {
  to: string;
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}) {
  if (disabled)
    return (
      <button type="button" disabled className={cn(buttonClass("ai"), "opacity-50 pointer-events-none")}>
        {children}
      </button>
    );
  return (
    <Link to={to} onClick={onClick} className={buttonClass("ai")}>
      {children}
    </Link>
  );
}
