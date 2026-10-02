import { NavLink, useLocation } from "react-router";
import { Inert } from "@/components/Inert";
import { Icon } from "@/icons/Icon";
import { cn } from "@/lib/cn";
import { sidebarActiveItem, sidebarAside, sidebarItem } from "@/shell/SectionSidebar";
import { useDemo } from "@/store/store";
import type { SetupStep } from "./fixtures";

const title = "Set up your AI Agent";

// The five steps in tour order; "Go live" has no SetupStep, `agentLive` marks it done.
const steps: { label: string; to: string; step?: SetupStep }[] = [
  { label: "Persona", to: "/ai/setup/persona", step: "persona" },
  { label: "Scenarios", to: "/ai/setup/scenarios", step: "scenarios" },
  { label: "Knowledge", to: "/ai/setup/knowledge", step: "knowledge" },
  { label: "Test", to: "/ai/setup/test", step: "test" },
  { label: "Go live", to: "/ai/setup/live" },
];

/**
 * The setup's step menu, in the section sidebar's frame. Done steps and the current one link (an
 * entry is active on its own URL and any below it); later steps are inert, so the tour only moves
 * forward. The current step is the page on screen, or else the first one not done.
 */
export function SetupSidebar() {
  const setupDone = useDemo((s) => s.setupDone);
  const agentLive = useDemo((s) => s.agentLive);
  const { pathname } = useLocation();
  const done = steps.map(({ step }) => (step ? setupDone.includes(step) : agentLive));
  const next = done.indexOf(false);
  return (
    <aside aria-label={title} className={sidebarAside}>
      <div className="flex gap-2 p-2 pt-5 px-3 pb-2 flex-row items-center justify-between">
        <h2 className="pl-2 font-semibold text-base text-gray-900">{title}</h2>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto px-3 pb-24 relative">
        <div className="relative flex w-full min-w-0 flex-col p-0">
          <div className="mb-1 flex items-center justify-between gap-2">
            <div className="flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70">Steps</div>
          </div>
          <ul className="flex w-full min-w-0 flex-col gap-2 text-sm">
            {steps.map(({ label, to }, i) => {
              const body = (
                <>
                  <span className="font-medium shrink-0">{label}</span>
                  {done[i] && <Icon name="check" className="size-3.5 text-electric-green-600" />}
                </>
              );
              const reachable = done[i] || i === next || pathname === to || pathname.startsWith(`${to}/`);
              return (
                <li key={label} className="relative">
                  {reachable ? (
                    <NavLink to={to} end={false} className={({ isActive }) => cn(sidebarItem, "justify-between", isActive && sidebarActiveItem)}>
                      {body}
                    </NavLink>
                  ) : (
                    <Inert className={cn(sidebarItem, "justify-between")}>{body}</Inert>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {/* The memo keeps an exit from the setup visible; the demo tour stays on its path, so it is inert. */}
      <div className="mt-auto px-3">
        <Inert className={cn(sidebarItem, "text-xs text-gray-400")}>I know what I'm doing, skip the setup</Inert>
      </div>
    </aside>
  );
}
