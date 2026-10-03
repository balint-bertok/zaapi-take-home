import { useLayoutEffect, useState } from "react";
import { Link } from "react-router";
import { Icon } from "@/icons/Icon";
import { useDemo } from "@/store/store";

/**
 * The inbox's nudge onto the guided path (user decision 2026-10-03): after sign-up a viewer may
 * click around instead of starting, so a small callout points at the rail's AI Agent entry until
 * the first setup step is done. It names the demo, so it reads as the demo's sign, not the
 * dashboard's (user decision, same day). Positioned against that entry's measured box, since the rail's
 * item list clips what overflows it.
 */
export function StartHere() {
  const show = useDemo((s) => s.onboardingDone && s.setupDone.length === 0 && !s.agentLive);
  const [top, setTop] = useState<number | null>(null);
  useLayoutEffect(() => {
    if (!show) return;
    const place = () => {
      const entry = document.querySelector('nav[aria-label="Main"] a[aria-label="AI Agent"]');
      const box = entry?.getBoundingClientRect();
      setTop(box ? box.top + box.height / 2 : null);
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [show]);
  if (!show || top === null) return null;
  return (
    <Link
      to="/ai/setup"
      aria-label="Start the demo here: set up your first AI Agent"
      style={{ top }}
      className="fixed left-[68px] z-40 -translate-y-1/2 flex items-center gap-2 rounded-lg border border-electric-green-500 bg-white px-3 py-2 text-sm shadow-medium hover:bg-gray-50"
    >
      {/* The arrow, pointing at the icon the callout sits beside. */}
      <span aria-hidden="true" className="absolute -left-2 top-1/2 -translate-y-1/2 size-0 border-y-8 border-y-transparent border-r-8 border-r-electric-green-500" />
      <Icon name="ai-symbol" className="ai-gradient-icon size-4!" />
      <span>
        <span className="font-medium text-gray-800">Start the demo here.</span>{" "}
        <span className="text-gray-600">Set up your first AI Agent.</span>
      </span>
      <Icon name="arrow-right" variant="far" className="size-3.5! text-gray-500" />
    </Link>
  );
}
