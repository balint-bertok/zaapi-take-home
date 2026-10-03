import type { ReactNode } from "react";
import { Link } from "react-router";
import { Button, buttonClass } from "@/components/ui/button";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { ShellPage } from "@/shell/ShellPage";
import { stepCounter } from "./content";

/**
 * The frame every guided-setup page shares: breadcrumb, "Step N of M" (none on the setup home),
 * the title and description, the page's own content, and an optional footer row (Back, Continue).
 */
export function SetupPage({
  step,
  title,
  description,
  children,
  footer,
}: {
  step?: 4 | 5;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <ShellPage breadcrumb={[{ label: "AI Agent" }, { label: "Set up" }, { label: title }]} className="space-y-8 pb-7">
      <section>
        {step && <div className="text-xs font-medium text-gray-400">{stepCounter(step)}</div>}
        <h1 className="text-2xl font-medium">{title}</h1>
        {description && <div className="text-sm text-gray-500 mt-2">{description}</div>}
      </section>
      {children}
      {footer && <div className="flex justify-between items-center pt-2">{footer}</div>}
    </ShellPage>
  );
}

/** The bordered card and its title on the Test and Go live pages. */
export const setupCard = "border border-gray-200";
export const setupCardTitle = "text-base font-medium text-gray-800";

const back = (
  <>
    {/* The saved pages carry no arrow-left glyph; arrow-right mirrored is the same shape. */}
    <Icon name="arrow-right" variant="far" className="size-3.5 -scale-x-100" />
    Back
  </>
);

/** Outline "Back" to the previous step. */
export function BackLink({ to }: { to: string }) {
  return (
    <Link to={to} className={buttonClass("outline")}>
      {back}
    </Link>
  );
}

/** The same "Back" within a step: a button, since it changes the screen's own state rather than the URL. */
export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      {back}
    </Button>
  );
}

/**
 * "Continue" to the next step: the gradient button on a page, the inbox onboarding's dark one in the
 * setup modal. `onClick` runs before the link navigates (mark the step done, save the form).
 * Disabled, it renders a dimmed button that does nothing.
 */
export function ContinueButton({
  to,
  disabled,
  onClick,
  variant = "ai",
  children = "Continue",
}: {
  to: string;
  disabled?: boolean;
  onClick?: () => void;
  variant?: "ai" | "default";
  children?: ReactNode;
}) {
  if (disabled)
    return (
      <button type="button" disabled className={cn(buttonClass(variant), "opacity-50 pointer-events-none")}>
        {children}
      </button>
    );
  return (
    <Link to={to} onClick={onClick} className={buttonClass(variant)}>
      {children}
    </Link>
  );
}
